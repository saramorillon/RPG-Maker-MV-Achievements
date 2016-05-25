# RPG-Maker-MV-Achievements

RPG Maker MV Achievements allows you to create achievements in RPG Maker MV.

# Usage

To unlock an achievement, activate the associated switch or set the correct value to the associated variable.

![Achievement unlocked](https://raw.githubusercontent.com/PicusViridis/RPG-Maker-MV-Achievements/master/Screenshots/Achievement%20unlocked!.png)

Achievements images must be png files, 104*104 px.

# Achievements.json

Place a file named Achievements.json under the data directory. Achievements.json must use UTF-8 encoding (you can change encoding when you save it with notepad.exe).

This file must be structured like that :

```json
[
  {
    "id": 1,
    "name": "Achievement",
    "description": "This is an achievement",
    "lockedDescription": "This is a locked achievement",
    "img": "achievement_img",
	"steps":  10,
	"lockedSteps": "??",
	"lockedColor": 0,
	"unlockedColor": 0
  }
]
```

_If you need documentation about json files structure, please refer to : http://www.w3schools.com/json/_

_If you need to validate your json file (i.e. check that its structure is correct), you can use : https://jsonformatter.curiousconcept.com/_

__id__

Id of the switch which will store the achievement.

__name__

Name of the achievement.

__description__

Description of the achievement.

__lockedDescription__

Description displayed when the achievement is still locked (optional).

__img__

Name of the achievement image file without extension.

__steps__

Steps to unlock the achievement (optional). If set, id will use a variable instead of a switch.

__lockedSteps__

Text displayed instead of steps for locked achievements (optional).

__lockedColor__

Color number of the name of the achievement when it is locked (optional). If set, override the "Locked ach. name color" option.

__unlockedColor__

Color number of the name of the achievement when it is unlocked (optional). If set, override the "Unlocked ach. name color" option.

# Module settings

__Achievements text__

The wording displayed in the menu. Default is "Achievements".

__Ach. unlocked text__

The text displayed when an achievement is unlocked. Default is "Achievement unlocked!"

__Ach. unlocked timer__

The time for "Achievement unlocked!" window to be displayed. Default is 180 frames (3 seconds).

__Ach. unlocked SE__

The Sound Effect to be played when "Achievement unlocked!" window is displayed. Default is "Item1". Will be played with following parameters : volume: 100, pitch: 100, pan: 0.

__Ach. unlocked width__

The width of "Achievement unlocked!" window. Default is 480.

__Ach. unlocked X position__

The X position of "Achievement unlocked!" window. Default is 0.

__Ach. unlocked Y position__

The Y position of "Achievement unlocked!" window. Default is 0.

__Locked ach. name color__

The color of the name of locked achievements in achievements window. Default is 0.

__Unlocked ach. name color__

The color of the name of unlocked achievements in achievements window. Default is 0.

__Images directory__

Achievements images directory. Default is img/achievements.

__Locked image__

Image displayed on locked achievements. Default is "locked".

__Ach. unlocked skin__

Skin to be used for "Achievement unlocked!" window. Default is "default" and uses the default skin.


# Credits

Feel free to use this script is commercial or non commercial games, but please give credits to Pivert somewhere in your game =)