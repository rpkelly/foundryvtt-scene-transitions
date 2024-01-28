import API from "./api.js";
import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";
import { retrieveFirstImageFromJournalId, retrieveFirstTextFromJournalId, SceneTransitionOptions } from "./lib/lib.js";
import { SceneTransition } from "./scene-transitions.js";
import { registerSocket, sceneTransitionsSocket } from "./socket.js";
export const initHooks = () => {
  // Logger.warn("Init Hooks processing");
  // setup all the hooks
  Hooks.once("socketlib.ready", registerSocket);
  registerSocket();
  // SceneTransition.registerSettings();
  // SceneTransition.registerSockets();
};
export const setupHooks = () => {
  // Logger.warn("Setup Hooks processing");
  // Set up API
  game.modules.get(CONSTANTS.MODULE_ID).api = API;
};
export const readyHooks = async () => {
  // Logger.warn("Ready Hooks processing");
  $("body").on("click", ".play-transition", (e) => {
    let elements = $(e.target).parents(".journal-sheet").attr("id")?.split("-");
    let id = elements[1];
    let journal = game.journal?.get(id)?.data;
    if (!journal) {
      Logger.warn(`No journal is found`);
      return;
    }
    const content = retrieveFirstTextFromJournalId(id, undefined, false);
    const img = retrieveFirstImageFromJournalId(id, undefined, false);
    let options = new SceneTransitionOptions({
      content: content,
      bgImg: img,
    });
    options = {
      ...options,
      fromSocket: true,
    };
    sceneTransitionsSocket.executeForEveryone("executeAction", options);
  });
};

Hooks.on("closeTransitionForm", (form) => {
  let activeSceneTransition = form.object;
  activeSceneTransition.destroy(true);
  clearInterval(form.interval);
});
/********************
 * Adds menu option to Scene Nav and Directory
 *******************/
//Credit to Winks' Everybody Look Here for the code to add menu option to Scene Nav
Hooks.on("getSceneNavigationContext", (html, contextOptions) => {
  contextOptions.push(SceneTransition.addPlayTransitionBtn("sceneId"));
  contextOptions.push(SceneTransition.addCreateTransitionBtn("sceneId"));
  contextOptions.push(SceneTransition.addEditTransitionBtn("sceneId"));
  contextOptions.push(SceneTransition.addDeleteTransitionBtn("sceneId"));
});
Hooks.on("getSceneDirectoryEntryContext", (html, contextOptions) => {
  contextOptions.push(SceneTransition.addPlayTransitionBtn("documentId"));
  contextOptions.push(SceneTransition.addCreateTransitionBtn("documentId"));
  contextOptions.push(SceneTransition.addEditTransitionBtn("documentId"));
  contextOptions.push(SceneTransition.addDeleteTransitionBtn("documentId"));
});
Hooks.on("getJournalDirectoryEntryContext", (html, contextOptions) => {
  contextOptions.push(SceneTransition.addPlayTransitionBtnJE("documentId"));
});
Hooks.on("renderJournalSheet", (journal) => {
  if (
    game.user?.isGM &&
    $("#" + journal.id + " > header").find(".play-transition").length == 0 &&
    game.settings.get(CONSTANTS.MODULE_ID, "show-journal-header-transition") == true
  ) {
    $(`<a class="play-transition
			<i class="fas fa-play-circle"></i> Play as Transition
			</a>`).insertAfter("#" + journal.id + " > header > h4");
  }
});
// TODO maybe one day...
// Hooks.on("renderSceneConfig", (...args) => SceneTransition.renderSceneConfig(...args));
