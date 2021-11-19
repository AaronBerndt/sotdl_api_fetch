const createUseObject = (id, talentName, value) => ({
  id,
  name: talentName,
  value,
});

const talentUsesObject = (characterData) => ({
  "Spell Recovery": createUseObject("Spell Recovery", "Spell Recovery", 1),
  "Shared Recovery": createUseObject("Shared Recovery", "Shared Recovery", 1),
  "Improved Shared Recovery": createUseObject(
    "Improved Shared Recovery",
    "Shared Recovery",
    1
  ),
  "Nimble Recovery": createUseObject("Nimble Recovery", "Nimble Recovery", 1),

  "Catch Your Breath": createUseObject(
    "Catch Your Breath",
    "Catch Your Breath",
    1
  ),
  "Shake it Off": createUseObject("Shake it Off", "Shake it Off", 1),

  Grit: createUseObject("Grit", "Catch Your Breath", 1),
  "Divine Ecstasy": createUseObject(
    "Divine Ecstasy",
    "Divine Ecstasy",
    characterData.characteristics.Power
  ),
  "Sense Enemies": createUseObject(
    "Sense Enemies",
    "Sense Enemies",
    characterData.characteristics.Power
  ),
  "Holy Radiance": createUseObject(
    "Holy Radiance",
    "Holy Radiance",
    characterData.characteristics.Power
  ),
  "Steal Spell": createUseObject("Steal Spell", "Steal Spell", 1),
  "Spell Thief Mastery": createUseObject(
    "Spell Thief Mastery",
    "Steal Spell",
    1
  ),
  "Battle Chant": createUseObject("Battle Chant", "Battle Chant", 3),
  Perseverance: createUseObject("Perseverance", "Perseverance", 1),
  "Healing Trance": createUseObject("Healing Trance", "Healing Trance", 1),
  "Psychic Power": createUseObject(
    "Psychic Power",
    "Psychic Power",
    2 + characterData.characteristics.Power
  ),

  "Esoteric Knowledge": createUseObject(
    "Esoteric Knowledge",
    "Esoteric Knowledge",
    1
  ),
  "Invoke the Cosmic Egg": createUseObject(
    "Invoke the Cosmic Egg",
    "Invoke the Cosmic Egg",
    1 + characterData.characteristics.Power
  ),
  "Gather Shadows": createUseObject(
    "Gather Shadows",
    "Gather Shadows",
    1 + characterData.characteristics.Power
  ),
});

export default talentUsesObject;
