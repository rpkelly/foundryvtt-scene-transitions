import type { ActorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs";
import { error } from "./lib/lib";

const API = {
	executeActionArr(...inAttributes) {
		if (!Array.isArray(inAttributes)) {
		  throw error('executeActionArr | inAttributes must be of type array');
		}
		const [action] = inAttributes;
		this.executeAction(action);
	},

	executeAction(action:string) {
		
	},
};

export default API;
