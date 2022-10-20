# Scene Transitions

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/foundryvtt-scene-transitions/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) 

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fscene-transitions&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=scene-transitions) 

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-scene-transitions%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-scene-transitions%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fscene-transitions%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/scene-transitions/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/foundryvtt-scene-transitions/total?style=for-the-badge)

[![Translation status](https://weblate.foundryvtt-hub.com/widgets/scene-transitions/-/287x66-black.png)](https://weblate.foundryvtt-hub.com/engage/scene-transitions/)

### If you want to buy me a coffee [![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d?style=for-the-badge)](https://www.patreon.com/p4535992)

Allows GM to make simple transitions to show players before navigating to new screen. Can be used for narrative effect. Can now be used with macros to create transitionless Transitions. And journal entries can now be used to generate a Transition.

## NOTE: If you are a javascript developer and not a typescript developer, you can just use the javascript files under the dist folder


## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/foundryvtt-scene-transitions/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### libwrapper

This module uses the [libwrapper](https://github.com/ruipin/fvtt-lib-wrapper) library like a dependency. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

### socketLib

This module uses the [socketLib](https://github.com/manuelVo/foundryvtt-socketlib) library like a dependency. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.


## Known Issue\Limitation

## Feature


## Api

```javascript
/**
 * Transition.macro(options, showMe)
 */
game.modules.get('scene-transitions').api.macro({
	sceneID: false,
	content:"TEST MACRO",
	fontColor:'#ffffff',
	fontSize:'28px',
	bgImg:'', // pass any relative or absolute image url here.
	bgPos:'center center',
	bgSize:'cover',
	bgColor:'#333333',
	bgOpacity:0.7,
	fadeIn: 400, //how long to fade in
	delay:5000, //how long for transition to stay up
	fadeOut: 400, //how long to fade out
	audio: "", //path to audio file
	skippable:true, //Allows players to skip transition with a click before delay runs out.
	gmHide: true, // hide the transistion on other windows logged in as a GM
	gmEndAll: true, // when the GM clicks to end the transition - end for everyone
	showUI: false, // Show the User Interface elements to all players allowing them to interact with character sheets etc

}, true ) //show to the triggering user
```
To play a transition without a scene activation, simple pass `false` as the sceneID in the data object.


## [Changelog](./CHANGELOG.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-scene-transitions/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

