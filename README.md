# RPG-Maker-MV-Achievements

RPG Maker MV Achievements allows you to create achievements in RPG Maker MV. 

__Achievements.json__

Place a file named Achievements.json under the data directory.

This file must be structured like that :

```js
[
  {
    "id": 1, // id of the achievement (must be a unique positive number)
    "name": "Achievement", // name of the achievement
    "description": "This is an achievement", // description of the achievement
    "lockedDescription": "This is a locked achievement", // description displayed when the achievement is still locked (optional)
    "img": "achievement_img" // name of the achievement image file without extension
  }
]
```

__Module settings__

_Achievements text_

The wording displayed in the menu. Default is "Achievements"

_Achievement unlocked text_

The text displayed when an achievement is unlocked. Default is "Achievement unlocked!"

_Achievement unlocked timer_

The time for "Achievement unlocked!" window to be displayed. Default is 180 frames (3 seconds).

_Achievement unlocked SE_

The Sound Effect to be played when "Achievement unlocked!" window is displayed. Default is "Item1". Will be played with following parameters : volume: 100, pitch: 100, pan: 0.

_Initial switch_

The switch number from where achievements switch will start. Default is 500. Achievements will be plugged on switch which id is "initial switch" + "achievement id". 

_Images directory_

Achievements images directory. Default is img/achievements.

_Locked image_

Image displayed on locked achievements. Default is "locked".


__Credits__

Feel free to use this script is commercial or non commercial games, but please give credits to Pivert somewhere in your game =)