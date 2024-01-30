/**
 * Reusable utility functions
 */
export class Utils {
  /**
   * Convert seconds into milliseconds
   * @param {number} seconds The seconds
   * @returns {number}       The milliseconds
   */
  static convertSecondsToMilliseconds(seconds) {
    if (!seconds) return 0;
    return seconds * 1000;
  }
  /**
   * Get the first image source from a journal page
   * @param {object} page The page
   * @returns {string}    The image source
   */
  static getFirstImageFromPage(page) {
    const content = page?.text?.content;
    if (!content) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const src = doc.querySelector("img").getAttribute("src");
    return src || null;
  }

  /**
   * Get text including HTML tags from a journal page
   * @param {object} page The page
   * @returns {string}    The text
   */
  static getTextFromPage(page) {
    const content = page?.text?.content;
    if (!content) return null;
    const textTags = ["BLOCKQUOTE", "CODE", "H1", "H2", "H3", "H4", "H5", "H6", "P"];
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const tags = Array.from(doc.body.children);
    const filteredTags = tags.filter((tag) => textTags.includes(tag.tagName));
    const text = filteredTags.map((tag) => tag.outerHTML).join("");
    return text || null;
  }

  /**
   * Preload video metadata
   * @param {string} src The video source
   * @returns {object}   The video
   */
  static preloadVideoMetadata(src) {
    return new Promise((resolve, reject) => {
      try {
        const video = document.createElement("video");
        video.setAttribute("src", src);
        video.preload = "metadata";

        video.onloadedmetadata = function () {
          resolve(this);
        };

        video.onerror = function () {
          reject("Invalid video. Please select a video file.");
        };

        return video;
      } catch (e) {
        reject(e);
      }
    });
  }
}
