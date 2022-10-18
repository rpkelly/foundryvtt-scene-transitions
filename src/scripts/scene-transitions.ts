/************************
 * Scene Transitions
 * Author @DM_miX since 0.0.8
 * Origianl author credit and big shout out to @WillS
 *************************/

import CONSTANTS from "./constants";
import { warn } from "./lib/lib";

export class SceneTransition {
	preview: boolean;
	sceneID: string;
	playingAudio: Sound | null;
	audio: Sound | null;
	options: any;
	journal: Journal | null;
	destroying: boolean;
	modal: string | null;

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
			warn(
				"sceneID and options have been combined into paramater 2 'new Transition(preview, options)' - update your macro asap"
			);
		}

		this.preview = preview;
		this.options = {
			...this.constructor.defaultOptions,
			...options,
		};
		this.sceneID = this.options.sceneID;
		this.journal = null;
		this.modal = null;
		this.destroying = false;
		if (SceneTransition.hasNewAudioAPI) {
			this.playingAudio = new Sound("");
		} else {
			this.audio = null;
		}
	}

	static activeTransition = new SceneTransition();

	static get defaultOptions() {
		return {
			sceneID: false,
			gmHide: true,
			fontColor: "#777777",
			fontSize: "28px",
			bgImg: "",
			bgPos: "center center",
			bgSize: "cover",
			bgColor: "#000000",
			bgOpacity: 0.7,
			fadeIn: 400,
			delay: 4000,
			fadeOut: 1000,
			volume: 1.0,
			skippable: true,
			gmEndAll: true,
			showUI: false,
			content: "",
		};
	}

	static get hasNewAudioAPI() {
		//@ts-ignore
		return typeof Howl != "undefined" ? false : true;
	}

	/********************
	 * Button functions for Foundry menus and window headers
	 *******************/
	static addPlayTransitionBtn(idField) {
		return {
			name: "Play Transition",
			icon: '<i class="fas fa-play-circle"></i>',
			condition: (li) => {
				if (
					game.user?.isGM &&
					typeof game.scenes?.get(<string>li.data(idField)).getFlag(CONSTANTS.MODULE_NAME, "transition") ==
						"object"
				)
					return true;
			},
			callback: (li) => {
				let sceneID = li.data(idField);
				game.scenes?.preload(sceneID, true);
				let options = game.scenes?.get(li.data(idField)).getFlag(CONSTANTS.MODULE_NAME, "transition").options;
				options.sceneID = sceneID;
				let activeTransition = new SceneTransition(false, options, undefined);
				activeTransition.render();
				game.socket.emit("module.scene-transitions", options);
			},
		};
	}

	static addCreateTransitionBtn(idField) {
		return {
			name: "Create Transition",
			icon: '<i class="fas fa-plus-square"></i>',
			condition: (li) => {
				if (game.user?.isGM && !game.scenes?.get(li.data(idField)).getFlag(CONSTANTS.MODULE_NAME, "transition"))
					return true;
			},
			callback: (li) => {
				let sceneID = li.data(idField);

				let activeTransition = new SceneTransition(true, { sceneID: sceneID });
				activeTransition.render();
				new TransitionForm(activeTransition).render(true);
			},
		};
	}

	static addEditTransitionBtn(idField) {
		return {
			name: "Edit Transition",
			icon: '<i class="fas fa-edit"></i>',
			condition: (li) => {
				if (game.user.isGM && game.scenes.get(li.data(idField)).getFlag(CONSTANTS.MODULE_NAME, "transition"))
					return true;
			},
			callback: (li) => {
				let scene = game.scenes.get(li.data(idField));
				let activeTransition = new Transition(true, scene.getFlag(CONSTANTS.MODULE_NAME, "transition").options);
				activeTransition.render();
				new TransitionForm(activeTransition).render(true);
			},
		};
	}

	static addDeleteTransitionBtn(idField) {
		return {
			name: "Delete Transition",
			icon: '<i class="fas fa-trash-alt"></i>',
			condition: (li) => {
				if (game.user.isGM && game.scenes.get(li.data(idField)).getFlag(CONSTANTS.MODULE_NAME, "transition"))
					return true;
			},
			callback: (li) => {
				let scene = game.scenes.get(li.data(idField));
				scene.unsetFlag(CONSTANTS.MODULE_NAME, "transition");
			},
		};
	}

	static addPlayTransitionBtnJE(idField) {
		return {
			name: "Play Transition From Journal",
			icon: '<i class="fas fa-play-circle"></i>',
			condition: (li) => {
				if (game.user.isGM) return true;
			},
			callback: (li) => {
				let id = li.data(idField);

				let journal = game.journal.get(id).data;
				let options = {
					sceneID: false,
					content: journal.content,
					bgImg: journal.img,
				};
				let activeTransition = new Transition(false, options);
				activeTransition.render();
				game.socket.emit("module.scene-transitions", options);
			},
		};
	}

	static macro(options, showMe) {
		game.socket.emit("module.scene-transitions", options);

		if (showMe || options.gmEndAll) {
			//force show on triggering window if gmEndAll is active
			let activeTransition = new Transition(false, options);
			activeTransition.render();
		}
	}

	/**
	 * The Mahic happens here
	 * @returns
	 */
	render() {
		Transition.activeTransition = this;
		if (this.options.gmHide && this.options.fromSocket && game.user.isGM) {
			return;
		}

		if (Transition.hasNewAudioAPI) {
			$("body").append(
				'<div id="transition" class="transition"><div class="transition-bg"></div><div class="transition-content"></div></div>'
			);
		} else {
			$("body").append(
				'<div id="transition" class="transition"><div class="transition-bg"></div><div class="transition-content"></div><audio><source src=""></audio></div>'
			);
		}

		let zIndex = game.user.isGM || this.options.showUI ? 1 : 5000;
		this.modal = $("#transition");

		this.modal.css({ backgroundColor: this.options.bgColor, zIndex: zIndex });
		this.modal
			.find(".transition-bg")
			.css({
				backgroundImage: "url(" + this.options.bgImg + ")",
				opacity: this.options.bgOpacity,
				backgroundSize: this.options.bgSize,
				backgroundPosition: this.options.bgPos,
			});
		this.modal
			.find(".transition-content")
			.css({ color: this.options.fontColor, fontSize: this.options.fontSize })
			.html(this.options.content);

		if (this.options.audio) {
			if (Transition.hasNewAudioAPI) {
				// 0.8.1+
				if (game.audio.locked) {
					console.log("Scene Transitions | Audio playback locked, cannot play " + this.options.audio);
				} else {
					let thisTransition = this;
					AudioHelper.play({ src: this.options.audio, volume: this.options.volume, loop: false }, false).then(
						function (audio) {
							audio.on("start", (a) => {});
							audio.on("stop", (a) => {});
							audio.on("end", (a) => {});

							thisTransition.playingAudio = audio; // a ref for fading later
						}
					);
				}
			} else {
				// 0.7.9
				this.audio = this.modal.find("audio")[0];
				this.modal.find("audio").attr("src", this.options.audio);
				this.audio.load();
				this.audio.volume = this.options.volume.toFixed(1);
				this.audio.play();
			}
		}

		this.modal.fadeIn(this.options.fadeIn, () => {
			if (game.user.isGM && !this.preview && this.sceneID !== false) {
				game.scenes.get(this.sceneID).activate();
			}

			this.modal.find(".transition-content").fadeIn();
			if (!this.preview) this.setDelay();
		});
		if ((this.options.skippable && !this.preview) || (this.options.gmEndAll && game.user.isGM && !this.preview)) {
			this.modal.on("click", () => {
				if (this.options.gmEndAll && game.user.isGM) {
					game.socket.emit("module.scene-transitions", { action: "end" });
				}
				this.destroy();
			});
		}
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
		if (Transition.hasNewAudioAPI) {
			if (this.playingAudio.playing) {
				this.fadeAudio(this.playingAudio, time);
			}
		} else {
			if (this.audio !== null) this.fadeAudio(this.audio, time);
			this.modal.fadeOut(time, () => {
				this.modal.remove();
				this.modal = null;
			});
		}
		this.modal.fadeOut(time, () => {
			this.modal.remove();
			this.modal = null;
		});
	}

	updateData(newData) {
		this.options = mergeObject(this.options, newData);
		return this;
	}

	getJournalText() {
		return this.journal.content;
	}

	getJournalImg() {
		return this.journal.img;
	}

	fadeAudio(audio, time) {
		if (Transition.hasNewAudioAPI) {
			// 0.8.1+
			if (!audio.playing) {
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
		} else {
			// 0.7.9
			if (time == 0) return;
			if (audio.volume) {
				let volume = audio.volume;
				let targetVolume = 0;
				let speed = (volume / time) * 100;
				audio.volume = volume;
				let fade = function () {
					volume -= speed;
					audio.volume = volume.toFixed(1);
					if (volume.toFixed(1) <= targetVolume) {
						clearInterval(audioFadeTimer);
					}
				};
				fade();
				let audioFadeTimer = setInterval(fade, 100);
			}
		}
	}

	static registerSettings() {
		game.settings.register("scene-transitions", "show-journal-header-transition", {
			name: "Show Play as Transition in Journal window",
			hint: "",
			scope: "world",
			config: true,
			type: Boolean,
			default: true,
		});
	}

	static registerSockets() {
		game.socket.on("module.scene-transitions", async (data) => {
			if (data.action) {
				switch (data.action) {
					case "end":
						Transition.activeTransition.destroy();
						break;

					default:
						break;
				}
			} else {
				// Run a transition
				let options = data;
				if (!options.users || options.users.contains(game.userId)) {
					options = {
						...options,
						fromSocket: true,
					};
					new Transition(false, options).render();
				}
			}
		});
	}
}
