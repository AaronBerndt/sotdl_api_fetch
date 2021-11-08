const createUseObject = (id, talentName, value) => ({
  id,
  name: talentName,
  value,
});

const talentUsesObject = (characterData) => ({
  "Spell Recovery": createUseObject("Spell Recovery", "Spell Recovery", 1),
  "Shared Recovery": createUseObject("Shared Recovery", "Shared Recovery", 1),
  "Improved Shared Recovery": createUseObject(
    "Shared Recovery",
    "Shared Recovery",
    1
  ),
  "Nimble Recovery": createUseObject("Nimble Recovery", "Nimble Recovery", 1),

  "Catch Your Breath": createUseObject(
    "Catch Your Breath",
    "Catch Your Breath",
    1
  ),
  Grit: createUseObject("Grit", "Catch Your Breath", 1),
});

export default talentUsesObject;
