import createCastingObject from "./spellCastings";
describe("createCastingObjectTest", () => {
  it("1 Power", () => {
    expect(createCastingObject(1, [])).toStrictEqual({
      0: 2,
      1: 1,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    });
  });

  it("3 Power", () => {
    expect(createCastingObject(3, [])).toStrictEqual({
      0: 4,
      1: 2,
      2: 1,
      3: 1,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    });
  });
  it("3 Power + level 0 increase", () => {
    expect(
      createCastingObject(3, [{ name: "Level 0 Spell Castings", value: 1 }])
    ).toStrictEqual({
      0: 5,
      1: 2,
      2: 1,
      3: 1,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    });
  });
  it("3 Power + level 1 increase", () => {
    expect(
      createCastingObject(3, [{ name: "Level 1 Spell Castings", value: 1 }])
    ).toStrictEqual({
      0: 4,
      1: 3,
      2: 1,
      3: 1,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    });
  });
});
