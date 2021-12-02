const createUseObject = (id, talentName, value) => ({
  id,
  name: talentName,
  value,
});

const talentUsesObject = (characterData) => ({
  "Battle Surge": createUseObject("Battle Surge", "Battle Surge", 1),
  "Spell Recovery": createUseObject("Spell Recovery", "Spell Recovery", 1),
  "Shared Recovery": createUseObject("Shared Recovery", "Shared Recovery", 1),
  "Brutal Recovery": createUseObject("Brutal Recovery", "Brutal Recovery", 1),
  "Improved Brutal Recovery": createUseObject(
    "Brutal Recovery",
    "Brutal Recovery",
    1
  ),
  "Nimble Recovery": createUseObject("Nimble Recovery", "Nimble Recovery", 1),
  "Swift Recovery": createUseObject("Swift Recovery", "Nimble Recovery", 1),
  "Magical Rejuvenation": createUseObject(
    "Magical Rejuvenation",
    "Magical Rejuvenation",
    1
  ),
  "Improved Magical Rejuvenation": createUseObject(
    "Improved Magical Rejuvenation",
    "Magical Rejuvenation",
    1
  ),
  "Demonic Recovery": createUseObject(
    "Demonic Recovery",
    "Demonic Recovery",
    1
  ),
  "Improved Demonic Recovery": createUseObject(
    "Improved Demonic Recovery",
    "Demonic Recovery",
    1
  ),
  "Radiant Recovery": createUseObject(
    "Radiant Recovery",
    "Radiant Recovery",
    1
  ),
  "Improved Radiant Recovery": createUseObject(
    "Improved Radiant Recovery",
    "Radiant Recovery",
    1
  ),
  "Chaotic Recovery": createUseObject(
    "Chaotic Recovery",
    "Chaotic Recovery",
    1
  ),
  "Accursed Recovery": createUseObject(
    "Accursed Recovery",
    "Accursed Recovery",
    1
  ),
  "Steal Life": createUseObject("Improved Steal Life", "Steal Life", 1),
  "Improved Steal Life": createUseObject(
    "Improved Steal Life",
    "Steal Life",
    1
  ),

  "Restorative Conjuration": createUseObject(
    "Restorative Conjuration",
    "Restorative Conjuration",
    1
  ),
  "Improved Restorative Conjuration": createUseObject(
    "Improved Restorative Conjuration",
    "Restorative Conjuration",
    1
  ),

  "Defense Recovery": createUseObject(
    "Defense Recovery",
    "Defense Recovery",
    1
  ),
  "Improved Defense Recovery": createUseObject(
    "Improved Defense Recovery",
    "Defense Recovery",
    1
  ),
  "Refreshing Recovery": createUseObject(
    "Refreshing Recovery",
    "Refreshing Recovery",
    1
  ),
  "Improved Refreshing Recovery": createUseObject(
    "Improved Refreshing Recovery",
    "Refreshing Recovery",
    1
  ),
  "Altered Physiology": createUseObject(
    "Altered Physiology",
    "Altered Physiology",
    1
  ),
  "Improved Altered Physiology": createUseObject(
    "Improved Altered Physiology",
    "Altered Physiology",
    1
  ),

  "Furious Recovery": createUseObject(
    "Furious Recovery",
    "Furious Recovery",
    1
  ),
  "Improved Furious Recovery": createUseObject(
    "Improved Furious Recovery",
    "Furious Recovery",
    1
  ),
  "Mounted Recovery": createUseObject(
    "Mounted Recovery",
    "Mounted Recovery",
    1
  ),
  "Improved Mounted Recovery": createUseObject(
    "Improved Mounted Recovery",
    "Mounted Recovery",
    1
  ),

  "Improved Shared Recovery": createUseObject(
    "Improved Shared Recovery",
    "Shared Recovery",
    1
  ),

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
  "Healing Elixirs": createUseObject(
    "Healing Elixirs",
    "Healing Elixirs",
    1 + characterData.characteristics.Power
  ),
  "Swift Alteration": createUseObject(
    "Swift Alteration",
    "Swift Alteration",
    1 + characterData.characteristics.Power
  ),
  "Alter Self": createUseObject(
    "Alter Self",
    "Alter Self",
    1 + characterData.characteristics.Power
  ),
  "Close the Gap": createUseObject(
    "Close the Gap",
    "Close the Gap",
    1 + characterData.characteristics.Power
  ),
  "Conjurer’s Trick": createUseObject(
    "Conjurer’s Trick",
    "Conjurer’s Trick",
    1 + characterData.characteristics.Power
  ),
  "Deathly Presence": createUseObject(
    "Deathly Presence",
    "Deathly Presence",
    1 + characterData.characteristics.Power
  ),
  Crumble: createUseObject(
    "Crumble",
    "Crumble",
    1 + characterData.characteristics.Power
  ),
});

export default talentUsesObject;
