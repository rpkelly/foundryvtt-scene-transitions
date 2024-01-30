import { CONSTANTS } from "./constants.js";
import "./lib/lib.js";

export const registerSettings = function () {
  game.settings.registerMenu(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.RESET, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.RESET}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.RESET}.hint`,
    icon: "fas fa-coins",
    type: ResetSettingsDialog,
    restricted: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.SHOW_JOURNAL_HEADER, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.SHOW_JOURNAL_HEADER}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.SHOW_JOURNAL_HEADER}.hint`,
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.SETTINGS.DEBUG, {
    name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.DEBUG}.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.DEBUG}.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
  });

  const settings = defaultSettings();
  for (const [name, data] of Object.entries(settings)) {
    game.settings.register(CONSTANTS.MODULE_ID, name, data);
  }
  // for (const [name, data] of Object.entries(otherSettings)) {
  //     game.settings.register(CONSTANTS.MODULE_ID, name, data);
  // }
};

class ResetSettingsDialog extends FormApplication {
  constructor(...args) {
    //@ts-ignore
    super(...args);
    //@ts-ignore
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.title`),
      content:
        '<p style="margin-bottom:1rem;">' +
        game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.content`) +
        "</p>",
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.confirm`),
          callback: async () => {
            await applyDefaultSettings();
            window.location.reload();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.cancel`),
        },
      },
      default: "cancel",
    });
  }
  async _updateObject(event, formData) {
    // do nothing
  }
}

async function applyDefaultSettings() {
  const settings = defaultSettings(true);
  // for (const [settingName, settingValue] of Object.entries(settings)) {
  //   await game.settings.set(CONSTANTS.MODULE_ID, settingName, settingValue.default);
  // }
  const settings2 = otherSettings(true);
  for (const [settingName, settingValue] of Object.entries(settings2)) {
    //@ts-ignore
    await game.settings.set(CONSTANTS.MODULE_ID, settingName, settingValue.default);
  }
}

function defaultSettings(apply = false) {
  return {
    //
  };
}

function otherSettings(apply = false) {
  return {
    "show-journal-header-transition": {
      name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.SHOW_JOURNAL_HEADER}.name`,
      hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.SHOW_JOURNAL_HEADER}.hint`,
      scope: "world",
      config: true,
      type: Boolean,
      default: true,
    },
    debug: {
      name: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.DEBUG}.name`,
      hint: `${CONSTANTS.MODULE_ID}.setting.${CONSTANTS.SETTINGS.DEBUG}.hint`,
      scope: "client",
      config: true,
      default: false,
      type: Boolean,
    },
  };
}
