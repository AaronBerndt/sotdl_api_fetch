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
    let finaldata = null;
    const data = id
      ? await fetchCollection("characters", { _id: new ObjectId(id) })
      : await fetchCollection("characters", {});

    if (id) {
      const [characterData] = data;

      const {
        data: [ancestry],
      } = await axios(
        `https://sotdl-api-fetch.vercel.app/api/ancestries?name=${characterData.ancestry}`
      );

      const { data: paths } = await axios(
        `https://sotdl-api-fetch.vercel.app/api/paths`
      );

      const filterByLevel = (array) =>
        array.filter(({ level }) => level <= characterData.level);

      const filterByPathName = (name: string, key: string) =>
        name !== "" ? find(paths, { name })[key] : [];

      const filterBySubPath = (name: string, key: string) => {
        console.log(name, key);
        const keyObject: any = {
          Warrior: "disciplines",
          Magician: "focuses",
          Priest: "faith",
          Rogue: "knacks",
        };

        const talentName: any = {
          Warrior: "Discipline",
          Magician: "Tradition Focus",
          Priest: "Faith",
          Rogue: "Knack",
        };

        const choiceObject = find(characterData.choices, {
          name: talentName[name],
        });

        const subPathData = find(filterByPathName(name, keyObject[name]), {
          name: choiceObject.value,
        });

        return subPathData[key];
      };

      finaldata = {
        _id: id,
        name: characterData.name,
        level: characterData.level,
        ancestry: characterData.ancestry,
        novicePath: characterData.novicePath,
        expertPath: characterData.expertPath,
        masterPath: characterData.masterPath,
        characteristics: [
          ...filterByLevel(ancestry.characteristics),
          ...filterByLevel(
            filterBySubPath(characterData.novicePath, "characteristics")
          ),
          ...filterByLevel(
            filterByPathName(characterData.expertPath, "characteristics")
          ),
          ...filterByLevel(
            filterByPathName(characterData.masterPath, "characteristics")
          ),
          ...characterData.characteristics,
        ].map(({ value, ...rest }) => ({ ...rest, value: Number(value) })),
        talents: [
          ...filterByLevel(ancestry.talents),
          ...filterByLevel(
            filterBySubPath(characterData.novicePath, "talents")
          ),
          ...filterByLevel(
            filterByPathName(characterData.expertPath, "talents")
          ),
          ...filterByLevel(
            filterByPathName(characterData.masterPath, "talents")
          ),
        ],
        spells: characterData.spells,
        traditions: characterData.traditions,
        items: {
          weapons: characterData.items.weapons,
          armor: characterData.items.armor,
          otherItems: characterData.items.otherItems,
          currency: characterData.items.currency,
        },
        languages: characterData.languages,
        professions: characterData.professions,
        details: characterData.details,
        characterState: characterData.characterState,
        choices: characterData.choices,
      };
    } else {
      finaldata = data;
    }
    response.status(200).send(finaldata);
  } catch (e) {
    response.status(504).send(e);
  }
};
export default cors(handler);
