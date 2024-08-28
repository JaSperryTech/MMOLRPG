// modules/Achievements.js
export default class Achievements {
  constructor(player) {
    this.player = player;
    this.achievements = {
      firstLevel: { unlocked: false, condition: () => this.player.level >= 2 },
      rich: { unlocked: false, condition: () => this.player.cols >= 1000 },
    };
  }

  checkAchievements() {
    Object.keys(this.achievements).forEach((key) => {
      const achievement = this.achievements[key];
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true;
        // Handle achievement unlocked (e.g., notify the player)
      }
    });
  }
}
