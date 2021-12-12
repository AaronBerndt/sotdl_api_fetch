import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCollection } from "../utilities/MongoUtils";
import microCors from "micro-cors";
import { ObjectId } from "mongodb";
const cors = microCors();

const handler = async (request: VercelRequest, response: VercelResponse) => {
  try {
    const id: any = request.query._id;
    const data = await fetchCollection("combatTemplates", {});

    response.status(200).send(id ? data[0] : data);
  } catch (e) {
    response.status(504).send(e);
  }
};
export default cors(handler);
