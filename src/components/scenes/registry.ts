import type { ComponentType } from "react";
import { AskingGood } from "./AskingGood";
import { AtHome } from "./AtHome";
import { BigSmall } from "./BigSmall";
import { ComeHere } from "./ComeHere";
import { CrowdedHouse } from "./CrowdedHouse";
import { DrinkingWater } from "./DrinkingWater";
import { GiveFood } from "./GiveFood";
import { GoingTo } from "./GoingTo";
import { GoodLookingPerson } from "./GoodLookingPerson";
import { IEatYouDrink } from "./IEatYouDrink";
import { NotEating } from "./NotEating";
import { PersonAndAnimal } from "./PersonAndAnimal";
import { SmallAnimal } from "./SmallAnimal";
import { StrangeDrink } from "./StrangeDrink";
import { WantsToEat } from "./WantsToEat";

/**
 * Which drawings are good enough to put in front of a learner. The first pass
 * of scene art was too ambiguous to read, and a picture you cannot make out
 * leaves the exercise unanswerable — so a scene names itself in words until
 * its real illustration lands. Add a key here as artwork is finished; the
 * queue and the house style live in SCENE_ART.md.
 */
export const SCENE_ART_READY = new Set<string>();

export const SCENE_REGISTRY: Record<string, ComponentType> = {
	"drinking-water": DrinkingWater,
	"not-eating": NotEating,
	"asking-good": AskingGood,
	"big-small": BigSmall,
	"i-eat-you-drink": IEatYouDrink,
	"wants-to-eat": WantsToEat,
	"person-and-animal": PersonAndAnimal,
	"small-animal": SmallAnimal,
	"strange-drink": StrangeDrink,
	"good-looking-person": GoodLookingPerson,
	"crowded-house": CrowdedHouse,
	"come-here": ComeHere,
	"give-food": GiveFood,
	"at-home": AtHome,
	"going-to": GoingTo,
};
