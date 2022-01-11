import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCollection } from "../utilities/MongoUtils";
import microCors from "micro-cors";
import { ObjectId } from "mongodb";
import axios from "axios";
const cors = microCors();

const handler = async (request: VercelRequest, response: VercelResponse) => {
  try {
    const id: any = request.query._id;
    let data = id
      ? await fetchCollection("combats", { _id: new ObjectId(id) })
      : await fetchCollection("combats", {});

    if (id) {
      const { combatants, partyId, ...rest } = data[0];

      const { data: partyData } = await axios(
        `https://sotdl-api-fetch.vercel.app/api/parties?_id=${partyId}`
      );

      const monsterData = await Promise.all(
        combatants.map(async (combatant) => {
          const { monsterId, damage, ...rest } = combatant;
          let { data } = await axios(
            `https://sotdl-api-fetch.vercel.app/api/monsters?_id=${combatant.monsterId}`
          );
          const maxHealth = data.characteristics.Health;
          return {
            ...rest,
            damage,
            monsterId,
            currentHealth: maxHealth - damage <= 0 ? 0 : maxHealth - damage,
            maxHealth,
            ...data,
          };
        })
      );

      data = {
        ...rest,
        partyId,
        combatants: monsterData,
        ...partyData,
      };
    }

    response.status(200).send(data);
  } catch (e) {
    response.status(504).send(e);
  }
};
export default cors(handler);
