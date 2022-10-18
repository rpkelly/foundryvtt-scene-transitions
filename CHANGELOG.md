# Changelog
### 0.3.0
Support Foundry V9 - thanks pchouzenoux!

### 0.2.1  
Added Show User Interface (showUI) option to show the user interface to players during the transition
UI always shows for the GM

### 0.1.3  
Fix z-index on the editor form! ugh  

### 0.1.2  
Fix z-index so transition sits on top of everything

### 0.1.1
New helper for macros - Transition.macro(options, showMe)  
Use new WebAudio API for sound (0.8.2+)  
Added option to hide transition on other GM broswer windows (default true)
Added option to end the transition when the GM ends iy (deafult true)
Refactor to clean up global namespace  
Refactor sceneID to be part of options object for simplictity
FVTT 0.8.2+ compatability  

### 0.0.9
Play as Transition from Journal top bar can be hidden in the module settings  
Set initial volume of the audio file

### 0.0.8
0.8 Compatability. Minor fixes and clean up

### 0.0.7
0.7.5 Fix. Pull Request merge to fade out audio.
  
  
Full credit to @WillS for the orgianl idea and developent of Scene Transitions:  
### 0.0.6
You can now create and send a transition to all players using a macro. There is now a 'Play as Transition' option on the context menu for Journal Entries and it's sheet header. This takes the content and image from the journal and makes a transition out of it with the default settings.

### 0.0.5
Background size and positioning is now configurable.

### 0.0.4
Fixed some bugs.

### 0.0.3
Hotfix: Socket emit transition did not have preview mode set.

### 0.0.2
Removed preview from form window and instead create live preview transition in the background.

### 0.0.1
Alpha Release
Click Create Transition on scene context menu. Add text, audio, and background image. Set length to show players and whether you want players to be able to close it.
