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
import { WantsToEat } from "./WantsToEat";

export const SCENE_REGISTRY: Record<string, ComponentType> = {
	"drinking-water": DrinkingWater,
	"not-eating": NotEating,
	"asking-good": AskingGood,
	"big-small": BigSmall,
	"i-eat-you-drink": IEatYouDrink,
	"wants-to-eat": WantsToEat,
	"person-and-animal": PersonAndAnimal,
	"good-looking-person": GoodLookingPerson,
	"crowded-house": CrowdedHouse,
	"come-here": ComeHere,
	"give-food": GiveFood,
	"at-home": AtHome,
	"going-to": GoingTo,
};
