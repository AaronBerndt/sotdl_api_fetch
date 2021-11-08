import { WEAPON_BOON, WEAPON_DICE_DAMAGE } from "./constants";

const createTemporaryEffectsList = (talentName, effectList, characterData) =>
  characterData.characterState.temporaryEffects.includes(talentName)
    ? effectList
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
    [createEffect(WEAPON_BOON, 1), createEffect(WEAPON_DICE_DAMAGE, 2)],
    characterData
  ),
});

export default temporaryEffectsObject;
