import API from "./api.js";
import { CONSTANTS } from "./constants.js";
import Logger from "./lib/Logger.js";
import {
  getVideoType,
  isVideo,
  retrieveFirstImageFromJournalId,
  retrieveFirstTextFromJournalId,
  SceneTransitionOptions,
} from "./lib/lib.js";
import { TransitionForm } from "./scene-transitions-form.js";
import { registerSocket } from "./socket.js";
import { sceneTransitionsSocket } from "./socket.js";
import { Utils } from "./utils.js";
export class SceneTransition {
  /**
   *
   * @param {boolean} preview
   * @param {object} options: v0.1.1 options go here. Previously sceneID
   * @param {object} optionsBackCompat: Previously used for options. Deprecated as of 0.1.1
   */
  constructor(preview, options, optionsBackCompat) {
    //Allow for older versions
    if (optionsBackCompat) {
      optionsBackCompat.sceneID = options;
      options = optionsBackCompat;
      Logger.warn(
        "sceneID and options have been combined into paramater 2 'new Transition(preview, options)' - update your macro asap"
      );
    }
    this.preview = preview;
    this.options = {
      //@ts-ignore
      ...this.constructor.defaultOptions,
      ...options,
    };
    // this.sceneID = this.options.sceneID;
    this.journal = null;
    this.sceneTransitionsElement = null;
    this.destroying = false;
    // if (SceneTransition.hasNewAudioAPI) {
    this.playingAudio = new Sound("");
    // } else {
    // 	this.audio = null;
    // }
  }
  static get defaultOptions() {
    return new SceneTransitionOptions({
      sceneID: "",
      gmHide: true,
      fontColor: "#777777",
      fontSize: "28px",
      bgImg: "",
      bgPos: "center center",
      bgLoop: true,
      bgMuted: true,
      bgSize: "cover",
      bgColor: "#000000",
      bgOpacity: 0.7,
      fadeIn: 400,
      delay: 4000,
      fadeOut: 1000,
      volume: 1.0,
      audioLoop: true,
      skippable: true,
      gmEndAll: true,
      showUI: false,
      activateScene: false,
      content: "",
      audio: "",
      fromSocket: false,
      users: [],
    });
  }
  // static get hasNewAudioAPI() {
  // 	//@ts-ignore
  // 	return typeof Howl != "undefined" ? false : true;
  // }
  /********************
   * Button functions for Foundry menus and window headers
   *******************/
  /**
   * Handles the renderSceneConfig Hook
   *
   * Injects HTML into the scene config.
   *
   * @static
   * @param {SceneConfig} sceneConfig - The Scene config sheet
   * @param {jQuery} html - The HTML of the sheet
   * @param {object} data - Data associated with the sheet rendering
   * @memberof PinFixer
   */
  static async renderSceneConfig(sceneConfig, html, data) {
    const ambItem = html.find(".item[data-tab=ambience]");
    const ambTab = html.find(".tab[data-tab=ambience]");

    ambItem.after(`<a class="item" data-tab="scene-transitions">
		<i class="fas fa-bookmark"></i> ${game.i18n.localize(`${CONSTANTS.MODULE_ID}.scene.config.title`)}</a>`);
    ambTab.after(await this.getSceneHtml(this.getSceneTemplateData(data)));
    this.attachEventListeners(html);
  }
  /**
   * The HTML to be added to the scene configuration
   * in order to configure Pin Fixer for the scene.
   *
   * @param {PinFixSettings} settings - The Pin Fixer settings of the scene being configured.
   * @static
   * @return {string} The HTML to be injected
   * @memberof PinFixer
   */
  static async getSceneHtml(settings) {
    return await renderTemplate(`modules/${CONSTANTS.MODULE_ID}/templates/transition-form.html`, settings);
  }
  /**
   * Retrieves the current data for the scene being configured.
   *
   * @static
   * @param {object} data - The data being passed to the scene config template
   * @return {PinFixSettings}
   * @memberof PinFixer
   */
  static getSceneTemplateData(hookData) {
    // scene.getFlag(CONSTANTS.MODULE_ID, "transition")
    let data = getProperty(hookData.data?.flags[CONSTANTS.MODULE_ID], "transition.options");
    if (!data) {
      data = {
        sceneID: "",
        gmHide: true,
        fontColor: "#777777",
        fontSize: "28px",
        bgImg: "",
        bgPos: "center center",
        bgLoop: true,
        bgMuted: true,
        bgSize: "cover",
        bgColor: "#000000",
        bgOpacity: 0.7,
        fadeIn: 400,
        delay: 4000,
        fadeOut: 1000,
        volume: 1.0,
        audioLoop: true,
        skippable: true,
        gmEndAll: true,
        showUI: false,
        activateScene: false,
        content: "",
        audio: "",
        fromSocket: false,
        users: [],
      };
    }
    // data.sliders = ["zoomFloor", "zoomCeil", "minScale", "maxScale", "hudScale"]
    // 	.map(name => this.mapSliderData(data, name));

    return data;
  }
  static addPlayTransitionBtn(idField) {
    return {
      name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.label.playTransition`),
      icon: '<i class="fas fa-play-circle"></i>',
      condition: (li) => {
        const scene = game.scenes?.get(li.data(idField));
        if (game.user?.isGM && typeof scene.getFlag(CONSTANTS.MODULE_ID, "transition") == "object") {
          return true;
        } else {
          return false;
        }
      },
      callback: (li) => {
        let sceneID = li.data(idField);
        game.scenes?.preload(sceneID, true);
        const scene = game.scenes?.get(li.data(idField));
        //@ts-ignore
        let transition = scene.getFlag(CONSTANTS.MODULE_ID, "transition");
        let options = transition.options;
        options.sceneID = sceneID;
        options = {
          ...options,
          fromSocket: true,
        };
        if (!sceneTransitionsSocket) {
          registerSocket();
        }
        sceneTransitionsSocket.executeForEveryone("executeAction", options);
      },
    };
  }
  static addCreateTransitionBtn(idField) {
    return {
      name: "Create Transition",
      icon: '<i class="fas fa-plus-square"></i>',
      condition: (li) => {
        const scene = game.scenes?.get(li.data(idField));
        if (game.user?.isGM && !scene.getFlag(CONSTANTS.MODULE_ID, "transition")) {
          return true;
        } else {
          return false;
        }
      },
      callback: (li) => {
        let sceneID = li.data(idField);
        let options = {
          sceneID: sceneID,
        };
        let activeTransition = new SceneTransition(true, options, undefined);
        activeTransition.render();
        new TransitionForm(activeTransition, undefined).render(true);
      },
    };
  }
  static addEditTransitionBtn(idField) {
    return {
      name: "Edit Transition",
      icon: '<i class="fas fa-edit"></i>',
      condition: (li) => {
        const scene = game.scenes?.get(li.data(idField));
        if (game.user?.isGM && scene.getFlag(CONSTANTS.MODULE_ID, "transition")) {
          return true;
        } else {
          return false;
        }
      },
      callback: (li) => {
        let scene = game.scenes?.get(li.data(idField));
        let transition = scene.getFlag(CONSTANTS.MODULE_ID, "transition");
        let activeTransition = new SceneTransition(true, transition.options, undefined);
        activeTransition.render();
        new TransitionForm(activeTransition, undefined).render(true);
      },
    };
  }
  static addDeleteTransitionBtn(idField) {
    return {
      name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.label.deleteTransition`),
      icon: '<i class="fas fa-trash-alt"></i>',
      condition: (li) => {
        const scene = game.scenes?.get(li.data(idField));
        if (game.user?.isGM && scene.getFlag(CONSTANTS.MODULE_ID, "transition")) {
          return true;
        } else {
          return false;
        }
      },
      callback: (li) => {
        let scene = game.scenes?.get(li.data(idField));
        scene.unsetFlag(CONSTANTS.MODULE_ID, "transition");
      },
    };
  }
  static addPlayTransitionBtnJE(idField) {
    return {
      name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.label.playTransitionFromJournal`),
      icon: '<i class="fas fa-play-circle"></i>',
      condition: (li) => {
        if (game.user?.isGM) {
          return true;
        } else {
          return false;
        }
      },
      callback: (li) => {
        let id = li.data(idField);
        let journal = game.journal?.get(id)?.data;
        if (!journal) {
          Logger.warn(`No journal is found`);
          return;
        }
        const content = retrieveFirstTextFromJournalId(id, undefined, false);
        const img = retrieveFirstImageFromJournalId(id, undefined, false);
        let options = new SceneTransitionOptions({
          sceneID: undefined,
          content: content,
          bgImg: img,
        });
        options = {
          ...options,
          fromSocket: true,
        };
        if (!sceneTransitionsSocket) {
          registerSocket();
        }
        sceneTransitionsSocket.executeForEveryone("executeAction", options);
      },
    };
  }

  /**
   * The Magic happens here
   * @returns
   */
  async render() {
    SceneTransition.activeTransition = this;

    if (this.options.gmHide && game.user?.isGM) {
      // && this.options.fromSocket
      // Logger.warn(`Cannot play the transaction check out the options : ` + JSON.stringify(this.options));
      Logger.info(`Option 'gmHide' is true and you are a GM so you don't see the transition`);
      return;
    }

    this.options.zIndex = game.user?.isGM || this.options.showUI ? 1 : 5000;

    // https://www.youtube.com/watch?v=05ZHUuQVvJM
    // https://gist.github.com/brickbones/16818b460aede0639e0120f6b013b69e

    // Destroy existing scene transition
    if (this.sceneTransitionsElement) {
      this.destroy(true);
    }

    // Build new scene transition
    this.sceneTransitionsElement = this.#appendSceneTransitionsElement();
    await this.#appendBackgroundElement();
    const contentElement = this.#appendContentElement();
    this.#addOnClick();

    if (this.options.audio) {
      this.#playAudio();
    }

    this.#executeFadeIn(contentElement);
  }

  /**
   * Append the scene transitions element to the body
   * @returns {object} The scene transitions element
   */
  #appendSceneTransitionsElement() {
    const element = document.createElement("div");
    element.setAttribute("id", "scene-transitions");
    element.setAttribute("class", "scene-transitions");
    document.body.appendChild(element);
    return element;
  }

  /**
   * Append the background element to the main element
   * @private
   */
  async #appendBackgroundElement() {
    if (isVideo(this.options.bgImg)) {
      await this.#appendVideoBackgroundElement();
    } else {
      this.#appendStaticBackgroundElement();
    }

    // Assign CSS to the main element
    Object.assign(this.sceneTransitionsElement.style, {
      backgroundColor: this.options.bgColor,
      zIndex: this.options.zIndex,
    });
  }

  /**
   * Append the video background element to the main element
   * @private
   */
  async #appendVideoBackgroundElement() {
    const video = await Utils.preloadVideoMetadata(this.options.bgImg);
    this.options.delay = Utils.convertSecondsToMilliseconds(video.duration);

    // Color Overlay Element
    const colorOverlayElement = document.createElement("div");
    colorOverlayElement.setAttribute("class", "color-overlay");
    Object.assign(colorOverlayElement.style, {
      opacity: this.options.bgOpacity,
      backgroundColor: this.options.bgColor,
      zIndex: this.options.zIndex,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
    });
    this.sceneTransitionsElement.appendChild(colorOverlayElement);

    // Video Element
    const videoElement = document.createElement("video");
    videoElement.setAttribute("class", "scene-transitions-bg");
    videoElement.setAttribute("autoplay", "");
    if (this.options.bgLoop) {
      videoElement.setAttribute("loop", "");
    }
    if (this.options.bgMuted) {
      videoElement.setAttribute("muted", "");
    }
    Object.assign(videoElement.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
    });
    const sourceElement = document.createElement("source");
    sourceElement.setAttribute("src", this.options.bgImg);
    sourceElement.setAttribute("type", getVideoType(this.options.bgImg));
    videoElement.appendChild(sourceElement);
    this.sceneTransitionsElement.appendChild(videoElement);
  }

  /**
   * Append the static background element to the main element
   * @private
   */
  #appendStaticBackgroundElement() {
    const backgroundElement = document.createElement("div");
    backgroundElement.setAttribute("class", "scene-transitions-bg");
    Object.assign(backgroundElement.style, {
      backgroundImage: `url(${this.options.bgImg})`,
      opacity: this.options.bgOpacity,
      backgroundSize: this.options.bgSize,
      backgroundPosition: this.options.bgPos,
    });
    this.sceneTransitionsElement.appendChild(backgroundElement);
  }

  /**
   * Append the content element to the main element
   * @private
   */
  #appendContentElement() {
    const contentElement = document.createElement("div");
    contentElement.setAttribute("class", "scene-transitions-content");
    Object.assign(contentElement.style, {
      color: this.options.fontColor,
      fontSize: this.options.fontSize,
      zIndex: 5000,
    });
    contentElement.innerHTML = this.options.content;
    this.sceneTransitionsElement.appendChild(contentElement);

    return contentElement;
  }

  /**
   * Add on click listener to the main element
   */
  #addOnClick() {
    const onClick = () => {
      if (game.user?.isGM && this.options.gmEndAll) {
        let options = new SceneTransitionOptions({ action: "end" });
        options = {
          ...options,
          fromSocket: true,
        };
        if (!sceneTransitionsSocket) {
          registerSocket();
        }
        sceneTransitionsSocket.executeForEveryone("executeAction", options);
      }
      this.destroy();
    };

    if (game.user?.isGM || this.options.skippable) {
      $(this.sceneTransitionsElement).on("click", onClick);
    }
  }

  /**
   * Play the audio
   * @private
   */
  #playAudio() {
    if (game.audio.locked) {
      Logger.info("Audio playback locked, cannot play " + this.options.audio);
    } else {
      let thisTransition = this;
      AudioHelper.play(
        {
          src: this.options.audio,
          volume: this.options.volume,
          loop: String(this.options.audioLoop) === "true" ? true : false,
        },
        false
      ).then(function (audio) {
        audio.on("start", (a) => {});
        audio.on("stop", (a) => {});
        audio.on("end", (a) => {});
        thisTransition.playingAudio = audio; // a ref for fading later
      });
    }
  }

  /**
   * Execute the fade in of the main element
   * @private
   * @param {object} contentElement The content element
   */
  #executeFadeIn(contentElement) {
    const activateScene = () => {
      if (!this.options.preview) {
        const scene = game.scenes?.get(this.options.sceneID);

        if (game.user?.isGM && !scene) {
          Logger.info(`The scene has not been activated as scene [${this.options.sceneID}] was not found`);
          return;
        }

        if (this.options.activateScene) {
          scene.activate();
        } else if (game.user?.isGM) {
          scene.view();
        }
      }
    };

    $(contentElement).fadeIn();

    this.setDelay();

    $(this.sceneTransitionsElement).fadeIn(this.options.fadeIn, activateScene);
  }

  setDelay() {
    this.timeout = setTimeout(
      function () {
        this.destroy();
      }.bind(this),
      this.options.delay
    );
  }

  destroy(instant = false) {
    if (this.destroying == true) return;
    this.destroying = true;
    let time = instant ? 0 : this.options.fadeOut;
    clearTimeout(this.timeout);

    if (this.playingAudio?.playing) {
      this.fadeAudio(this.playingAudio, time);
    }

    $(this.sceneTransitionsElement)?.fadeOut(time, () => {
      this.sceneTransitionsElement.remove();
      this.sceneTransitionsElement = null;
    });
  }

  updateData(newData) {
    this.options = mergeObject(this.options, newData);
    return this;
  }

  getJournalText() {
    //@ts-ignore
    return retrieveFirstTextFromJournalId(this.journal?.id, undefined, false);
  }
  getJournalImg() {
    //@ts-ignore
    return retrieveFirstImageFromJournalId(this.journal?.id, undefined, false);
  }
  fadeAudio(audio, time) {
    if (!audio?.playing) {
      return;
    }
    if (time == 0) {
      audio.stop();
      return;
    }
    let volume = audio.gain.value;
    let targetVolume = 0.000001;
    let speed = (volume / time) * 50;
    audio.gain.value = volume;
    let fade = function () {
      volume -= speed;
      audio.gain.value = volume.toFixed(6);
      if (volume.toFixed(6) <= targetVolume) {
        audio.stop();
        clearInterval(audioFadeTimer);
      }
    };
    let audioFadeTimer = setInterval(fade, 50);
    fade();
  }
}
SceneTransition.activeTransition = new SceneTransition(undefined, undefined, undefined);
