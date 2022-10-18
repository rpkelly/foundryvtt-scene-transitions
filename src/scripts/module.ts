import { setApi } from "src/main";
import API from "./api";
import CONSTANTS from "./constants";
import { retrieveFirstImageFromJournalId, retrieveFirstTextFromJournalId, warn } from "./lib/lib";
import { SceneTransition } from "./scene-transitions";
import { SceneTransitionOptions } from "./scene-transitions-model";
import { registerSocket, sceneTransitionsSocket } from "./socket";

export const initHooks = () => {
	// warn("Init Hooks processing");
	// setup all the hooks
	Hooks.once("socketlib.ready", registerSocket);

	registerSocket();

	// SceneTransition.registerSettings();
	// SceneTransition.registerSockets();
};

export const setupHooks = () => {
	// warn("Setup Hooks processing");
	setApi(API);
};

export const readyHooks = async () => {
	// warn("Ready Hooks processing");
	$("body").on("click", ".play-transition", (e) => {
		let elements = <string[]>$(e.target).parents(".journal-sheet").attr("id")?.split("-");
		let id = <string>elements[1];
		let journal = game.journal?.get(id)?.data;
		if (!journal) {
			warn(`No journal is found`);
			return;
		}
		const content = retrieveFirstTextFromJournalId(id);
		const img = retrieveFirstImageFromJournalId(id);
		let options = new SceneTransitionOptions({
			content: content,
			bgImg: img,
		});
		new SceneTransition(false, options, undefined).render();
		// game.socket.emit("module.scene-transitions", options);
		sceneTransitionsSocket.executeForEveryone("executeAction", options);
	});

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
		contextOptions.push(<any>SceneTransition.addPlayTransitionBtn("sceneId"));
		contextOptions.push(<any>SceneTransition.addCreateTransitionBtn("sceneId"));
		contextOptions.push(<any>SceneTransition.addEditTransitionBtn("sceneId"));
		contextOptions.push(<any>SceneTransition.addDeleteTransitionBtn("sceneId"));
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
			game.settings.get("scene-transitions", "show-journal-header-transition") == true
		) {
			$('<a class="play-transition"><i class="fas fa-play-circle"></i> Play as Transition</a>').insertAfter(
				"#" + journal.id + " > header > h4"
			);
		}
	});
};
