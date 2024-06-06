import Logger from "./logger.js";
import { SceneTransition } from "./scene-transition.js";
import { sceneTransitionsSocket } from "./socket.js";

async function executeActionArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
        throw Logger.error("executeActionArr | inAttributes must be of type array");
    }
    let [options] = inAttributes;
    options = {
        ...options,
        fromSocket: true,
    };
    this.executeAction(options);
}

/**
 * Execute action
 * @param {object} options
 * @returns
 */
async function executeAction(options) {
    await SceneTransition?.activeTransition?.destroy(true);

    if (options?.action == "end") return;

    const sceneTransition = new SceneTransition(false, options, undefined);
    sceneTransition.render();
}

async function macroArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
        throw Logger.error("macroArr | inAttributes must be of type array");
    }
    let [options, showMe] = inAttributes;
    options = {
        ...options,
        fromSocket: true,
    };

    macro(options, showMe);
}

async function macro(options, showMe) {
    if (options.fromSocket) {
        executeAction(options);
        return;
    }

    options.fromSocket = true;

    const userId = game.user.id;
    const users = options?.users;

    if (users?.length) {
        if (showMe && !users.includes(userId)) {
            users.push(userId);
        } else if (!showMe) {
            options.users = users.filter((name) => name !== userId);
        }
        sceneTransitionsSocket.executeForUsers("executeAction", options.users, options);
    } else {
        if (showMe) {
            sceneTransitionsSocket.executeForEveryone("executeAction", options);
        } else {
            sceneTransitionsSocket.executeForOthers("executeAction", options);
        }
    }
}

const API = {
    executeActionArr,
    executeAction,
    macroArr,
    macro,
};

export default API;
