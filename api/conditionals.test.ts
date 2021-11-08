import conditionalObject from "./conditionals";

const createCharacterData = (
  armorType: string,
  weaponType?: string,
  withShield?: boolean
) => ({
  characteristics: {
    Health: 10,
    Perception: 11,
    Strength: 10,
    Agility: 13,
    Intellect: 10,
    Will: 10,
    Insanity: 0,
    Corruption: 0,
    Power: 2,
    Speed: 10,
    Size: 0.2,
  },
  items: {
    weapons: [
      { type: weaponType, equiped: weaponType !== undefined },
      { type: "shield", equiped: withShield },
    ],
    armor: [
      {
        type: armorType,
        equiped: true,
      },
    ],
  },
});

describe("item conditional tests", () => {
  const character_with_heavy_armor = createCharacterData("heavy");
  const character_with_light_armor = createCharacterData("light");
  const character_with_medium_armor = createCharacterData("medium");
  const character_with_no_armor = createCharacterData("None");
  const character_with_shield = createCharacterData("None", undefined, true);

  const character_with_weapon = createCharacterData("None", "light", true);

  describe("Battle Sense", () => {
    it("No Armor", () =>
      expect(
        conditionalObject(character_with_no_armor)["Battle Sense"]
      ).not.toBeNull());

    it("Light Armor", () =>
      expect(
        conditionalObject(character_with_light_armor)["Battle Sense"]
      ).not.toBeNull());

    it("Medium Armor", () =>
      expect(
        conditionalObject(character_with_medium_armor)["Battle Sense"]
      ).toBeNull());
    it("Heavy Armor", () =>
      expect(
        conditionalObject(character_with_heavy_armor)["Battle Sense"]
      ).toBeNull());
  });

  describe("Iron Hide", () => {
    it("No Armor", () =>
      expect(
        conditionalObject(character_with_no_armor)["Iron Hide"]
      ).not.toBeNull());

    it("Light Armor", () =>
      expect(
        conditionalObject(character_with_light_armor)["Iron Hide"]
      ).not.toBeNull());

    it("Medium Armor", () =>
      expect(
        conditionalObject(character_with_medium_armor)["Iron Hide"]
      ).toBeNull());
    it("Heavy Armor", () =>
      expect(
        conditionalObject(character_with_heavy_armor)["Iron Hide"]
      ).toBeNull());
  });

  describe("Shield Master", () => {
    it("No Shield", () =>
      expect(
        conditionalObject(character_with_medium_armor)["Shield Master"]
      ).toBeNull());
    it("With Shield", () =>
      expect(
        conditionalObject(character_with_shield)["Shield Master"]
      ).not.toBeNull());
  });

  describe("Combat Prowess", () => {
    it("Light Weapon", () =>
      expect(
        conditionalObject(character_with_weapon)["Combat Prowess"]
      ).not.toBeNull());
  });

  describe("Divine Protection", () => {
    it("No Armor", () => {
      expect(
        conditionalObject(character_with_no_armor)["Divine Protection"]
      ).not.toBeNull();

      expect(
        conditionalObject(character_with_no_armor)["Divine Protection"].value
      ).toBe(1);
    });

    it("Light Armor", () =>
      expect(
        conditionalObject(character_with_light_armor)["Divine Protection"]
      ).toBeNull());

    it("Medium Armor", () =>
      expect(
        conditionalObject(character_with_medium_armor)["Divine Protection"]
      ).toBeNull());
    it("Heavy Armor", () =>
      expect(
        conditionalObject(character_with_heavy_armor)["Divine Protection"]
      ).toBeNull());
  });

  describe("Divine Protection", () => {
    it("No Armor", () => {
      expect(
        conditionalObject(character_with_no_armor)["Divine Protection"]
      ).not.toBeNull();

      expect(
        conditionalObject(character_with_no_armor)["Divine Protection"].value
      ).toBe(1);
    });

    it("Light Armor", () =>
      expect(
        conditionalObject(character_with_light_armor)["Divine Protection"]
      ).toBeNull());

    it("Medium Armor", () =>
      expect(
        conditionalObject(character_with_medium_armor)["Divine Protection"]
      ).toBeNull());
    it("Heavy Armor", () =>
      expect(
        conditionalObject(character_with_heavy_armor)["Divine Protection"]
      ).toBeNull());
  });

  describe("Enlightened Defense", () => {
    it("No Armor", () => {
      expect(
        conditionalObject(character_with_no_armor)["Enlightened Defense"]
      ).not.toBeNull();

      expect(
        conditionalObject(character_with_no_armor)["Enlightened Defense"].value
      ).toBe(3);
    });

    it("With Shield", () =>
      expect(
        conditionalObject(character_with_shield)["Enlightened Defense"]
      ).toBeNull());

    it("Light Armor", () =>
      expect(
        conditionalObject(character_with_light_armor)["Enlightened Defense"]
      ).toBeNull());

    it("Medium Armor", () =>
      expect(
        conditionalObject(character_with_medium_armor)["Enlightened Defense"]
      ).toBeNull());
    it("Heavy Armor", () =>
      expect(
        conditionalObject(character_with_heavy_armor)["Enlightened Defense"]
      ).toBeNull());
  });

  describe("Iron Clad", () => {
    it("No Armor", () =>
      expect(
        conditionalObject(character_with_no_armor)["Iron Clad"]
      ).toBeNull());

    it("Light Armor", () =>
      expect(
        conditionalObject(character_with_light_armor)["Iron Clad"]
      ).toBeNull());

    it("Medium Armor", () =>
      expect(
        conditionalObject(character_with_medium_armor)["Iron Clad"]
      ).toBeNull());
    it("Heavy Armor", () =>
      expect(
        conditionalObject(character_with_heavy_armor)["Iron Clad"]
      ).not.toBeNull());
  });
});
