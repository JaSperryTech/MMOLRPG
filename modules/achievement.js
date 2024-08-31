// In Achievements.js
export default class Achievements {
  constructor(player) {
    this.player = player;
    this.achievements = {
      firstKill: {
        name: "First Kill",
        description: "Defeat your first monster.",
        unlocked: false,
      },
      firstRebirth: {
        name: "First Rebirth",
        description: "Rebirth for the first time.",
        unlocked: false,
      },
      // Add more achievements as necessary
    };
  }

  getDefaultAchievements() {
    return {
      firstKill: {
        name: "First Kill",
        description: "Defeat your first monster.",
        unlocked: false,
      },
      firstRebirth: {
        name: "First Rebirth",
        description: "Rebirth for the first time.",
        unlocked: false,
      },
      // Add more default achievements as necessary
    };
  }

  checkAchievements(player) {
    console.log("Checking achievements...");

    if (!this.achievements || Object.keys(this.achievements).length === 0) {
      console.error("Achievements object is empty or undefined.");
      return;
    }

    if (!player) {
      console.error("Player object is undefined.");
      return;
    }

    if (!player.values) {
      console.error("Player values object is undefined.");
      return;
    }

    Object.keys(this.achievements).forEach((key) => {
      const achievement = this.achievements[key];

      if (!achievement.unlocked) {
        console.log(
          `Checking if achievement '${achievement.name}' can be unlocked...`
        );

        // Log player values for debugging
        console.log(`Player round: ${player.values.round}`);
        console.log(`Player rebirths: ${player.rebirths}`);

        if (key === "firstKill" && player.values.round > 0) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }

        if (key === "firstRebirth" && player.rebirths > 0) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }
      } else {
        console.log(`Achievement '${achievement.name}' is already unlocked.`);
      }
    });
  }
}
