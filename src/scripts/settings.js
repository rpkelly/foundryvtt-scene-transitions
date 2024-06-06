import CONSTANTS from "./constants.js";
import DefaultOptionsForm from "./forms/default-options-form.js";

export function registerSettings() {
    game.settings.registerMenu(CONSTANTS.MODULE.ID, CONSTANTS.SETTING.DEFAULT_OPTIONS_MENU.KEY, {
        name: CONSTANTS.SETTING.DEFAULT_OPTIONS_MENU.NAME,
        hint: CONSTANTS.SETTING.DEFAULT_OPTIONS_MENU.HINT,
        label: CONSTANTS.SETTING.DEFAULT_OPTIONS_MENU.LABEL,
        icon: CONSTANTS.SETTING.DEFAULT_OPTIONS_MENU.ICON,
        type: DefaultOptionsForm,
        restricted: true,
    });

    game.settings.register(CONSTANTS.MODULE.ID, CONSTANTS.SETTING.DEFAULT_OPTIONS, {
        scope: "world",
        config: false,
        restricted: true,
        type: Object,
        default: CONSTANTS.DEFAULT_SETTING,
    });

    game.settings.register(CONSTANTS.MODULE.ID, CONSTANTS.SETTING.SHOW_JOURNAL_HEADER, {
        name: `${CONSTANTS.MODULE.ID}.setting.${CONSTANTS.SETTING.SHOW_JOURNAL_HEADER}.name`,
        hint: `${CONSTANTS.MODULE.ID}.setting.${CONSTANTS.SETTING.SHOW_JOURNAL_HEADER}.hint`,
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
    });

    game.settings.register(CONSTANTS.MODULE.ID, CONSTANTS.SETTING.DEBUG, {
        name: `${CONSTANTS.MODULE.ID}.setting.${CONSTANTS.SETTING.DEBUG}.name`,
        hint: `${CONSTANTS.MODULE.ID}.setting.${CONSTANTS.SETTING.DEBUG}.hint`,
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
    });
}
