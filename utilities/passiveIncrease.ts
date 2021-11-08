import {
  WEAPON_BOON,
  WEAPON_DICE_DAMAGE,
  EXTRA_WEAPON_DAMAGE,
  HEALING_RATE,
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
});

export default passiveIncreaseObject;
