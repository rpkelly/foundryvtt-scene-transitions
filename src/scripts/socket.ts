import CONSTANTS from "./constants";
import API from "./api";
import { debug } from "./lib/lib";
import { setSocket } from "../main";

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
