import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCollection } from "../utilities/MongoUtils";
import microCors from "micro-cors";
import { ObjectId } from "mongodb";
import { find, groupBy, sumBy, filter, flatten } from "lodash";
import conditionalObject from "../utilities/conditionals";
import passiveIncreaseObject from "../utilities/passiveIncrease";
import temporaryEffectsObject, {
  temporaryEffectsList,
} from "../utilities/temporaryEffects";
import talentUsesObject from "../utilities/talentUses";
import createCastingObject from "../utilities/spellCastings";
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
      const items = await fetchCollection("items");

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
        { Defense: 0 },
        ...Object.entries(groupBy(characteristics, "name")).map(
          ([NAME, VALUES]: any) => ({
            [NAME]: sumBy(VALUES, "value"),
          })
        )
      );

      const {
        Health,
        Perception,
        Speed,
        Defense,
        ...rest
      } = characteristicsObject;

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

      const afflictionsBanes = characterData.characterState.afflictions.filter(
        ({ name }) =>
          [
            "Fatigued",
            "Frightened",
            "Diseased",
            "Impaired",
            "Poisoned",
          ].includes(name)
      ).length;

      const defenseBecomes5 =
        characterData.characterState.afflictions.filter(({ name }) =>
          ["Unconscious", "Defenseless"].includes(name)
        ).length !== 0;

      const speedBecomes2 =
        find(characterData.characterState.afflictions, {
          name: "Blinded",
        }) !== undefined;

      const speedBecomes0 =
        find(characterData.characterState.afflictions, {
          name: "Immobilized",
        }) !== undefined;

      const speedIsHalved =
        find(characterData.characterState.afflictions, {
          name: "Slowed",
        }) !== undefined;

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

      const equippedGear = characterData.characterState.equipped.filter(
        ({ equipped }: any) => equipped
      );

      const equippedWithArmor = equippedGear
        .filter((gear) =>
          find(items, {
            name: gear.name,
            itemType: "armor",
          })
        )
        .map((gear) => {
          const { _id, ...rest } = find(items, {
            name: gear.name,
            itemType: "armor",
          });

          return { _id: gear._id, ...rest, equipped: gear.equipped };
        });

      const equippedWeapons = equippedGear
        .filter((gear) =>
          find(items, {
            name: gear.name,
            itemType: "weapon",
          })
        )
        .map((gear) => {
          const { _id, ...rest } = find(items, {
            name: gear.name,
            itemType: "weapon",
          });

          return { _id: gear._id, ...rest, equipped: gear.equipped };
        });

      const equippedDefensiveWeapons = equippedWeapons.filter(
        ({ properties }: any) =>
          properties.some((property) => property.match(/Defensive/))
      );

      const spellCastings = createCastingObject(
        characteristicsObject.Power,
        passiveIncreases
      );

      const talentIncreases = flatten([
        ...conditionals,
        ...passiveIncreases,
        ...temporaryEffects,
      ]);

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
          HealingRate: Math.round(
            (Health +
              characteristicsObject.Strength +
              sumBy(
                filter(talentIncreases, {
                  name: "Health",
                }),
                "value"
              )) /
              (find(talentIncreases, { id: "Durable" }) ? 3 : 4)
          ),

          Perception: Perception + characteristicsObject.Intellect,
          Defense: defenseBecomes5
            ? 5
            : (equippedWithArmor.length === 0
                ? characteristicsObject.Defense + characteristicsObject.Agility
                : equippedWithArmor[0].value +
                  (equippedWithArmor[0].properties.includes("Agility")
                    ? characteristicsObject.Agility
                    : 0)) +
              sumBy(filter(talentIncreases, { name: "Defense" }), "value") +
              (equippedDefensiveWeapons.length !== 0
                ? equippedDefensiveWeapons[0].defenseValue
                : 0),

          Speed: speedBecomes0
            ? 0
            : speedBecomes2
            ? 2
            : Math.round(
                characteristicsObject.Speed +
                  (equippedWithArmor.length !== 0
                    ? (characteristicsObject.Strength <
                      equippedWithArmor[0].requirement
                        ? -2
                        : 0) + (equippedWithArmor[0].type === "heavy" ? -2 : 0)
                    : 0 / (speedIsHalved ? 2 : 1))
              ),
          ...rest,
        },
        talents: talents.map((talent) => {
          const uses = talentUses.filter(({ name }) => name === talent.name);
          const passive = find(passiveIncreases, { name: talent.name });
          const conditional = find(conditionals, { name: talent.name });
          const toggle = temporaryEffectsList.includes(talent.name);

          let type = /can use a triggered action/gm.test(talent.description)
            ? "triggered"
            : /heal damage equal to your healing rate/gm.test(
                talent.description
              )
            ? "heal"
            : passive || conditional
            ? "passive"
            : toggle
            ? "toggle"
            : /make a Will attack roll/gm.test(talent.description)
            ? "attack"
            : "passive";

          return {
            ...talent,
            ...(uses.length !== 0
              ? {
                  uses: uses ? sumBy(uses, "value") : null,
                }
              : {}),
            type,
          };
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

          console.log(extraDamageDice);

          const boons = sumBy(
            [...spellBoonConditionals, spellBoonConditionalsWithType],
            "value"
          );

          const totalBB = boons - afflictionsBanes;

          const newDiceAmount =
            diceType === undefined
              ? damage
              : diceType === "3"
              ? `${diceAmount}d${diceType}
                 ${extraDamageDice ? `+ ${extraDamageDice}d6` : ""} ${
                  extraSpellDamage ? `+ ${extraSpellDamage}` : ""
                }`
              : `${
                  Number(diceAmount) +
                  (extraDamageDice ? Number(extraDamageDice) : 0)
                }d${diceType}`;

          const attackBonus =
            characteristicsObject[
              attribute === "Intellect" ? "Intellect" : "Will"
            ] - 10;
          return {
            ...rest,
            attribute,
            tradition,
            castings: spellCastings[rest.level],
            attackRoll: spell.description.includes("attack roll")
              ? `${attackBonus >= 0 ? "+" : ""}${attackBonus}${
                  totalBB
                    ? `${boons > afflictionsBanes ? " +" : " -"}${totalBB}B`
                    : ""
                }`
              : null,
            damageRoll: `${damage ? newDiceAmount : null}`,
            totalBB,
          };
        }),
        traditions: characterData.traditions,
        items: {
          weapons: equippedWeapons.map(({ damage, properties, ...rest }) => {
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

            const { Strength, Agility } = characteristicsObject;
            const boons = sumBy(weaponBoonConditions, "value");
            const banes =
              sumBy(weaponBaneConditions, "value") +
              (properties.includes("Cumbersome") ? 1 : 0) +
              (properties.includes(/Strength/) ? 1 : 0) +
              afflictionsBanes;

            const totalBB = Math.abs(boons - banes);

            const attackRoll =
              (properties.includes("Finesse") || properties.includes("Reload")
                ? Agility > Strength
                  ? Agility
                  : Strength
                : Strength) - 10;

            return {
              ...rest,
              properties,
              attackRoll: `${attackRoll < 0 ? "-" : "+"}${attackRoll}`,
              totalBB:
                totalBB !== 0 ? `${boons > banes ? "" : "-"}${totalBB}` : 0,
              damageRoll:
                diceType === undefined
                  ? damage
                  : weaponDamageConditions.length !== 0
                  ? diceAmount
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
                    : damage
                  : damage,
            };
          }),
          armor: equippedWithArmor,
          otherItems: characterData.items.otherItems,
          currency: characterData.items.currency,
        },
        languages: characterData.languages,
        professions: characterData.professions,
        details: characterData.details,
        characterState: characterData.characterState,
        allCharacteristics: [
          ...filterByLevel(
            await createAncestryList(
              ancestry.characteristics,
              "characteristics"
            )
          ),
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
