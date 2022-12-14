import CONSTANTS from "./constants.js";

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
			title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.label.editTransition`),
			template: `modules/${CONSTANTS.MODULE_NAME}/templates/transition-form.html`,
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
		context.contentHTML = await TextEditor.enrichHTML(this.transition.options.content, {
			secrets: true,
			async: true,
		});
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

	// async activateEditor(name, options = {}, initialContent = "") {
	// 	const editor = this.editors[name];
	// 	if (!editor) throw new Error(`${name} is not a registered editor name!`);
	// 	options = mergeObject(editor.options, options);
	// 	// options.relativeLinks = true;
	// 	options.plugins = {
	// 		menu: ProseMirror.ProseMirrorMenu.build(ProseMirror.defaultSchema, {
	// 			compact: true,
	// 			destroyOnSave: false,
	// 			onSave: () => {
	// 				// this.saveEditor(name, { remove: false });
	// 				this._saveEditor(name, { remove: false });
	// 			},
	// 		}),
	// 	};
	// 	options.height = options.target.offsetHeight;
	// 	options.async = false;
	// 	// await TextEditor.create(options, initialContent || editor.initial).then((mce) => {
	// 	// 	editor.mce = mce;
	// 	// 	editor.changed = false;
	// 	// 	editor.active = true;
	// 	// 	//mce.focus();
	// 	// 	mce.on("change", (ev) => (editor.changed = true));
	// 	// });
	// 	return true;
	// }

	// /**
	//  * Activate an editor instance present within the form
	//  * @param {HTMLElement} div  The element which contains the editor
	//  * @protected
	//  */
	// async _activateEditor(div) {
	// 	// Get the editor content div
	// 	const name = div.getAttribute("data-edit");
	// 	const button = div.nextElementSibling;
	// 	const hasButton = button && button.classList.contains("editor-edit");
	// 	const wrap = div.parentElement.parentElement;
	// 	const wc = $(div).parents(".window-content")[0];
	// 	// Determine the preferred editor height
	// 	const heights = [wrap.offsetHeight, wc ? wc.offsetHeight : null];
	// 	if (div.offsetHeight > 0) heights.push(div.offsetHeight);
	// 	let height = Math.min(...heights.filter((h) => Number.isFinite(h)));
	// 	// Get initial content
	// 	//const data = this.object instanceof Entity ? this.object.data : this.object;
	// 	const data = this.object;
	// 	const initialContent = getProperty(data, name);
	// 	const editorOptions = {
	// 		target: div,
	// 		height: height,
	// 		save_onsavecallback: (mce) => this.saveEditor(name),
	// 	};
	// 	// Add record to editors registry
	// 	this.editors[name] = {
	// 		target: name,
	// 		button: button,
	// 		hasButton: hasButton,
	// 		mce: null,
	// 		active: !hasButton,
	// 		changed: false,
	// 		options: editorOptions,
	// 		initial: initialContent,
	// 	};
	// 	// If we are using a toggle button, delay activation until it is clicked
	// 	if (hasButton) {
	// 		button.onclick = async (event) => {
	// 			button.style.display = "none";
	// 			await this.activateEditor(name, editorOptions, initialContent);
	// 		};
	// 	}
	// 	// Otherwise activate immediately
	// 	else {
	// 		await this.activateEditor(name, editorOptions, initialContent);
	// 	}
	// 	// return true;
	// }

	/** @inheritdoc */
	async activateEditor(name, options = {}, initialContent = "") {
		// options.relativeLinks = true;
		options.plugins = {
			menu: ProseMirror.ProseMirrorMenu.build(ProseMirror.defaultSchema, {
				compact: true,
				destroyOnSave: false,
				onSave: () => {
					// this.saveEditor(name, { remove: false });
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

	// /**
	//  * Handle standard form submission steps
	//  * @param {Event} event               The submit event which triggered this handler
	//  * @param {object | null} [updateData]  Additional specific data keys/values which override or extend the contents of
	//  *                                    the parsed form. This can be used to update other flags or data fields at the
	//  *                                    same time as processing a form submission to avoid multiple database operations.
	//  * @param {boolean} [preventClose]    Override the standard behavior of whether to close the form on submit
	//  * @param {boolean} [preventRender]   Prevent the application from re-rendering as a result of form submission
	//  * @returns {Promise}                 A promise which resolves to the validated update data
	//  * @protected
	//  */
	// async _onSubmitContent(event, { updateData = null, preventClose = false, preventRender = false } = {}) {
	// 	event.preventDefault();

	// 	// Prevent double submission
	// 	const states = this.constructor.RENDER_STATES;
	// 	if (this._state === states.NONE || !this.isEditable || this._submitting) return false;
	// 	this._submitting = true;

	// 	// Process the form data
	// 	const formData = this._getSubmitData(updateData);

	// 	// Handle the form state prior to submission
	// 	let closeForm = this.options.closeOnSubmit && !preventClose;
	// 	const priorState = this._state;
	// 	if (preventRender) this._state = states.RENDERING;
	// 	if (closeForm) this._state = states.CLOSING;

	// 	// Trigger the object update
	// 	try {
	// 		await this._updateObject(event, formData);
	// 	} catch (err) {
	// 		console.error(err);
	// 		closeForm = false;
	// 		this._state = priorState;
	// 	}

	// 	// Restore flags and optionally close the form
	// 	this._submitting = false;
	// 	if (preventRender) this._state = priorState;
	// 	// if (closeForm) await this.close({ submit: false, force: true });
	// 	return formData;
	// }

	// /** @inheritDoc */
	// _getSubmitData(updateData = {}) {
	// 	const formData = foundry.utils.expandObject(super._getSubmitData(updateData));

	// 	// Return the flattened submission data
	// 	return foundry.utils.flattenObject(formData);
	// }

	async activateListeners(html) {
		super.activateListeners(html);
		//this.updatePreview();
		html.on("change", "input,select,textarea", this._onChangeInput.bind(this));
		const bgImageInput = html.find('input[name="bgImg"]');
		const bgOpacityInput = html.find('input[name="bgOpacity"]');
		const bgSizeInput = html.find('input[name="bgSize"]');
		const bgPosInput = html.find('input[name="bgPos"]');
		const bgLoopInput = html.find('input[name="bgLoop"]');
		const bgMutedInput = html.find('input[name="bgMuted"]');
		const fontSizeInput = html.find('input[name="fontSize"]');
		const textEditor = html.find(".mce-content-body");
		const volumeSlider = html.find('input[name="volume"]');
		const audioLoopInput = html.find('input[name="audioLoop"]');
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
			if (this.playingAudio.playing) {
				this.playingAudio.gain.value = e.target.value;
			}
		});

		const contentHTML = await TextEditor.enrichHTML(this.transition.options.content, {
			secrets: true,
			async: true,
		});
		// html.find(".editor-content")[0].innerHTML = contentHTML;
		$('[data-edit="content"]').html(contentHTML);
		// this._activateEditor(html.find(".editor-content")[0]).then(async () => {
		// 	//@ts-ignore
		// 	await this.activateEditor("content", this.editors.content.options, this.editors.content.initial);
		// 	//@ts-ignore
		// 	this.editors.content.mce.on("focus", (e) => {
		// 		this.interval = setInterval(() => {
		// 			//@ts-ignore
		// 			preview.find(".scene-transitions-content").html(this.editors.content.mce.getBody().innerHTML);
		// 		}, 500);
		// 	});
		// 	//@ts-ignore
		// 	this.editors.content.mce.on("blur", (e) => {
		// 		clearInterval(this.interval);
		// 	});
		// });
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
		// if (SceneTransition.hasNewAudioAPI) {
		this.transition.playingAudio.stop();
		// }
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
		const scene = game.scenes?.get(this.transition.sceneID);
		if (this.transition.sceneID != false) {
			await scene.setFlag(CONSTANTS.MODULE_NAME, "transition", this.transition);
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
