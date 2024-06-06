import API from "./api.js";
import CONSTANTS from "./constants.js";
import Logger from "./logger.js";

export let sceneTransitionsSocket;

export function registerSocket() {
    Logger.debug("Registered socket");
    if (sceneTransitionsSocket) {
        return sceneTransitionsSocket;
    }
    //@ts-ignore
    sceneTransitionsSocket = socketlib.registerModule(CONSTANTS.MODULE.ID);
    sceneTransitionsSocket.register("executeAction", (...args) => API.executeActionArr(...args));
    sceneTransitionsSocket.register("macro", (...args) => API.macroArr(...args));
    game.modules.get(CONSTANTS.MODULE.ID).socket = sceneTransitionsSocket;
    return sceneTransitionsSocket;
}
