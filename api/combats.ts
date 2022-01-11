import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCollection } from "../utilities/MongoUtils";
import microCors from "micro-cors";
import { ObjectId } from "mongodb";
import axios from "axios";
import { uniq, find, flatten } from "lodash";
const cors = microCors();

const handler = async (request: VercelRequest, response: VercelResponse) => {
  try {
    const id: any = request.query._id;
    let data = id
      ? await fetchCollection("combats", { _id: new ObjectId(id) })
      : await fetchCollection("combats", {});

    console.log(data);
    if (id) {
      const { combatants, partyId, ...rest } = data[0];

      const { data: partyData } = await axios(
        `https://sotdl-api-fetch.vercel.app/api/parties?_id=${partyId}`
      );

      const monsterStatData = await Promise.all(
        uniq(combatants.map(({ monsterId }: any) => monsterId)).map(
          async (monsterId) => {
            let { data } = await axios(
              `https://sotdl-api-fetch.vercel.app/api/monsters?_id=${monsterId}`
            );
            return data;
          }
        )
      );

      const monsterData = await Promise.all(
        combatants.map(async (combatant) => {
          const { monsterId, damage, ...rest } = combatant;

          const data = find(flatten(monsterStatData), { _id: monsterId });
          const maxHealth = data.characteristics.Health;
          return {
            ...rest,
            damage,
            monsterId,
            currentHealth: maxHealth - damage <= 0 ? 0 : maxHealth - damage,
            maxHealth,
            actions: data.actions,
            defense: data.characteristics.Defense,
            monsterInfo: data,
          };
        })
      );

      data = {
        ...rest,
        partyId,
        combatants: [...monsterData, ...partyData],
      };
    }

    response.status(200).send(data);
  } catch (e) {
    response.status(504).send(e);
  }
};
export default cors(handler);
