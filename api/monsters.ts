import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCollection } from "../utilities/MongoUtils";
import microCors from "micro-cors";
const cors = microCors();

const handler = async (request: VercelRequest, response: VercelResponse) => {
  try {
    const _id: any = request.query._id;
    const data = _id
      ? await fetchCollection("monsters", { _id })
      : await fetchCollection("monsters");

    response.status(200).send(data);
  } catch (e) {
    response.status(504).send(e);
  }
};
export default cors(handler);
