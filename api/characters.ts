import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCollection } from "../utilities/MongoUtils";
import microCors from "micro-cors";
import { ObjectId } from "mongodb";
import { find, groupBy, sumBy, filter, flatten } from "lodash";
import conditionalObject from "../utilities/conditionals";
import passiveIncreaseObject from "../utilities/passiveIncrease";
import temporaryEffectsObject from "../utilities/temporaryEffects";
import talentUsesObject from "../utilities/talentUses";
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

      const spells =
        characterData.spells.length === 0
          ? []
          : await fetchCollection("spells", {
              $or: characterData.spells.map((name: any) => ({ name })),
            });

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

      const characterDataObject = {
        characteristics: characteristicsObject,
        items: {
          weapons: characterData.items.weapons,
          armor: characterData.items.armor,
          otherItems: characterData.items.otherItems,
          currency: characterData.items.currency,
        },
        characterState: {
          ...characterData.characterState,
          injured: false,
        },
      };
      const conditionals = Object.entries(
        conditionalObject(characterDataObject)
      )
        .filter(([NAME]) => {
          return talents.map(({ name }) => name).includes(NAME);
        })
        .map((entry) => entry[1])
        .filter((condition) => condition !== null);

      const passiveIncreases = Object.entries(
        passiveIncreaseObject(characterDataObject)
      )
        .filter(([NAME]) => {
          return talents.map(({ name }) => name).includes(NAME);
        })
        .map((entry) => entry[1])
        .filter((passiveIncrease) => passiveIncrease !== null);

      const temporaryEffects: any = flatten(
        Object.entries(temporaryEffectsObject(characterDataObject))
          .map((entry) => entry[1])
          .filter((passiveIncrease) => passiveIncrease !== null)
      );

      const talentUses: any = flatten(
        Object.entries(talentUsesObject(characterDataObject))
          .map((entry) => entry[1])
          .filter((talentUse) =>
            talents.map(({ name }) => name).includes(talentUse.name)
          )
      );

      const equipedWithArmor = characterData.items.armor.filter(
        ({ equiped }: any) => equiped
      );

      const equipedDefensiveWeapons = characterData.items.weapons.filter(
        ({ properties, equiped }: any) =>
          properties.some((property) => property.match(/Defensive/)) && equiped
      );

      const talentIncreases = [
        ...conditionals,
        ...passiveIncreases,
        ...temporaryEffects,
      ];

      finaldata = {
        _id: id,
        name: characterData.name,
        level: characterData.level,
        ancestry: characterData.ancestry,
        novicePath: characterData.novicePath,
        expertPath: characterData.expertPath,
        masterPath: characterData.masterPath,
        characteristics: {
          Health:
            Health +
            characteristicsObject.Strength +
            sumBy(
              filter(talentIncreases, {
                name: "Health",
              }),
              "value"
            ),

          Perception: Perception + characteristicsObject.Intellect,
          Defense:
            equipedWithArmor.length === 0
              ? (characteristicsObject.Defense
                  ? characteristicsObject.Defense
                  : 0) +
                characteristicsObject.Agility +
                sumBy(
                  filter(talentIncreases, {
                    name: "Defense",
                  }),
                  "value"
                )
              : (characteristicsObject.Defense
                  ? characteristicsObject.Defense
                  : 0) +
                  sumBy(filter(talentIncreases, { name: "Defense" }), "value") +
                  equipedWithArmor[0].value +
                  (equipedWithArmor[0].properties.includes("Agility")
                    ? characteristicsObject.agility
                    : 0) +
                  equipedDefensiveWeapons !==
                0
              ? Math.max(
                  ...equipedDefensiveWeapons.map(({ properties }: any) => {
                    const [defensive] = properties.filter((property: string) =>
                      property.includes("Defensive")
                    );

                    const defenseValue = defensive.match(/\d+/);

                    return defenseValue;
                  })
                )
              : 0,
          Speed:
            characteristicsObject.speed +
            (equipedWithArmor.length !== 0
              ? (characteristicsObject.strength <
                equipedWithArmor[0].requirement
                  ? -2
                  : 0) + (equipedWithArmor[0].type === "heavy" ? -2 : 0)
              : 0),
          ...rest,
        },
        talents: talents.map((talent) => {
          const uses = find(talentUses, { name: talent.name });
          if (uses) {
            return { ...talent, uses: uses.value };
          }
          return talent;
        }),
        spells: spells.map((spell) => {
          const { attribute, damage, tradition, ...rest } = spell;
          const regex = /(-?\d+)/g;
          const result = damage ? damage.match(regex) : "";
          const diceAmount = damage ? result![0] : "";
          const diceType = damage ? result![1] : "";
          const extraSpellDamage = damage ? result![2] : "";

          const spellDamageConditionals = filter(talentIncreases, {
            name: "Spell Dice Damage",
          });
          ("value");

          const spellBoonConditionals = filter(talentIncreases, {
            name: `Spell Boon`,
          });
          ("value");

          const spellDamageConditionalsWithType = filter(talentIncreases, {
            name: `${tradition} Spell Dice Damage`,
          });
          ("value");

          const spellBoonConditionalsWithType = filter(talentIncreases, {
            name: `${tradition} Spell Boon`,
          });
          ("value");

          const extraDamageDice = sumBy(
            [...spellDamageConditionals, spellDamageConditionalsWithType],
            "value"
          );

          const boons = sumBy(
            [...spellBoonConditionals, spellBoonConditionalsWithType],
            "value"
          );

          const newDiceAmount =
            diceType === "3"
              ? `${diceAmount}d${diceType} ${
                  extraDamageDice !== 0 ? `+ ${extraDamageDice}d6` : ""
                } ${extraSpellDamage ? `+ ${extraSpellDamage}` : ""}`
              : `${Number(diceAmount) + extraDamageDice}d${diceType}`;
          return {
            ...rest,
            attribute,
            attackRoll: spell.description.includes("attack roll")
              ? `${
                  characteristicsObject[
                    attribute === "Intellect" ? "Intellect" : "Will"
                  ] - 10
                }${boons ? ` + ${boons}B` : ""}`
              : null,
            damageRoll: `${damage ? newDiceAmount : null}`,
          };
        }),
        traditions: characterData.traditions,
        items: {
          weapons: characterData.items.weapons.map(
            ({ damage, properties, ...rest }) => {
              const regex = /(-?\d+)/g;
              const result = damage.match(regex);
              const diceAmount = result![0];
              const diceType = result![1];
              const extraWeaponDamage = result![2];
              const weaponDamageConditions = filter(talentIncreases, {
                name: "Weapon Dice Damage",
              });
              ("value");

              const weaponBoonConditions = filter(talentIncreases, {
                name: "Weapon Boon",
              });
              ("value");

              const weaponBaneConditions = filter(talentIncreases, {
                name: "Weapon Boon",
              });
              ("value");

              const extraWeaponDamageConditions = filter(talentIncreases, {
                name: "Extra Weapon Damage",
              });
              ("value");

              const boons = sumBy(weaponBoonConditions, "value");
              const banes =
                sumBy(weaponBaneConditions, "value") +
                (properties.includes("Cumbersome") ? 1 : 0) +
                (properties.includes(/Strength/) ? 1 : 0);

              const totalBB = boons - banes;

              return {
                ...rest,
                properties,
                attackRoll: `+ ${characteristicsObject.Strength - 10} ${
                  totalBB !== 0
                    ? `${boons > banes ? "+" : "-"} ${totalBB}B`
                    : ""
                }`,
                damageRoll:
                  weaponDamageConditions.length !== 0
                    ? `${
                        Number(diceAmount) +
                        sumBy(weaponDamageConditions, "value")
                      }d${diceType}${
                        extraWeaponDamage || extraWeaponDamageConditions
                          ? `+ ${
                              extraWeaponDamage
                                ? extraWeaponDamage
                                : 0 +
                                  (extraWeaponDamageConditions
                                    ? sumBy(
                                        extraWeaponDamageConditions,
                                        "value"
                                      )
                                    : 0)
                            }`
                          : ""
                      }`
                    : damage,
              };
            }
          ),
          armor: characterData.items.armor,
          otherItems: characterData.items.otherItems,
          currency: characterData.items.currency,
        },
        languages: characterData.languages,
        professions: characterData.professions,
        details: characterData.details,
        characterState: characterData.characterState,
        conditionals: conditionals,
        choices: characterData.choices
          ? filterByLevel(characterData.choices)
          : [],
      };
    } else {
      finaldata = data;
    }

    response.status(200).send(finaldata);
  } catch (e) {
    console.log(e);
    response.status(504).send(e);
  }
};
export default cors(handler);
