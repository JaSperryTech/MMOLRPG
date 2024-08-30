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
    Object.entries(this.achievements).forEach(([key, achievement]) => {
      // Skip already unlocked achievements
      if (achievement.unlocked) return;

      // Check if condition is a function and evaluate it
      if (typeof achievement.condition === "function") {
        if (achievement.condition(this.player)) {
          achievement.unlocked = true;
          this.notifyAchievementUnlocked(key); // Notify when unlocked
        }
      } else {
        console.error("Achievement condition is not a function:", achievement);
      }
    });
  }

  notifyAchievementUnlocked(achievementKey) {
    // Notify the player (you can customize this as needed)
    alert(`Achievement Unlocked: ${achievementKey}`);
    // You might also update the achievements UI
  }
}
