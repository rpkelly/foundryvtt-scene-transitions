import { setApi } from "src/main";
import API from "./api";
import CONSTANTS from "./constants";
import { retrieveFirstImageFromJournalId, retrieveFirstTextFromJournalId } from "./lib/lib";
import { SceneTransition } from "./scene-transitions";
import { registerSocket } from "./socket";

export const initHooks = () => {
	// warn("Init Hooks processing");
	// setup all the hooks
	Hooks.once("socketlib.ready", registerSocket);

	registerSocket();

	// Transition.registerSettings();
	// Transition.registerSockets();
};

export const setupHooks = () => {
	// warn("Setup Hooks processing");
	setApi(API);
};

export const readyHooks = async () => {
	// warn("Ready Hooks processing");
	$("body").on("click", ".play-transition", (e) => {
		let id = <string>$(e.target).parents(".journal-sheet").attr("id").split("-")[1];
		let journal = game.journal?.get(id)?.data;
		const content = retrieveFirstTextFromJournalId(id);
		const img = retrieveFirstImageFromJournalId(id);
		let options = {
			content: content,
			bgImg: img,
		};
		new SceneTransition(false, options).render();
		game.socket.emit("module.scene-transitions", options);
	});

	Hooks.on("closeTransitionForm", (form) => {
		let activeTransition = form.object;
		activeTransition.destroy(true);
		clearInterval(form.interval);
	});

	/********************
	 * Adds menu option to Scene Nav and Directory
	 *******************/

	//Credit to Winks' Everybody Look Here for the code to add menu option to Scene Nav
	Hooks.on("getSceneNavigationContext", (html, contextOptions) => {
		contextOptions.push(Transition.addPlayTransitionBtn("sceneId"));
		contextOptions.push(Transition.addCreateTransitionBtn("sceneId"));
		contextOptions.push(Transition.addEditTransitionBtn("sceneId"));
		contextOptions.push(Transition.addDeleteTransitionBtn("sceneId"));
	});

	Hooks.on("getSceneDirectoryEntryContext", (html, contextOptions) => {
		contextOptions.push(Transition.addPlayTransitionBtn("documentId"));
		contextOptions.push(Transition.addCreateTransitionBtn("documentId"));
		contextOptions.push(Transition.addEditTransitionBtn("documentId"));
		contextOptions.push(Transition.addDeleteTransitionBtn("documentId"));
	});

	Hooks.on("getJournalDirectoryEntryContext", (html, contextOptions) => {
		contextOptions.push(Transition.addPlayTransitionBtnJE("documentId"));
	});

	Hooks.on("renderJournalSheet", (journal) => {
		if (
			game.user.isGM &&
			$("#" + journal.id + " > header").find(".play-transition").length == 0 &&
			game.settings.get("scene-transitions", "show-journal-header-transition") == true
		) {
			$('<a class="play-transition"><i class="fas fa-play-circle"></i> Play as Transition</a>').insertAfter(
				"#" + journal.id + " > header > h4"
			);
		}
	});
};
