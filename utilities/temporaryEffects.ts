import {
  AGLITY_BOON,
  DEFENSE,
  HEALTH,
  INTELLECT_BOON,
  PERCEPTION,
  PERCEPTION_BOON,
  SIZE,
  SPEED,
  SPELL_BOON,
  SPELL_DICE_DAMAGE,
  STRENGTH_BOON,
  WEAPON_BOON,
  WEAPON_DICE_DAMAGE,
  WILL_BOON,
} from "./constants";
import { range } from "lodash";

const createTemporaryEffectsList = (
  talentName: string,
  effectList: { name: string; value: number }[],
  characterData: any,
  talentToChange?: string
) => {
  return characterData.characterState.temporaryEffects.includes(talentName)
    ? effectList.map((effect) => ({
        id: talentToChange ? talentToChange : talentName,
        ...effect,
      }))
    : null;
};

const createEffect = (name, value) => ({ name, value });

const temporaryEffectsObject = (characterData) => ({
  "Killer’s Eye": createTemporaryEffectsList(
    "Killer’s Eye",
    [createEffect(WEAPON_BOON, 1), createEffect(WEAPON_DICE_DAMAGE, 2)],
    characterData
  ),
  Beserk: createTemporaryEffectsList(
    "Berserk",
    [
      createEffect(WEAPON_BOON, 1),
      createEffect(HEALTH, 10),
      createEffect(WEAPON_DICE_DAMAGE, 2),
    ],
    characterData
  ),
  "Ferocious Wrath": createTemporaryEffectsList(
    "Ferocious Wrath",
    [createEffect(SPEED, 2)],
    characterData,
    "Beserk:"
  ),
  "Divine Ecstasy": createTemporaryEffectsList(
    "Divine Ecstasy",
    [
      createEffect(HEALTH, 10),
      createEffect(INTELLECT_BOON, 1),
      createEffect(PERCEPTION_BOON, 1),
      createEffect(WILL_BOON, 1),
    ],
    characterData
  ),
  Avatar: createTemporaryEffectsList(
    "Avatar",
    [
      createEffect(DEFENSE, 1),
      createEffect(AGLITY_BOON, 1),
      createEffect(STRENGTH_BOON, 1),
      createEffect(SPELL_DICE_DAMAGE, 1),
      createEffect(WEAPON_DICE_DAMAGE, 1),
    ],
    characterData,
    "Divine Ecstasy"
  ),
  "Primal Beast": createTemporaryEffectsList(
    "Primal Beast",
    [createEffect(SPEED, 2), createEffect(WEAPON_DICE_DAMAGE, 1)],
    characterData,
    "Beast Within"
  ),
  "Battle Stance": createTemporaryEffectsList(
    "Battle Stance",
    [createEffect(WEAPON_BOON, 1), createEffect(SPELL_BOON, 1)],
    characterData
  ),
  "Battle Chant": createTemporaryEffectsList(
    "Battle Stance",
    [
      createEffect(WEAPON_BOON, 1),
      createEffect(SPELL_BOON, 1),
      createEffect(WEAPON_DICE_DAMAGE, 1),
    ],
    characterData
  ),
  "Watery Form": createTemporaryEffectsList(
    "Watery Form",
    [createEffect(AGLITY_BOON, 1)],
    characterData
  ),
  "Staff of Magic": createTemporaryEffectsList(
    "Staff of Magic",
    [createEffect(SPELL_BOON, 1), createEffect(SPELL_DICE_DAMAGE, 1)],
    characterData
  ),
  "Staff of Power": createTemporaryEffectsList(
    "Staff of Power",
    [createEffect(SPELL_BOON, 1), createEffect(DEFENSE, 1)],
    characterData,
    "Staff of Magic"
  ),
  "Sigils of Power": createTemporaryEffectsList(
    "Sigils of Power",
    [createEffect(WEAPON_DICE_DAMAGE, 1), createEffect(SPELL_DICE_DAMAGE, 1)],
    characterData
  ),
  "Stand Guard": createTemporaryEffectsList(
    "Stand Guard",
    [createEffect(WEAPON_BOON, 1)],
    characterData
  ),
  "Favored Weapon": createTemporaryEffectsList(
    "Favored Weapon",
    [createEffect(WEAPON_BOON, 1), createEffect(DEFENSE, 1)],
    characterData
  ),
  "Weapon Specialization": createTemporaryEffectsList(
    "Weapon Specialization",
    [createEffect(WEAPON_DICE_DAMAGE, 1)],
    characterData,
    "Favored Weapon"
  ),
  "Qi Focus": createTemporaryEffectsList(
    "Qi Focus",
    [createEffect(DEFENSE, 1), createEffect(SPEED, 4)],
    characterData
  ),
  "Guardian Of Nature": createTemporaryEffectsList(
    "Guardian Of Nature",
    [
      createEffect(DEFENSE, 2),
      createEffect(HEALTH, 10),
      createEffect(SIZE, 1),
      createEffect(SPEED, 2),
      createEffect(WEAPON_DICE_DAMAGE, 1),
    ],
    characterData
  ),
  "Combat Feint": createTemporaryEffectsList(
    "Combat Feint",
    [createEffect(WEAPON_BOON, 1)],
    characterData
  ),
  "Devious Strike": createTemporaryEffectsList(
    "Devious Strike",
    [createEffect(WEAPON_DICE_DAMAGE, 1)],
    characterData,
    "Combat Feint"
  ),
  "Mental Might": createTemporaryEffectsList(
    "Mental Might",
    [createEffect(WEAPON_BOON, 1), createEffect(SPELL_BOON, 1)],
    characterData,
    "Focused"
  ),
  "Enlightened Focus": createTemporaryEffectsList(
    "Enlightened Focus",
    [
      createEffect(HEALTH, 5),
      createEffect(SPEED, 2),
      createEffect(WEAPON_DICE_DAMAGE, 1),
    ],
    characterData,
    "Focused"
  ),
  "Powered by Storm": createTemporaryEffectsList(
    "Powered by Storm",
    [
      createEffect(HEALTH, 5),
      createEffect(WEAPON_BOON, 1),
      createEffect(SPELL_BOON, 1),
    ],
    characterData
  ),

  ...range(0, 11).map((rank) => ({
    [`Telekinetic Armor ${rank}`]: createTemporaryEffectsList(
      `Telekinetic Armor ${rank}`,
      [createEffect(DEFENSE, 1 + rank)],
      characterData
    ),
  })),
  ...range(0, 11).map((rank) => ({
    [`Guarded Casting ${rank}`]: createTemporaryEffectsList(
      `Guarded Casting ${rank}`,
      [createEffect(DEFENSE, 1 + rank)],
      characterData
    ),
  })),
  ...range(0, 11).map((rank) => ({
    [`Metallic Sheen ${rank}`]: createTemporaryEffectsList(
      `Metallic Sheen ${rank}`,
      [createEffect(DEFENSE, 1 + rank)],
      characterData
    ),
  })),

  "Zephyr Form": createTemporaryEffectsList(
    "Zephyr Form",
    [createEffect(SPEED, 6)],
    characterData
  ),
});

export default temporaryEffectsObject;
