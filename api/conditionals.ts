import { find, filter } from "lodash";

type ItemConditonal = {
  name: string;
  characteristic: string;
  value: number;
  condition: "Equipped" | "Not Equipped";
  armorType?: string[];
  weaponType?: string[];
};

type PassiveIncrease = {
  name: string;
  characteristic: string;
  value: number;
};

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
        ? conditionalObject.weaponType.includes(equipedShield.type)
        : true)
    ) {
      return returnObject;
    }
  }

  return null;
}

function passiveIncrease(
  conditionalObject: PassiveIncrease,
  characterData?: any
) {
  return {
    id: conditionalObject.name,
    name: conditionalObject.characteristic,
    value: conditionalObject.value,
  };
}

const conditionalObject = (characterData) => ({
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
  "Staff of Power": passiveIncrease({
    name: "Staff of Power",
    characteristic: "Defense",
    value: 1,
  }),
  "Mighty Thews": passiveIncrease({
    name: "Mighty Thews",
    characteristic: "Damage",
    value: characterData.characteristics.Strength - 10,
  }),
});

export default conditionalObject;
