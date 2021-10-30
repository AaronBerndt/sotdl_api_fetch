type ArmorConditonal = {
  name: string;
  characteristic: string;
  value: number;
  condition: "Wearing" | "Not Wearing";
  armorType: string[];
};

type PassiveIncrease = {
  name: string;
  characteristic: string;
  value: number;
};

function armorConditonal(conditionalObject: ArmorConditonal, characterData) {
  const equiped = characterData.items;
  return {
    id: conditionalObject.name,
    name: conditionalObject.characteristic,
    value: conditionalObject.value,
  };
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
  "Iron Hide": armorConditonal(
    {
      name: "Iron Hide",
      characteristic: "Defense",
      value: 1,
      condition: "Not Wearing",
      armorType: ["heavy", "medium "],
    },
    characterData
  ),
  "Shield Master": armorConditonal(
    {
      name: "Shield Master",
      characteristic: "Defense",
      value: 1,
      condition: "Wearing",
      armorType: ["shield"],
    },
    characterData
  ),

  "Divine Protection": armorConditonal(
    {
      name: "Divine Protection",
      characteristic: "Defense",
      value: 1 + (characterData.will - 10),
      condition: "Not Wearing",
      armorType: ["heavy", "medium", "light"],
    },
    characterData
  ),

  "Enlightened Defense": armorConditonal(
    {
      name: "Enlightened Defense",
      characteristic: "Defense",
      value: 1 + characterData.power,
      condition: "Not Wearing",
      armorType: ["heavy", "medium", "light", "shield"],
    },
    characterData
  ),
  "Iron Clad": armorConditonal(
    {
      name: "Iron Clad",
      characteristic: "Defense",
      value: 1,
      condition: "Wearing",
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
    value: characterData.strength,
  }),
});

export default conditionalObject;
