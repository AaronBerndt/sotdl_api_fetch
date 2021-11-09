import { find, filter } from "lodash";
import { SPEED, STRENGTH_BOON, WEAPON_BOON } from "./constants";

type Conditional = {
  name: string;
  characteristic: string;
  value: number;
};

type ItemConditonal = {
  name: string;
  characteristic: string;
  value: number;
  condition: "Equipped" | "Not Equipped";
  armorType?: string[];
  weaponType?: string[];
};

const createEffect = (name, value) => ({ name, value });

function createInjuredConditona(
  talentName: string,
  effectList: { name: string; value: number }[],
  characterData: any
) {
  return characterData.characterState.injured ? effectList : null;
}

function createafflictionConditional(
  talentName: string,
  condition: string,
  effectList: { name: string; value: number }[],
  characterData: any
) {
  return characterData.characterState.afflications.includes(condition)
    ? effectList
    : null;
}

function createItemConditonal(
  conditionalObject: ItemConditonal,
  characterData: any
) {
  let equipedArmor = find(characterData.items.armor, { equiped: true });
  let equipedWeapons = filter(characterData.items.weapons, { equiped: true });

  let equipedShield = find(characterData.items.weapons, {
    type: "shield",
    equiped: true,
  });

  equipedArmor = equipedArmor
    ? equipedArmor
    : {
        name: "No Armor Equiped",
        type: "No Armor",
      };

  equipedShield = equipedShield
    ? equipedShield
    : {
        name: "No Shield Equiped",
        type: "No Shield",
      };

  const returnObject = {
    id: conditionalObject.name,
    name: conditionalObject.characteristic,
    value: conditionalObject.value,
  };

  if (conditionalObject.condition === "Not Equipped") {
    if (
      (conditionalObject?.armorType
        ? !conditionalObject.armorType.includes(equipedArmor.type)
        : true) &&
      (conditionalObject?.weaponType
        ? !conditionalObject.weaponType.includes(equipedShield.type)
        : true)
    ) {
      return returnObject;
    }
  }

  if (conditionalObject.condition === "Equipped") {
    if (
      (conditionalObject?.armorType
        ? conditionalObject.armorType.includes(equipedArmor.type)
        : true) &&
      (conditionalObject?.weaponType
        ? conditionalObject.weaponType.includes(equipedShield.type) ||
          conditionalObject.weaponType.includes("All") ||
          conditionalObject.weaponType.includes(equipedWeapons.type)
        : true)
    ) {
      return { ...returnObject, condition: conditionalObject.weaponType };
    }
  }

  return null;
}

const conditionalObject = (characterData) => ({
  "Battle Sense": createItemConditonal(
    {
      name: "Battle Sense",
      characteristic: "Defense",
      value: 2,
      condition: "Not Equipped",
      armorType: ["heavy", "medium"],
    },
    characterData
  ),
  "Combat Prowess": createItemConditonal(
    {
      name: "Combat Prowess",
      characteristic: "Weapon Dice Damage",
      value: 1,
      condition: "Equipped",
      weaponType: ["All"],
    },
    characterData
  ),
  "Weapon Training": createItemConditonal(
    {
      name: "Weapon Training",
      characteristic: "Weapon Boon",
      value: 1,
      condition: "Equipped",
      weaponType: ["All"],
    },
    characterData
  ),

  "Iron Hide": createItemConditonal(
    {
      name: "Iron Hide",
      characteristic: "Defense",
      value: 1,
      condition: "Not Equipped",
      armorType: ["heavy", "medium"],
    },
    characterData
  ),

  "Shield Master": createItemConditonal(
    {
      name: "Shield Master",
      characteristic: "Defense",
      value: 1,
      condition: "Equipped",
      weaponType: ["shield"],
    },
    characterData
  ),

  "Divine Protection": createItemConditonal(
    {
      name: "Divine Protection",
      characteristic: "Defense",
      value: 1 + Math.max(0, characterData.characteristics.Will - 10),
      condition: "Not Equipped",
      armorType: ["heavy", "medium", "light"],
    },
    characterData
  ),

  "Enlightened Defense": createItemConditonal(
    {
      name: "Enlightened Defense",
      characteristic: "Defense",
      value: 1 + characterData.characteristics.Power,
      condition: "Not Equipped",
      armorType: ["heavy", "medium", "light", "shield"],
      weaponType: ["shield"],
    },
    characterData
  ),
  "Iron Clad": createItemConditonal(
    {
      name: "Iron Clad",
      characteristic: "Defense",
      value: 1,
      condition: "Equipped",
      armorType: ["heavy"],
    },
    characterData
  ),
  "Off-Hand Parry": createItemConditonal(
    {
      name: "Off-Hand Parry",
      characteristic: "Defense",
      value: 1,
      condition: "Not Equipped",
      weaponType: ["shield"],
    },
    characterData
  ),
  "Strength from Pain": createInjuredConditona(
    "Strength from Pain",
    [createEffect(STRENGTH_BOON, 1), createEffect(WEAPON_BOON, 1)],
    characterData
  ),
  "Fight or Flight": createInjuredConditona(
    "Fight or Flight",
    [createEffect(SPEED, 2)],
    characterData
  ),

  "Nimble Defense": createItemConditonal(
    {
      name: "Nimble Defense",
      characteristic: "Defense",
      value: 1,
      condition: "Not Equipped",
      armorType: ["heavy", "medium"],
    },
    characterData
  ),
  "Unassailable Defense": createItemConditonal(
    {
      name: "Unassailable Defense",
      characteristic: "Defense",
      value: 2,
      condition: "Not Equipped",
      armorType: ["heavy", "medium"],
    },
    characterData
  ),
});

export default conditionalObject;
