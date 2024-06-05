import API from "./api.js";
import CONSTANTS from "./constants.js";
import { registerSettings } from "./settings.js";
import { registerSocket, sceneTransitionsSocket } from "./socket.js";
import { SceneTransitionOptions } from "./scene-transition-options.js";
import { SceneTransition } from "./scene-transition.js";

Hooks.once("init", async () => {
  registerSettings();
  registerSocket();
});

Hooks.once("setup", () => {
  game.modules.get(CONSTANTS.MODULE.ID).api = API;
});
Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(CONSTANTS.MODULE.ID);
});

/********************
 * Adds menu option to Scene Nav and Directory
 *******************/
Hooks.on("getSceneNavigationContext", (html, contextOptions) =>
  addContextButtons("getSceneNavigationContext", contextOptions)
);
Hooks.on("getSceneDirectoryEntryContext", (html, contextOptions) =>
  addContextButtons("getSceneDirectoryEntryContext", contextOptions)
);
Hooks.on("getJournalDirectoryEntryContext", (html, contextOptions) =>
  addContextButtons("getJournalDirectoryEntryContext", contextOptions)
);
Hooks.on("renderJournalSheet", (journal) => addJournalButton(journal));

/**
 * Add Create, Edit, Delete, Play context buttons
 * @param {string} hookName      The hook name
 * @param {array} contextOptions The context options
 */
function addContextButtons(hookName, contextOptions) {
  const idField = {
    getJournalDirectoryEntryContext: "documentId",
    getSceneDirectoryEntryContext: "documentId",
    getSceneNavigationContext: "sceneId",
  };

  if (hookName === "getJournalDirectoryEntryContext") {
    contextOptions.push(SceneTransition.addPlayTransitionBtnJE(idField[hookName]));
    return;
  }

  contextOptions.push(SceneTransition.addPlayTransitionBtn(idField[hookName]));
  contextOptions.push(SceneTransition.addCreateTransitionBtn(idField[hookName]));
  contextOptions.push(SceneTransition.addEditTransitionBtn(idField[hookName]));
  contextOptions.push(SceneTransition.addDeleteTransitionBtn(idField[hookName]));
}

/**
 * Add 'Play as Transition' button to Journal header
 * @param {object} journal The journal
 */
function addJournalButton(journal) {
  const pageTypes = ["image", "text", "video"];

  if (!game.user?.isGM) return;

  const showJournalHeaderSetting = game.settings.get(CONSTANTS.MODULE.ID, CONSTANTS.SETTING.SHOW_JOURNAL_HEADER);
  if (!showJournalHeaderSetting) return;

  const header = journal.element[0].querySelector("header");

  if (!header) return;

  const windowTitle = header.querySelector(`h4[class="window-title"]`);

  if (!windowTitle) return;

  const existingLink = header.querySelector("a.play-transition");

  if (existingLink) {
    existingLink.remove();
  }

  const page = journal.getData().pages[0];

  if (!pageTypes.includes(page.type)) return;

  const linkElement = document.createElement("a");
  linkElement.classList.add("play-transition");
  const iconElement = document.createElement("i");
  iconElement.classList.add("fas", "fa-play-circle");
  linkElement.appendChild(iconElement);
  const textNode = document.createTextNode("Play as Transition");
  linkElement.appendChild(textNode);
  windowTitle.after(linkElement);

  const onClickJournalButton = (page) => {
    let content = null;
    let bgImg = null;
    let bgLoop = null;
    let volume = null;

    switch (page.type) {
      case "image":
        bgImg = page.src;
        break;
      case "text":
        content = Utils.getTextFromPage(page);
        bgImg = Utils.getFirstImageFromPage(page);
        break;
      case "video":
        bgImg = page.src;
        bgLoop = page.video.loop;
        volume = page.video.volume;
        break;
      default:
        return;
    }

    let options = new SceneTransitionOptions({ content, bgImg, bgLoop });

    sceneTransitionsSocket.executeForEveryone("executeAction", options);
  };

  linkElement.addEventListener("click", () => {
    onClickJournalButton(page);
  });
}
