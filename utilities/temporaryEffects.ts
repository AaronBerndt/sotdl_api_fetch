import {
  AGLITY_BOON,
  DEFENSE,
  HEALTH,
  INTELLECT_BOON,
  PERCEPTION_BOON,
  SPEED,
  SPELL_DICE_DAMAGE,
  STRENGTH_BOON,
  WEAPON_BOON,
  WEAPON_DICE_DAMAGE,
  WILL_BOON,
} from "./constants";

const createTemporaryEffectsList = (
  talentName: string,
  effectList: { name: string; value: number }[],
  characterData: any,
  talentToChange?: string
) =>
  characterData.characterState.temporaryEffects.includes(talentName)
    ? effectList.map((effect) => ({
        id: talentToChange ? talentToChange : talentName,
        ...effect,
      }))
    : null;

const createEffect = (name, value) => ({ name, value });

const temporaryEffectsObject = (characterData) => ({
  "Killer’s Eye": createTemporaryEffectsList(
    "Killer’s Eye",
    [createEffect(WEAPON_BOON, 1), createEffect(WEAPON_DICE_DAMAGE, 2)],
    characterData
  ),
  Beserk: createTemporaryEffectsList(
    "Beserk",
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
});

export default temporaryEffectsObject;
