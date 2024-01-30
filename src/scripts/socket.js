import { CONSTANTS } from "./constants.js";
import API from "./api.js";
import Logger from "./lib/Logger.js";

export let sceneTransitionsSocket;
export function registerSocket() {
  Logger.debug("Registered sceneTransitionsSocket");
  if (sceneTransitionsSocket) {
    return sceneTransitionsSocket;
  }

  sceneTransitionsSocket = socketlib.registerModule(CONSTANTS.MODULE_ID);
  sceneTransitionsSocket.register("executeAction", (...args) => API.executeActionArr(...args));
  sceneTransitionsSocket.register("macro", (...args) => API.macroArr(...args));
  game.modules.get(CONSTANTS.MODULE_ID).socket = sceneTransitionsSocket;
  return sceneTransitionsSocket;
}
