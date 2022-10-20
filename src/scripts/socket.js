import CONSTANTS from "./constants.js";
import API from "./api.js";
import { debug } from "./lib/lib.js";
import { setSocket } from "../main.js";
export let sceneTransitionsSocket;
export function registerSocket() {
	debug("Registered sceneTransitionsSocket");
	if (sceneTransitionsSocket) {
		return sceneTransitionsSocket;
	}
	//@ts-ignore
	sceneTransitionsSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);
	sceneTransitionsSocket.register("executeAction", (...args) => API.executeActionArr(...args));
	setSocket(sceneTransitionsSocket);
	return sceneTransitionsSocket;
}
