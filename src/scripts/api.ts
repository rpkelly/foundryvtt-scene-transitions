import type { ActorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs";
import { error } from "./lib/lib";
import { SceneTransition } from "./scene-transitions";
import type { SceneTransitionOptions } from "./scene-transitions-model";

const API = {
	executeActionArr(...inAttributes) {
		if (!Array.isArray(inAttributes)) {
			throw error("executeActionArr | inAttributes must be of type array");
		}
		const [options] = inAttributes;
		this.executeAction(options);
	},

	executeAction(data: SceneTransitionOptions) {
		if (data.action) {
			switch (data.action) {
				case "end":
					SceneTransition.activeTransition.destroy();
					break;

				default:
					break;
			}
		} else {
			// Run a transition
			let options = data;
			if (!options.users || options.users.includes(<string>game.user?.id)) {
				options = {
					...options,
					fromSocket: true,
				};
				new SceneTransition(false, options, undefined).render();
			}
		}
	},
};

export default API;
