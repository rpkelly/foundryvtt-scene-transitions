import { error } from "./lib/lib.js";
import { SceneTransition } from "./scene-transitions.js";
const API = {
	executeActionArr(...inAttributes) {
		if (!Array.isArray(inAttributes)) {
			throw error("executeActionArr | inAttributes must be of type array");
		}
		const [options] = inAttributes;
		this.executeAction(options);
	},
	executeAction(data) {
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
			// TODO did i need this ??
			// if (!options.users || options.users.includes(<string>game.user?.id)) {
			options = {
				...options,
				fromSocket: true,
			};
			new SceneTransition(false, options, undefined).render();
			// }
		}
	},
	macro(...inAttributes) {
		if (!Array.isArray(inAttributes)) {
			throw error("executeActionArr | inAttributes must be of type array");
		}
		const [options, showMe] = inAttributes;
		SceneTransition.macro(options, showMe);
	},
};
export default API;
