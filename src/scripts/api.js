import Logger from "./lib/Logger.js";
import { SceneTransition } from "./scene-transitions.js";
import { sceneTransitionsSocket } from "./socket.js";
const API = {
  async executeActionArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw Logger.error("executeActionArr | inAttributes must be of type array");
    }
    let [options] = inAttributes;
    options = {
      ...options,
      fromSocket: true,
    };
    this.executeAction(options);
  },
  executeAction(options) {
    let activeTransition = SceneTransition.activeTransition;

    if (activeTransition) {
      SceneTransition.activeTransition.destroy(true);
    }

    if (options?.action == "end") {
      return;
    }

    activeTransition = new SceneTransition(false, options, undefined);
    activeTransition.render();
  },
  async macroArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw Logger.error("macroArr | inAttributes must be of type array");
    }
    let [options, showMe] = inAttributes;
    options = {
      ...options,
      fromSocket: true,
    };
    // await SceneTransition.macro(false, options, showMe);
    macro(options, showMe);
  },
  macro(options, showMe) {
    if (options.fromSocket) {
      API.executeAction(options);
    } else {
      if (options.users?.length > 0) {
        if (showMe) {
          if (!options.users.includes(game.user.id)) {
            options.users.push(game.user.id);
          }
        } else {
          if (options.users.includes(game.user.id)) {
            const excludeNames = [game.user.id];
            options.users = options.users.filter((name) => !excludeNames.includes(name));
          }
        }
        options = {
          ...options,
          fromSocket: true,
        };
        sceneTransitionsSocket.executeForUsers("executeAction", options.users, options);
      } else {
        if (showMe) {
          options = {
            ...options,
            fromSocket: true,
          };
          sceneTransitionsSocket.executeForEveryone("executeAction", options);
        } else {
          options = {
            ...options,
            fromSocket: true,
          };
          sceneTransitionsSocket.executeForOthers("executeAction", options);
        }
      }
    }
  },
};
export default API;
