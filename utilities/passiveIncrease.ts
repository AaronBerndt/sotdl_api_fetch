import {
  WEAPON_BOON,
  WEAPON_DICE_DAMAGE,
  EXTRA_WEAPON_DAMAGE,
  HEALING_RATE,
  SPELL_DICE_DAMAGE,
  SPELL_BOON,
  PERCEPTION_BOON,
  LEVEL_0_SPELL_CASTING,
  LEVEL_1_SPELL_CASTING,
  STRENGTH_BOON,
  WILL_BANE,
  INTELLECT_BOON,
} from "./constants";

type PassiveIncrease = {
  talentName: string;
  effectList: { name: string; value: number }[];
  characterData: any;
  talentToChange?: string;
};

function createPassiveEffect(
  talentName: string,
  effectList: { name: string; value: number }[],
  characterData: any,
  talentToChange?: string
) {
  return effectList.map((effect) => ({
    id: talentToChange ? talentToChange : talentName,
    ...effect,
  }));
}

const createEffect = (name, value) => ({ name, value });

const passiveIncreaseObject = (characterData) => ({
  "Icon of Faith": createPassiveEffect(
    "Icon of Faith",
    [createEffect(SPELL_BOON, 1)],
    characterData
  ),
  "Empowered Symbol": createPassiveEffect(
    "Empowered Symbol",
    [createEffect(SPELL_DICE_DAMAGE, 1)],
    characterData
  ),
  "Divine Power": createPassiveEffect(
    "Divine Power",
    [createEffect(SPELL_DICE_DAMAGE, 1), createEffect(SPELL_BOON, 1)],
    characterData
  ),

  "Fight with Anything": createPassiveEffect(
    "Fight with Anything",
    [createEffect(WEAPON_BOON, 1)],
    characterData
  ),
  Durable: createPassiveEffect(
    "Durable",
    [createEffect(HEALING_RATE, 3)],
    characterData
  ),

  "Mighty Thews": createPassiveEffect(
    "Mighty Thews",
    [createEffect(EXTRA_WEAPON_DAMAGE, characterData.characteristics.Strength)],
    characterData
  ),
  Alertness: createPassiveEffect(
    "Alertness",
    [createEffect(PERCEPTION_BOON, 1)],
    characterData
  ),
  "Spell Expertise": createPassiveEffect(
    "Spell Expertise",
    [
      createEffect(LEVEL_0_SPELL_CASTING, 1),
      createEffect(LEVEL_1_SPELL_CASTING, 1),
    ],
    characterData
  ),
  "Intense Light": createPassiveEffect(
    "Intense Light",
    [createEffect(SPELL_DICE_DAMAGE, 1)],
    characterData
  ),
  "Power of the Sun": createPassiveEffect(
    "Intense Light",
    [createEffect(SPELL_BOON, 1)],
    characterData
  ),
  Brawn: createPassiveEffect(
    "Brawn",
    [createEffect(STRENGTH_BOON, 1), createEffect(WEAPON_BOON, 1)],
    characterData
  ),
  "Two Weapon Mastery": createPassiveEffect(
    "Two Weapon Mastery",
    [createEffect(WEAPON_BOON, 1), createEffect(WEAPON_DICE_DAMAGE, 1)],
    characterData
  ),
  "Deadeye Shot": createPassiveEffect(
    "Deadeye Shot",
    [createEffect(WEAPON_BOON, 1), createEffect(WEAPON_DICE_DAMAGE, 1)],
    characterData
  ),
  Skittish: createPassiveEffect(
    "Skittish",
    [createEffect(WILL_BANE, 1)],
    characterData
  ),
  "Iron Fist": createPassiveEffect(
    "Iron Fist",
    [createEffect(WEAPON_DICE_DAMAGE, 1)],
    characterData
  ),
  Learned: createPassiveEffect(
    "Learned",
    [createEffect(INTELLECT_BOON, 1)],
    characterData
  ),
});

export default passiveIncreaseObject;
