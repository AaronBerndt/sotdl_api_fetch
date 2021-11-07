import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCollection } from "../utilities/MongoUtils";
import microCors from "micro-cors";
import { ObjectId } from "mongodb";
import { find, groupBy, sumBy, filter } from "lodash";
import conditionalObject from "./conditionals";
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

      const [ancestry] = await fetchCollection("ancestries", {
        name: characterData.ancestry,
      });

      const paths = await fetchCollection("paths");

      const filterByLevel = (array) =>
        array.filter(({ level }) => level <= characterData.level);

      const filterByPathName = (name: string, key: string) =>
        name !== "" ? find(paths, { name })[key] : [];

      const filterBySubPath = (name: string, key: string) => {
        if (name === "") {
          return [];
        }
        if (name === "Adept") {
          return filterByPathName(name, key);
        }
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

        if (choiceObject.value !== "None" || null) {
          const subPathData = find(filterByPathName(name, keyObject[name]), {
            name: choiceObject.value,
          });

          return subPathData[key];
        }
        return filterByPathName(name, key);
      };

      const createAncestryList = async (list, type) => {
        const hasPastLife = find(characterData.choices, { name: "Past Life" });

        if (hasPastLife) {
          const [pastLife] = await fetchCollection("ancestries", {
            name: hasPastLife.value,
          });

          const pastLifeList = pastLife[type];
          return [...list, ...pastLifeList];
        } else {
          return list;
        }
      };

      const talents = [
        ...filterByLevel(await createAncestryList(ancestry.talents, "talents")),
        ...filterByLevel(filterBySubPath(characterData.novicePath, "talents")),
        ...filterByLevel(filterByPathName(characterData.expertPath, "talents")),
        ...filterByLevel(filterByPathName(characterData.masterPath, "talents")),
      ];

      const characteristicsFromPaths = [
        ...filterByLevel(
          filterBySubPath(characterData.novicePath, "characteristics")
        ),
        ...filterByLevel(
          filterByPathName(characterData.expertPath, "characteristics")
        ),
        ...filterByLevel(
          filterByPathName(characterData.masterPath, "characteristics")
        ),
      ];

      const characteristics = [
        ...filterByLevel(
          await createAncestryList(ancestry.characteristics, "characteristics")
        ),
        ...(find(talents, { name: "Wee" })
          ? characteristicsFromPaths.map((characteristic) => {
              if (characteristic.name === "Health") {
                const { value, ...rest } = characteristic;
                return { ...rest, value: Math.round(value / 2) };
              }
              return characteristic;
            })
          : characteristicsFromPaths),
        ...characterData.characteristics,
        ...characterData.characterState.overrides,
      ].map(({ value, ...rest }) => ({ ...rest, value: Number(value) }));

      const characteristicsObject = Object.assign(
        {},
        ...Object.entries(groupBy(characteristics, "name")).map(
          ([NAME, VALUES]: any) => ({
            [NAME]: sumBy(VALUES, "value"),
          })
        )
      );

      const { Health, Perception, ...rest } = characteristicsObject;
      const conditionals = conditionalObject({
        characteristics,
        items: {
          weapons: characterData.items.weapons,
          armor: characterData.items.armor,
          otherItems: characterData.items.otherItems,
          currency: characterData.items.currency,
        },
      });

      finaldata = {
        _id: id,
        name: characterData.name,
        level: characterData.level,
        ancestry: characterData.ancestry,
        novicePath: characterData.novicePath,
        expertPath: characterData.expertPath,
        masterPath: characterData.masterPath,
        characteristics: {
          Health: Health + characteristicsObject.Strength,
          Perception: Perception + characteristicsObject.Intellect,
          ...rest,
        },
        talents: talents,
        spells: characterData.spells,
        traditions: characterData.traditions,
        attacks: {},
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
        conditionals: Object.entries(conditionals).filter(([NAME]) =>
          find(talents, NAME)
        ),
        choices: characterData.choices
          ? filterByLevel(characterData.choices)
          : [],
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
