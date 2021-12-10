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
      ? await fetchCollection("parties", {
          _id: new ObjectId(id),
        })
      : await fetchCollection("parties");

    if (id) {
      const { members } = data[0];
      data = await Promise.all(
        members.map(async (partyMemberId: string) => {
          const url = `https://sotdl-api-fetch.vercel.app/api/characters?_id=${partyMemberId}`;

          const { data: characterData } = await axios(url);
          console.log(data);

          return {
            _id: partyMemberId,
            name: characterData.name,
            currentHealth:
              characterData.characteristics.Health -
              characterData.characterState.damage,
            health: characterData.characteristics.Health,
            damage: characterData.characterState.damage,
          };
        })
      );
    }

    response.status(200).send(data);
  } catch (e) {
    response.status(504).send(e);
  }
};
export default cors(handler);
