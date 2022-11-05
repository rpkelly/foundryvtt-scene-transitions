import CONSTANTS from "../constants.js";
// =============================
// Module Generic function
// =============================
export async function getToken(documentUuid) {
	const document = await fromUuid(documentUuid);
	//@ts-ignore
	return document?.token ?? document;
}
export function getOwnedTokens(priorityToControlledIfGM) {
	const gm = game.user?.isGM;
	if (gm) {
		if (priorityToControlledIfGM) {
			const arr = canvas.tokens?.controlled;
			if (arr && arr.length > 0) {
				return arr;
			} else {
				return canvas.tokens?.placeables;
			}
		} else {
			return canvas.tokens?.placeables;
		}
	}
	if (priorityToControlledIfGM) {
		const arr = canvas.tokens?.controlled;
		if (arr && arr.length > 0) {
			return arr;
		}
	}
	let ownedTokens = canvas.tokens?.placeables.filter((token) => token.isOwner && (!token.document.hidden || gm));
	if (ownedTokens.length === 0 || !canvas.tokens?.controlled[0]) {
		ownedTokens = canvas.tokens?.placeables.filter(
			(token) => (token.observer || token.isOwner) && (!token.document.hidden || gm)
		);
	}
	return ownedTokens;
}
export function is_UUID(inId) {
	return typeof inId === "string" && (inId.match(/\./g) || []).length && !inId.endsWith(".");
}
export function getUuid(target) {
	// If it's an actor, get its TokenDocument
	// If it's a token, get its Document
	// If it's a TokenDocument, just use it
	// Otherwise fail
	const document = getDocument(target);
	return document?.uuid ?? false;
}
export function getDocument(target) {
	if (target instanceof foundry.abstract.Document) return target;
	return target?.document;
}
export function is_real_number(inNumber) {
	return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
}
export function isGMConnected() {
	return !!Array.from(game.users).find((user) => user.isGM && user.active);
}
export function isGMConnectedAndSocketLibEnable() {
	return isGMConnected(); // && !game.settings.get(CONSTANTS.MODULE_NAME, 'doNotUseSocketLibFeature');
}
export function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export function isActiveGM(user) {
	return user.active && user.isGM;
}
export function getActiveGMs() {
	return game.users?.filter(isActiveGM);
}
export function isResponsibleGM() {
	if (!game.user?.isGM) return false;
	//@ts-ignore
	return !getActiveGMs()?.some((other) => other._id < game.user?._id);
}
export function firstGM() {
	return game.users?.find((u) => u.isGM && u.active);
}
export function isFirstGM() {
	return game.user?.id === firstGM()?.id;
}
export function firstOwner(doc) {
	/* null docs could mean an empty lookup, null docs are not owned by anyone */
	if (!doc) return undefined;
	const permissionObject = (doc instanceof TokenDocument ? doc.actor?.permission : doc.permission) ?? {};
	const playerOwners = Object.entries(permissionObject)
		.filter(([id, level]) => !game.users?.get(id)?.isGM && game.users?.get(id)?.active && level === 3)
		.map(([id, level]) => id);
	if (playerOwners.length > 0) {
		return game.users?.get(playerOwners[0]);
	}
	/* if no online player owns this actor, fall back to first GM */
	return firstGM();
}
/* Players first, then GM */
export function isFirstOwner(doc) {
	return game.user?.id === firstOwner(doc)?.id;
}
// ================================
// Logger utility
// ================================
// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3
export function debug(msg, args = "") {
	if (game.settings.get(CONSTANTS.MODULE_NAME, "debug")) {
		console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args);
	}
	return msg;
}
export function log(message) {
	message = `${CONSTANTS.MODULE_NAME} | ${message}`;
	console.log(message.replace("<br>", "\n"));
	return message;
}
export function notify(message) {
	message = `${CONSTANTS.MODULE_NAME} | ${message}`;
	ui.notifications?.notify(message);
	console.log(message.replace("<br>", "\n"));
	return message;
}
export function info(info, notify = false) {
	info = `${CONSTANTS.MODULE_NAME} | ${info}`;
	if (notify) ui.notifications?.info(info);
	console.log(info.replace("<br>", "\n"));
	return info;
}
export function warn(warning, notify = false) {
	warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
	if (notify) ui.notifications?.warn(warning);
	console.warn(warning.replace("<br>", "\n"));
	return warning;
}
export function error(error, notify = true) {
	error = `${CONSTANTS.MODULE_NAME} | ${error}`;
	if (notify) ui.notifications?.error(error);
	return new Error(error.replace("<br>", "\n"));
}
export function timelog(message) {
	warn(Date.now(), message);
}
export const i18n = (key) => {
	return game.i18n.localize(key)?.trim();
};
export const i18nFormat = (key, data = {}) => {
	return game.i18n.format(key, data)?.trim();
};
// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };
export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
	return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_NAME}</strong>
        <br><br>${message}
    </p>`;
}
// =============================
// Module specific function
// =============================
export function stripQueryStringAndHashFromPath(url) {
	let myUrl = url;
	if (!myUrl) {
		return myUrl;
	}
	if (myUrl.includes("?")) {
		myUrl = myUrl.split("?")[0];
	}
	if (myUrl.includes("#")) {
		myUrl = myUrl.split("#")[0];
	}
	return myUrl;
}
export function retrieveFirstImageFromJournalId(id) {
	const journalEntry = game.journal?.get(id);
	let firstImage = undefined;
	if (!journalEntry) {
		return firstImage;
	}
	// Support old data image
	// if (journalEntry?.data?.img) {
	// 	return stripQueryStringAndHashFromPath(journalEntry?.data?.img);
	// }
	// Support new image type journal
	//@ts-ignore
	if (journalEntry?.pages.size > 0) {
		//@ts-ignore
		const sortedArray = journalEntry.pages.contents.sort((a, b) => a.sort - b.sort);
		for (const journalEntry of sortedArray) {
			if (journalEntry.type === "image" && journalEntry.src) {
				firstImage = stripQueryStringAndHashFromPath(journalEntry.src);
				break;
			}
		}
	}
	return firstImage;
}
export function retrieveFirstTextFromJournalId(id) {
	const journalEntry = game.journal?.get(id);
	let firstText = undefined;
	if (!journalEntry) {
		return firstText;
	}
	// Support old data image
	// if (journalEntry?.data?.img) {
	// 	return stripQueryStringAndHashFromPath(journalEntry?.data?.img);
	// }
	// Support new image type journal
	//@ts-ignore
	if (journalEntry?.pages.size > 0) {
		//@ts-ignore
		const sortedArray = journalEntry.pages.contents.sort((a, b) => a.sort - b.sort);
		for (const journalEntry of sortedArray) {
			if (journalEntry.type === "text" && journalEntry.text?.content) {
				firstText = journalEntry.text?.content;
				break;
			}
		}
	}
	return firstText;
}
export class SceneTransitionOptions {
	constructor(options) {
		this.action = "";
		this.sceneID = "";
		this.gmHide = true;
		this.fontColor = "#777777";
		this.fontSize = "28px";
		this.bgImg = "";
		this.bgPos = "center center";
		this.bgSize = "cover";
		this.bgColor = "#000000";
		this.bgOpacity = 0.7;
		this.fadeIn = 400;
		this.delay = 4000;
		this.fadeOut = 1000;
		this.volume = 1.0;
		this.skippable = true;
		this.gmEndAll = true;
		this.showUI = false;
		this.content = "";
		this.fromSocket = false;
		this.users = [];
		this.action = options.action || "";
		this.sceneID = options.sceneID || "";
		this.gmHide = options.gmHide || true;
		this.fontColor = options.fontColor || "#777777";
		this.fontSize = options.fontSize || "28px";
		this.bgImg = options.bgImg || "";
		this.bgPos = options.bgPos || "center center";
		this.bgSize = options.bgSize || "cover";
		this.bgColor = options.bgColor || "#000000";
		this.bgOpacity = options.bgOpacity || 0.7;
		this.fadeIn = options.fadeIn || 400;
		this.delay = options.delay || 4000;
		this.fadeOut = options.fadeOut || 1000;
		this.volume = options.volume || 1.0;
		this.skippable = options.skippable || true;
		this.gmEndAll = options.gmEndAll || true;
		this.showUI = options.showUI || false;
		this.content = options.content || "";
		this.audio = options.audio || "";
		this.fromSocket = options.fromSocket || false;
		this.users = options.users || [];
	}
}

export function isVideo(imgSrc) {
	const re = /(?:\.([^.]+))?$/;
	const ext = re.exec(imgSrc)?.[1];
	return ext === "webm" || ext === "mp4";
}

export function getVideoType(imgSrc) {
	if (imgSrc.endsWith("webm")) {
		return "video/webm";
	} else if (imgSrc.endsWith("mp4")) {
		return "video/mp4";
	}
	return "video/mp4";
}
