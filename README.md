# RPG-Maker-MV-Achievements

RPG Maker MV Achievements allows you to create achievements in RPG Maker MV.

# Usage

To unlock an achievement, simply use the following module command in an event : 
```
Achievements unlock <achievement id>
```

![Achievement unlocked](https://raw.githubusercontent.com/PicusViridis/RPG-Maker-MV-Achievements/master/Screenshots/Achievement%20unlocked!.png)

# Achievements.json

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

# Module settings

__Achievements text__

The wording displayed in the menu. Default is "Achievements"

__Achievement unlocked text__

The text displayed when an achievement is unlocked. Default is "Achievement unlocked!"

__Achievement unlocked timer__

The time for "Achievement unlocked!" window to be displayed. Default is 180 frames (3 seconds).

__Achievement unlocked SE__

The Sound Effect to be played when "Achievement unlocked!" window is displayed. Default is "Item1". Will be played with following parameters : volume: 100, pitch: 100, pan: 0.

__Initial switch__

The switch number from where achievements switch will start. Default is 500. Achievements will be plugged on switch which id is "initial switch" + "achievement id". 

__Images directory__

Achievements images directory. Default is img/achievements.

__Locked image__

Image displayed on locked achievements. Default is "locked".


# Credits

Feel free to use this script is commercial or non commercial games, but please give credits to Pivert somewhere in your game =)