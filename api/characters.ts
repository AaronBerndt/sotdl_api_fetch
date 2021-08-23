import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCollection } from "../utilities/MongoUtils";
import microCors from "micro-cors";
import { ObjectId } from "mongodb";
import axios from "axios";
import { find } from "lodash";
const cors = microCors();

const handler = async (request: VercelRequest, response: VercelResponse) => {
  try {
    const id: any = request.query._id;
    let finalData = null;
    const data = id
      ? await fetchCollection("characters", { _id: new ObjectId(id) })
      : await fetchCollection("characters", {});

    if (id) {
      const { ancestry: characterAncestry, level } = data;
      const {
        data: [ancestry],
      } = await axios(
        `https://sotdl-api-fetch.vercel.app/api/ancestries?name=${characterAncestry}`
      );

      const { data: paths } = await axios(
        `https://sotdl-api-fetch.vercel.app/api/paths`
      );

      const filterByLevel = (array) =>
        array.filter(({ level }) => level <= level);

      const filterByPathName = (name: string, key: string) =>
        name !== "" ? find(paths, { name })[key] : [];

      finalData = {
        name: data.name,
        level: data.level,
        ancestry: data.ancestry,
        novicePath: data.novicePath,
        expertPath: data.expertPath,
        masterPath: data.masterPath,
        characteristics: [
          ...filterByLevel(ancestry.characteristics),
          ...filterByLevel(
            filterByPathName(data.novicePath, "characteristics")
          ),
          ...filterByLevel(
            filterByPathName(data.expertPath, "characteristics")
          ),
          ...filterByLevel(
            filterByPathName(data.masterPath, "characteristics")
          ),
          ...data.characteristics,
        ].map(({ value, ...rest }) => ({ ...rest, value: Number(value) })),
        talents: [
          ...filterByLevel(ancestry.talents),
          ...filterByLevel(filterByPathName(data.novicePath, "talents")),
          ...filterByLevel(filterByPathName(data.expertPath, "talents")),
          ...filterByLevel(filterByPathName(data.masterPath, "talents")),
        ],
        spells: data.spells,
        traditions: data.traditions,
        items: {
          weapons: data.items.filter(({ itemType }) => itemType === "weapon"),
          armor: data.items.filter(({ itemType }) => itemType === "armor"),
          otherItems: data.items.filter(({ itemType }) => itemType === "basic"),
          currency: data.currency,
        },
        languages: [],
        professions: [],
        details: [],
        characterState: {
          damage: 0,
          expended: [],
          overrides: data.overrides,
          afflictions: [],
        },
      };
    } else {
      finalData = data;
    }
    response.status(200).send(finalData);
  } catch (e) {
    response.status(504).send(e);
  }
};
export default cors(handler);
