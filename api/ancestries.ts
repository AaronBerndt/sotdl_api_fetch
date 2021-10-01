import { VercelRequest, VercelResponse } from "@vercel/node";
import microCors from "micro-cors";
import { fetchCollection } from "../utilities/MongoUtils";
import { orderBy } from "lodash";

const cors = microCors();

const handler = async (request: VercelRequest, response: VercelResponse) => {
  try {
    const name: any = request.query.name;
    const data = name
      ? await fetchCollection("ancestries", { name })
      : await fetchCollection("ancestries");
    response.status(200).send(orderBy(data, ["name"]));
  } catch (e) {
    response.status(504).send(e);
  }
};

export default cors(handler);
