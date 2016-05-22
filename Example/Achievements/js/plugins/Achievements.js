/*jslint vars: true, nomen: true, plusplus: true, eqeq: true */
/*globals console, PluginManager, Game_Interpreter, Window_Base, $gameSwitches, Window_MenuCommand, Scene_Map, Scene_Menu, SceneManager, Scene_MenuBase, Window_Selectable, Graphics, Bitmap, ImageManager, AudioManager*/
//=============================================================================
// Menu.js
//=============================================================================

/*:
 * @plugindesc Pivert Achievements system.
 * @author Pivert
 *
 * @param -- Achievements --
 *
 * @param Achievements text
 * @desc The text for "Achievements".
 * @default Achievements
 *
 * @param Achievement unlocked text
 * @desc The text for "Achievement unlocked".
 * @default Achievement unlocked!
 *
 * @param Achievement unlocked timer
 * @desc Time for "Achievement unlocked!" window to be displayed (in frames).
 * @default 180
 *
 * @param Achievement unlocked SE
 * @desc Sound effect to be played when "Achievement unlocked!" window is displayed.
 * @default Item1
 *
 * @param -- Settings --
 *
 * @param Initial switch
 * @desc The first switch to be used for achievements.
 * @default 500
 *
 * @param Images directory
 * @desc The directory where achievements images are stored
 * @default img/achievements
 *
 * @param Locked image
 * @desc Name of the image which should be used for locked achievements.
 * @default locked
 *
 * @help
 *
 * To create an achievements list, create a file named "Achievements.json" in data directory
 * and give it the following structure :
 *
 * [
 *    {
 *      "id": < id of the achievement. Must be a unique number. Must be positive. >,
 *      "name": < name of the achievement. Must be between "". >,
 *      "description": < description of the achievement. Must be between "". >,
 *      "lockedDescription": < description displayed when the achievement is still locked. Must be between "". >,
 *      "img": < name of the achievement image file without extension. Must be between "". >
 *    }
 * ]
 *
 * Plugin Command:
 *   Achievements unlock 1     # Unlock achievements which id is 1
 */

(function () {

    "use strict";

    var parameters = PluginManager.parameters('Achievements');
    var achievementsText = String(parameters['Achievements text'] || 'Achievements');
    var achievementUnlockedtext = String(parameters['Achievement unlocked text'] || 'Achievement unlocked!');
    var achievementUnlockedTimer = Number(parameters['Achievement unlocked timer'] || 180);
    var achievementUnlockedSe = String(parameters['Achievement unlocked SE'] || 'Item1');
    var lockedImage = String(parameters['Locked image'] || 'locked');
    var imageDirectory = String(parameters['Images directory'] || 'img/achievements');
    var initialSwitch = Number(parameters['Initial switch'] || 500);

    var startAchievements = function (achievements, lockedBitmap, text, timer) {

        var _Window_AchievementUnlocked = null;

        /*
         * Achievement unlocked window
         */
        function Window_AchievementUnlocked() {
            this.initialize.apply(this, arguments);
        }

        Window_AchievementUnlocked.prototype = Object.create(Window_Base.prototype);
        Window_AchievementUnlocked.prototype.constructor = Window_AchievementUnlocked;

        Window_AchievementUnlocked.prototype.initialize = function () {
            this.timer = timer;
            this.text = text;
            this.achievementsQueue = [];
            var w = Graphics.boxWidth / 2;
            var h = this.fittingHeight(2);
            var x = Graphics.boxWidth - w;
            var y = -h - 5;
            Window_Base.prototype.initialize.call(this, x, y, w, h);
            this.hide();
        };

        Window_AchievementUnlocked.prototype.update = function () {
            if (this.isHiding) {
                if (this.y > -this.height - 5) {
                    this.y -= 1;
                } else {
                    this.hidden = true;
                    this.timer = timer;
                }
            } else {
                if (this.y < 0) {
                    this.y += 5;
                } else {
                    this.hidden = false;
                }
            }
            if (this.timer <= 0) {
                this.achievement = undefined;
                this.hide();
            } else {
                this.timer--;
            }
            if (this.hidden && this.achievementsQueue.length) {
                this.refresh();
                this.show();
            }
        };

        Window_AchievementUnlocked.prototype.show = function () {
            this.isHiding = false;
        };

        Window_AchievementUnlocked.prototype.hide = function () {
            this.isHiding = true;
        };

        Window_AchievementUnlocked.prototype.setAchievement = function (achievement) {
            this.achievementsQueue.push(achievement);
            this.refresh();
        };

        Window_AchievementUnlocked.prototype.refresh = function () {
            if (this.achievement) {
                return;
            }

            this.achievement = this.achievementsQueue.pop();

            if (!this.achievement) {
                return;
            }

            this.contents.clear();

            AudioManager.playSe({
                name: achievementUnlockedSe,
                volume: 100,
                pitch: 100,
                pan: 0
            });

            this.drawText(achievementUnlockedtext, 0, 0);
            this.drawText(this.achievement.name, 0, this.lineHeight() + this.textPadding());
            this.resetFontSettings();
        };

        /*
         * Achievements Window
         */
        function Window_AchievementsList() {
            this.initialize.apply(this, arguments);
        }

        Window_AchievementsList.prototype = Object.create(Window_Selectable.prototype);
        Window_AchievementsList.prototype.constructor = Window_AchievementsList;

        Window_AchievementsList.lastTopRow = 0;
        Window_AchievementsList.lastIndex = 0;

        Window_AchievementsList.prototype.initialize = function (x, y) {
            var width = Graphics.boxWidth;
            var height = this.fittingHeight(3);
            Window_Selectable.prototype.initialize.call(this, x, y, width, height);
            this.refresh();
            this.setTopRow(Window_AchievementsList.lastTopRow);
            this.select(Window_AchievementsList.lastIndex);
            this.activate();
        };

        Window_AchievementsList.prototype.lineHeight = function () {
            return 120;
        };

        Window_AchievementsList.prototype.maxCols = function () {
            return 6;
        };

        Window_AchievementsList.prototype.maxItems = function () {
            return this._list ? this._list.length : 0;
        };

        Window_AchievementsList.prototype.setDetailsWindow = function (detailsWindow) {
            this._detailsWindow = detailsWindow;
            this.updateDetails();
        };

        Window_AchievementsList.prototype.update = function () {
            Window_Selectable.prototype.update.call(this);
            this.updateDetails();
        };

        Window_AchievementsList.prototype.updateDetails = function () {
            if (this._detailsWindow) {
                var item = this._list[this.index()];
                this._detailsWindow.setItem(item);
            }
        };

        Window_AchievementsList.prototype.refresh = function () {
            var id;
            this._list = [];
            for (id in achievements) {
                if (achievements.hasOwnProperty(id)) {
                    this._list.push(achievements[id]);
                }
            }

            this._list.sort(function (a1, a2) {
                return a1.id > a2.id ? 1 : -1;
            });

            this.createContents();
            this.drawAllItems();
        };

        Window_AchievementsList.prototype.drawItem = function (index) {
            var item = this._list[index];
            var rect = this.itemRect(index);
            var width = rect.width - this.textPadding();
            this.drawAchievement(item, rect.x + 8, rect.y + 8, width);
        };

        Window_AchievementsList.prototype.drawAchievement = function (item, x, y) {
            if ($gameSwitches.value(item.id + initialSwitch)) {
                this.contents.blt(item.bitmap, 0, 0, item.bitmap.width, item.bitmap.height, x, y);
            } else {
                this.contents.blt(lockedBitmap, 0, 0, item.bitmap.width, item.bitmap.height, x, y);
            }
        };

        Window_AchievementsList.prototype.processCancel = function () {
            Window_Selectable.prototype.processCancel.call(this);
            Window_AchievementsList.lastTopRow = this.topRow();
            Window_AchievementsList.lastIndex = this.index();
        };

        function Window_AchievementsDetails() {
            this.initialize.apply(this, arguments);
        }

        Window_AchievementsDetails.prototype = Object.create(Window_Base.prototype);
        Window_AchievementsDetails.prototype.constructor = Window_AchievementsDetails;

        Window_AchievementsDetails.prototype.initialize = function (x, y, width, height) {
            Window_Base.prototype.initialize.call(this, x, y, width, height);
        };

        Window_AchievementsDetails.prototype.setItem = function (item) {
            if (this._item !== item) {
                this._item = item;
                this.refresh();
            }
        };

        Window_AchievementsDetails.prototype.refresh = function () {
            var item = this._item;
            var x = 0;
            var y = 0;
            var lineHeight = this.lineHeight();

            this.contents.clear();

            if (!item) {
                return;
            }

            if ($gameSwitches.value(item.id + initialSwitch)) {
                this.contents.blt(item.bitmap, 0, 0, item.bitmap.width, item.bitmap.height, 10, 10);
                this.changeTextColor(this.systemColor());
                this.drawText(item.name, 10 + 120 + 10, 10);
                this.resetTextColor();
                this.drawText(item.description, 10 + 120 + 10, 10 + lineHeight + this.textPadding());
            } else {
                this.contents.blt(lockedBitmap, 0, 0, item.bitmap.width, item.bitmap.height, 10, 10);
                this.changeTextColor(this.crisisColor());
                this.drawText(item.name, 10 + 120 + 10, 10);
                this.resetTextColor();
                this.drawText(item.lockedDescription, 10 + 120 + 10, 10 + lineHeight + this.textPadding());
            }
        };

        /*
         * Achievements Scene
         */
        function Scene_Achievements() {
            this.initialize.apply(this, arguments);
        }

        Scene_Achievements.prototype = Object.create(Scene_MenuBase.prototype);
        Scene_Achievements.prototype.constructor = Scene_Achievements;

        Scene_Achievements.prototype.initialize = function () {
            Scene_MenuBase.prototype.initialize.call(this);
        };

        Scene_Achievements.prototype.create = function () {
            Scene_MenuBase.prototype.create.call(this);
            this._listWindow = new Window_AchievementsList(0, 0);
            this._listWindow.setHandler('cancel', this.popScene.bind(this));

            var y = this._listWindow.height;
            var w = Graphics.boxWidth;
            var h = Graphics.boxHeight - y;
            this._detailsWindow = new Window_AchievementsDetails(0, y, w, h);

            this.addWindow(this._listWindow);
            this.addWindow(this._detailsWindow);

            this._listWindow.setDetailsWindow(this._detailsWindow);
        };

        var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function (command, args) {
            _Game_Interpreter_pluginCommand.call(this, command, args);
            if (command === 'Achievements') {
                if (args[0] == 'unlock') {
                    var id = +args[1];
                    if (!$gameSwitches.value(id + initialSwitch)) {
                        $gameSwitches.setValue(id + initialSwitch, true);
                        _Window_AchievementUnlocked.setAchievement(achievements[id]);
                        _Window_AchievementUnlocked.show();
                    }
                } else {
                    console.error('Wrong command argument : ' + args[0]);
                }
            }
        };

        var achievements_map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
        Scene_Map.prototype.createDisplayObjects = function () {
            achievements_map_createDisplayObjects.call(this);
            this.createWindowPop();
        };

        Scene_Map.prototype.createWindowPop = function () {
            _Window_AchievementUnlocked = new Window_AchievementUnlocked();
            this.addChild(_Window_AchievementUnlocked);
        };

        Window_MenuCommand.prototype.addOriginalCommands = function () {
            this.addCommand(achievementsText, 'achievements', true);
        };

        var achievements_menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            achievements_menu_createCommandWindow.call(this);
            this._commandWindow.setHandler('achievements', this.commandLoad.bind(this));
            this.addWindow(this._commandWindow);
        };

        Scene_Menu.prototype.commandLoad = function () {
            SceneManager.push(Scene_Achievements);
        };
    };

    var loadAchievements = function () {

        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        xhr.open('GET', 'data/Achievements.json');
        xhr.onload = function () {
            if (xhr.status < 400) {
                try {
                    var achievements = {};
                    var achievementsArray = JSON.parse(xhr.responseText);

                    var i;
                    for (i = 0; i < achievementsArray.length; i++) {
                        var achievement = achievementsArray[i];
                        var bitmap = ImageManager.loadBitmap(imageDirectory + '/', achievement.img);
                        achievements[achievement.id] = achievement;
                        achievements[achievement.id].bitmap = bitmap;
                        achievements[achievement.id].lockedDescription = achievements[achievement.id].lockedDescription || achievements[achievement.id].description;
                    }

                    var locked = ImageManager.loadBitmap(imageDirectory + '/', lockedImage);

                    startAchievements(achievements, locked, achievementUnlockedtext, achievementUnlockedTimer);
                } catch (e) {
                    console.error('Could not load script');
                    console.error(e);
                }
            } else {
                console.error('File data/Achievements.json not found');
            }
        };

        xhr.onerror = function (e) {
            console.error('Error while fetching data/Achievements.json');
            console.error(e);
        };

        xhr.send();
    };

    loadAchievements();

}());
