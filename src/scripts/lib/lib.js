import CONSTANTS from "../constants.js";
// =============================
// Module specific function
// =============================

export function isRealNumber(inNumber) {
  return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
}

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

export function retrieveFirstImageFromJournalId(id, pageId, noDefault) {
  const journalEntry = game.journal.get(id);
  let firstImage = undefined;
  if (!journalEntry) {
    return firstImage;
  }
  // Support old data image
  // if (journalEntry?.data?.img) {
  // 	return stripQueryStringAndHashFromPath(journalEntry?.data?.img);
  // }
  // Support new image type journal
  if (journalEntry?.pages.size > 0) {
    const sortedArray = journalEntry.pages.contents.sort((a, b) => a.sort - b.sort);
    if (pageId) {
      const pageSelected = sortedArray.find((page) => page.id === pageId);
      if (pageSelected) {
        if (pageSelected.type === "image" && pageSelected.src) {
          firstImage = stripQueryStringAndHashFromPath(pageSelected.src);
        }
        // this should manage all MJE type
        else if (pageSelected.src) {
          firstImage = stripQueryStringAndHashFromPath(pageSelected.src);
        }
      }
    }
    // const shouldCheckForDefault = !noDefault && pageId?.length > 0;
    if (!noDefault && !firstImage) {
      for (const pageEntry of sortedArray) {
        if (pageEntry.type === "image" && pageEntry.src) {
          firstImage = stripQueryStringAndHashFromPath(pageEntry.src);
          break;
        } else if (pageEntry.src && pageEntry.type === "pdf") {
          firstImage = stripQueryStringAndHashFromPath(pageEntry.src);
          break;
        }
        // this should manage all MJE type
        else if (pageEntry.src) {
          firstImage = stripQueryStringAndHashFromPath(pageEntry.src);
          break;
        }
      }
    }
  }
  return firstImage;
}

export function retrieveFirstTextFromJournalId(id, pageId, noDefault) {
  const journalEntry = game.journal.get(id);
  let firstText = undefined;
  if (!journalEntry) {
    return firstText;
  }
  // Support old data image
  // if (journalEntry?.data?.img) {
  // 	return stripQueryStringAndHashFromPath(journalEntry?.data?.img);
  // }
  // Support new image type journal
  if (journalEntry?.pages.size > 0) {
    const sortedArray = journalEntry.pages.contents.sort((a, b) => a.sort - b.sort);
    if (pageId) {
      const pageSelected = sortedArray.find((page) => page.id === pageId);
      if (pageSelected) {
        if (pageSelected.type === "text" && pageSelected.text?.content) {
          firstText = pageSelected.text?.content;
        }
        // this should manage all MJE type
        else if (pageSelected.text?.content) {
          firstText = pageSelected.text?.content;
        }
      }
    }
    // const shouldCheckForDefault = !noDefault && pageId?.length > 0;
    if (!noDefault && !firstText) {
      for (const journalEntry of sortedArray) {
        if (journalEntry.type === "text" && journalEntry.text?.content) {
          firstText = journalEntry.text?.content;
          break;
        }
        // this should manage all MJE type
        else if (journalEntry.text?.content) {
          firstText = journalEntry.text?.content;
          break;
        }
      }
    }
  }
  return firstText;
}

export class SceneTransitionOptions {
  constructor(options) {
    this.action = options.action || "";
    this.sceneID = options.sceneID || "";
    this.gmHide = isBoolean(options.gmHide) ? options.gmHide : false;
    this.fontColor = options.fontColor || "#777777";
    this.fontSize = options.fontSize || "28px";
    this.bgImg = options.bgImg || "";
    this.bgPos = options.bgPos || "center center";
    this.bgLoop = isBoolean(options.bgLoop) ? options.bgLoop : false;
    this.bgMuted = isBoolean(options.bgMuted) ? options.bgMuted : true;
    this.bgSize = options.bgSize || "cover";
    this.bgColor = options.bgColor || "#000000";
    this.bgOpacity = options.bgOpacity || 0.7;
    this.fadeIn = options.fadeIn || 400;
    this.delay = options.delay || 4000;
    this.fadeOut = options.fadeOut || 1000;
    this.volume = options.volume || 1.0;
    this.audioLoop = isBoolean(options.audioLoop) ? options.audioLoop : true;
    this.skippable = isBoolean(options.skippable) ? options.skippable : true;
    this.gmEndAll = isBoolean(options.gmEndAll) ? options.gmEndAll : true;
    this.showUI = isBoolean(options.showUI) ? options.showUI : false;
    this.activateScene = isBoolean(options.activateScene) ? options.activateScene : false;
    this.content = options.content || "";
    this.audio = options.audio || "";
    this.fromSocket = isBoolean(options.fromSocket) ? options.fromSocket : false;
    this.users = options.users || [];
  }
}

export function isBoolean(value) {
  if (String(value) === "true" || String(value) === "false") {
    return true;
  } else {
    return false;
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
