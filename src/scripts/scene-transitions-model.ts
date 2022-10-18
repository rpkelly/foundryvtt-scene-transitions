export class SceneTransitionOptions {
	action: string = "";
	sceneID: string = "";
	gmHide: boolean = true;
	fontColor: string = "#777777";
	fontSize: string = "28px";
	bgImg: string = "";
	bgPos: string = "center center";
	bgSize: string = "cover";
	bgColor: string = "#000000";
	bgOpacity: number = 0.7;
	fadeIn: number = 400;
	delay: number = 4000;
	fadeOut: number = 1000;
	volume: number = 1.0;
	skippable: boolean = true;
	gmEndAll: boolean = true;
	showUI: boolean = false;
	content: string = "";
	audio: string;
	fromSocket: boolean = false;
	users: string[] = [];

	constructor(options) {
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
		this.users = options.users || <string[]>[];
	}
}
