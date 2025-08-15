const CONSTANTS = {
    MODULE: {
        ID: "scene-transitions",
        NAME: "Scene Transitions",
        PATH: "modules/scene-transitions/",
    },
    DEFAULT_SETTING: {
        sceneID: "",
        gmHide: false,
        fontColor: "#777777",
        fontSize: 28,
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
        allowPlayersToEnd: true,
        gmEndAll: true,
        showUI: false,
        activateScene: false,
        content: "",
        contentType: "text", // "text" or "rolltable"
        rollTableId: "",
        audio: "",
        fromSocket: false,
        users: [],
    },
    SETTING: {
        DEBUG: "debug",
        DEFAULT_OPTIONS_MENU: {
            KEY: "default-options-menu",
            NAME: "scene-transitions.setting.defaultOptionsMenu.name",
            HINT: "scene-transitions.setting.defaultOptionsMenu.hint",
            LABEL: "scene-transitions.setting.defaultOptionsMenu.label",
            ICON: "fas fa-gear",
        },
        DEFAULT_OPTIONS: "default-options",
        SHOW_JOURNAL_HEADER: "show-journal-header-transition",
        RESET: "resetAllSettings",
    },
    TEMPLATE: {
        EDIT_TRANSITION_FORM: "modules/scene-transitions/templates/edit-transition-form.hbs",
        SCENE_TRANSITION: "modules/scene-transitions/templates/scene-transition.hbs",
    },
};

export default CONSTANTS;
