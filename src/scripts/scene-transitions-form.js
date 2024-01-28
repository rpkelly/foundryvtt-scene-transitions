import CONSTANTS from "./constants.js";
import { warn, isVideo, getVideoType } from "./lib/lib.js";

/**
 * Form controller for editing transitions
 */
export class TransitionForm extends FormApplication {
  constructor(object, options) {
    super(object, options);
    this.transition = object || {};
    this.data = {};
    this.interval = null;
    // this.editors['content']={options:{}}
  }
  /**
   *
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "scene-transitions-form",
      title: game.i18n.localize(`${CONSTANTS.MODULE_ID}.label.editTransition`),
      template: `modules/${CONSTANTS.MODULE_ID}/templates/transition-form.html`,
      classes: ["sheet", "scene-transitions-form"],
      height: 500,
      width: 436,
    });
  }
  /**
   * Get data for the triggler form
   */
  async getData(options) {
    let context = this.transition.options;
    let sceneTransitionContent = await TextEditor.enrichHTML(this.transition.options.content, {
      secrets: true,
      async: true,
    });

    let sceneTransitionBg = ``;

    if (isVideo(this.transition.options.bgImg)) {
      sceneTransitionBg = `<div id="scene-transitions" class="scene-transitions preview">
					<div class="color-overlay"></div>
					<video class="scene-transitions-bg"
						autoplay
						${this.transition.options.bgLoop ? "loop" : ""}
						${this.transition.options.bgMuted ? "muted" : ""}>
						<source src="${this.transition.options.bgImg}" type="${getVideoType(this.transition.options.bgImg)}">
					</video>
					<div class="scene-transitions-content">
						${sceneTransitionContent}
					</div>
				</div>`;
    } else {
      sceneTransitionBg = `<div id="scene-transitions" class="scene-transitions preview">
				<div class="scene-transitions-bg" style="max-height: 100%; background-image:url(${this.transition.options.bgImg})">
				</div>
				<div class="scene-transitions-content">
					${sceneTransitionContent}
				</div>
			</div>`;
    }

    context.sceneTransitionBgHTML = sceneTransitionBg;
    context.contentHTML = sceneTransitionContent;
    return context;
  }
  updatePreview() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const preview = $("#scene-transitions");
    preview.find(".scene-transitions-bg").css({
      backgroundImage: "url(" + this.transition.options.bgImg + ")",
      opacity: this.transition.options.bgOpacity,
      backgroundColor: this.transition.options.bgColor,
    });
    preview.find(".scene-transitions-content").css({ color: this.transition.options.fontColor });
  }

  /** @inheritdoc */
  async activateEditor(name, options = {}, initialContent = "") {
    // options.relativeLinks = true;
    options.plugins = {
      menu: ProseMirror.ProseMirrorMenu.build(ProseMirror.defaultSchema, {
        compact: true,
        destroyOnSave: false,
        onSave: () => {
          this._saveEditor(name, { remove: false });
        },
      }),
    };
    return super.activateEditor(name, options, initialContent);
  }

  /**
   * Handle saving the content of a specific editor by name
   * @param {string} name           The named editor to save
   * @param {boolean} [remove]      Remove the editor after saving its content
   * @returns {Promise<void>}
   */
  async _saveEditor(name, { remove = true } = {}) {
    const editor = this.editors[name];
    if (!editor || !editor.instance) throw new Error(`${name} is not an active editor name!`);
    editor.active = false;
    const instance = editor.instance;
    await this._onSubmit(new Event("submit"), {
      preventClose: true,
    });

    // Remove the editor
    if (remove) {
      instance.destroy();
      editor.instance = editor.mce = null;
      if (editor.hasButton) editor.button.style.display = "block";
      this.render();
    }
    editor.changed = false;
  }

  /* -------------------------------------------- */

  async activateListeners(html) {
    super.activateListeners(html);
    //this.updatePreview();
    html.on("change", "input,select,textarea", this._onChangeInput.bind(this));
    const bgImageInput = html.find('input[name="bgImg"]');
    const bgColorInput = html.find('input[name="bgColor"]');
    const bgOpacityInput = html.find('input[name="bgOpacity"]');
    const bgSizeInput = html.find('input[name="bgSize"]');
    const bgPosInput = html.find('input[name="bgPos"]');
    const bgLoopInput = html.find('input[name="bgLoop"]');
    const bgMutedInput = html.find('input[name="bgMuted"]');
    const fontSizeInput = html.find('input[name="fontSize"]');
    const fontColorInput = html.find('input[name="fontColor"]');
    const textEditor = html.find(".mce-content-body");
    const volumeSlider = html.find('input[name="volume"]');
    const audioLoopInput = html.find('input[name="audioLoop"]');
    const audioInput = html.find('input[name="audio"]');
    const volumeInput = html.find('input[name="volume"]');
    const showUIInput = html.find('input[name="showUI"]');
    const preview = $("#scene-transitions");
    bgSizeInput.on("change", (e) => {
      this.data.bgSize = e.target.value;
      preview.find(".scene-transitions-bg").css("background-size", this.data.bgSize);
    });
    bgPosInput.on("change", (e) => {
      this.data.bgPos = e.target.value;
      preview.find(".scene-transitions-bg").css("background-position", this.data.bgPos);
    });
    bgImageInput.on("change", (e) => {
      this.data.bgImg = e.target.value;
      preview.find(".scene-transitions-bg").css("background-image", `url(${this.data.bgImg})`);
    });
    bgOpacityInput.on("change", (e) => {
      this.data.bgOpacity = e.target.value;
      preview.find(".scene-transitions-bg").css("opacity", e.target.value);
    });
    fontSizeInput.on("change", (e) => {
      preview.find(".scene-transitions-content").css("font-size", e.target.value);
    });
    html.find('button[name="cancel"]').on("click", () => {
      this.close();
    });
    html.find('button[name="save"]').on("click", () => {
      //@ts-ignore
      this._onSubmit();
    });
    volumeSlider.on("change", (e) => {
      //preview.find('audio')[0].volume = e.target.value
      if (this.playingAudio?.playing) {
        this.playingAudio.gain.value = e.target.value;
      }
    });

    const contentHTML = await TextEditor.enrichHTML(this.transition.options.content, {
      secrets: true,
      async: true,
    });
    $('[data-edit="content"]').html(contentHTML);

    /*
		let zIndex = game.user?.isGM || showUIInput ? 1 : 5000;
		this.modal = $(html.find("#scene-transitions"));

		if (isVideo(bgImageInput)) {
			this.modal.css({ backgroundColor: bgColorInput, zIndex: zIndex });

			this.modal.find(".scene-transitions-bg").css({
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
			});

			this.modal.find(".color-overlay").css({
				opacity: bgOpacityInput,
				backgroundColor: bgColorInput,
				zIndex: zIndex,
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100vh",
			});
		} else {
			this.modal.css({
				backgroundColor: bgColorInput,
				zIndex: zIndex,
			});

			this.modal.find(".scene-transitions-bg").css({
				backgroundImage: "url(" + bgImageInput + ")",
				opacity: bgOpacityInput,
				backgroundSize: bgSizeInput,
				backgroundPosition: bgPosInput,
			});
		}

		this.modal
			.find(".scene-transitions-content")
			.css({ color: fontColorInput, fontSize: fontSizeInput, zIndex: 5000 })
			.html(contentHTML);

		if (audioInput) {
			if (game.audio.locked) {
				info("Audio playback locked, cannot play " + audioInput);
			} else {
				let thisTransition = this;
				AudioHelper.play(
					{
						src: audioInput,
						volume: volumeInput,
						loop: String(audioLoopInput) === "true" ? true : false,
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
		*/
  }
  //@ts-ignore
  close() {
    // if (SceneTransition.hasNewAudioAPI) {
    this.transition.playingAudio.stop();
    // }
    super.close();
  }
  //@ts-ignore
  async _onSubmit(event, { updateData = null, preventClose = false, preventRender = false } = {}) {
    //@ts-ignore
    const states = this.constructor.RENDER_STATES;
    if (this._state === states.NONE || !this.options.editable || this._submitting) {
      return false;
    }
    this._submitting = true;
    this.transition.playingAudio.stop();

    // Acquire and validate Form Data
    const form = this.element.find("form").first()[0];
    // Flag if the application is staged to close to prevent callback renders
    const priorState = this._state;
    if (this.options.closeOnSubmit) {
      this._state = states.CLOSING;
    }
    if (preventRender && this._state !== states.CLOSING) {
      this._state = states.RENDERING;
    }
    // Trigger the object update
    const formData = this._getSubmitData(updateData);
    this.transition.updateData(formData);
    const scene = game.scenes?.get(this.transition.options.sceneID);
    if (this.transition.options.sceneID && scene) {
      await scene.setFlag(CONSTANTS.MODULE_ID, "transition", this.transition);
    } else {
      warn(`No scene is been found with sceneId ${this.transition.options.sceneID}`);
      return;
    }
    this._submitting = false;
    this._state = priorState;
    if (this.options.closeOnSubmit && !preventClose) {
      //@ts-ignore
      this.close({ submit: false });
    }
    return formData;
  }
  _onChangeColorPicker(event) {
    const input = event.target;
    const form = input.form;
    form[input.dataset.edit].value = input.value;
    if ($(input).attr("data-edit") == "bgColor") {
      this.data.bgColor = event.target.value;
      $("#scene-transitions").css("background-color", event.target.value);
    } else if ($(input).attr("data-edit") == "fontColor") {
      $("#scene-transitions").find(".scene-transitions-content").css("color", event.target.value);
    }
  }
  async _updateObject(event, formData) {
    return true;
  }
}
