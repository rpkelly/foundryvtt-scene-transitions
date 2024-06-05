import CONSTANTS from "./constants.js";
import { Utils } from "./utils.js";

export class SceneTransitionOptions {
  constructor(options) {
    const defaultUserOption = Utils.getSetting(CONSTANTS.SETTING.DEFAULT_OPTIONS);
    const defaultSystemOption = CONSTANTS.DEFAULT_SETTING;
    const defaultOption = foundry.utils.mergeObject(defaultSystemOption, defaultUserOption);

    this.action = options.action || defaultOption.action;
    this.sceneID = options.sceneID || defaultOption.sceneID;
    this.gmHide = Utils.isBoolean(options.gmHide) ? options.gmHide : defaultOption.gmHide;
    this.fontColor = options.fontColor || defaultOption.fontColor;
    this.fontSize = parseInt(options.fontSize) || defaultOption.fontSize;
    this.bgImg = options.bgImg || defaultOption.bgImg;
    this.bgPos = options.bgPos || defaultOption.bgPos;
    this.bgLoop = Utils.isBoolean(options.bgLoop) ? options.bgLoop : defaultOption.bgLoop;
    this.bgMuted = Utils.isBoolean(options.bgMuted) ? options.bgMuted : defaultOption.bgMuted;
    this.bgSize = options.bgSize || defaultOption.bgSize;
    this.bgColor = options.bgColor || defaultOption.bgColor;
    this.bgOpacity = options.bgOpacity || defaultOption.bgOpacity;
    this.fadeIn = options.fadeIn || defaultOption.fadeIn;
    this.delay = options.delay || defaultOption.delay;
    this.fadeOut = options.fadeOut || defaultOption.fadeOut;
    this.volume = options.volume || defaultOption.volume;
    this.audioLoop = Utils.isBoolean(options.audioLoop) ? options.audioLoop : defaultOption.audioLoop;
    this.allowPlayersToEnd = Utils.isBoolean(options.allowPlayersToEnd)
      ? options.allowPlayersToEnd
      : defaultOption.allowPlayersToEnd;
    this.gmEndAll = Utils.isBoolean(options.gmEndAll) ? options.gmEndAll : defaultOption.gmEndAll;
    this.showUI = Utils.isBoolean(options.showUI) ? options.showUI : defaultOption.showUI;
    this.activateScene = Utils.isBoolean(options.activateScene) ? options.activateScene : defaultOption.activateScene;
    this.content = options.content || defaultOption.content;
    this.audio = options.audio || defaultOption.audio;
    this.fromSocket = Utils.isBoolean(options.fromSocket) ? options.fromSocket : defaultOption.fromSocket;
    this.users = options.users || defaultOption.users;
  }
}
