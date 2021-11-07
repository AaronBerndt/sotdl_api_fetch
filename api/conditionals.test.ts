import conditionalObject from "./conditionals";

const characterData = {
  items: {
    armor: [
      {
        _id: "60d516a0a988d8000875b062",
        name: "Brigandine",
        description:
          " Brigandine armor is clothing reinforced with metal strips between layers of leather or fitted with metal studs. It typically consists of a long-sleeved coat with greaves for the legs.",
        itemType: "armor",
        requirement: 11,
        type: "light",
        value: 13,
        price: "5 ss",
        availability: "C",
        properties: [],
        equiped: false,
      },
    ],
  },
};
describe("conditional tests", () => {
  const conditionals = conditionalObject(characterData);

  Object.entries(conditionals).map(([CONDITION_NAME, FUNCTION]) =>
    it(CONDITION_NAME, () => expect(FUNCTION).toBe(true))
  );
});
