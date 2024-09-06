export default class Achievements {
  constructor(player) {
    this.player = player;
    this.achievements =
      this.loadAchievements() || this.getDefaultAchievements();
  }

  getDefaultAchievements() {
    return {
      // Level \\
      levelUp5: {
        name: "On the Rise",
        description: "Reach level 5.",
        unlocked: false,
      },
      levelUp10: {
        name: "Getting Stronger",
        description: "Reach level 10.",
        unlocked: false,
      },
      // Cols \\
      collect50Cols: {
        name: "Getting Rich",
        description: "Collect 50 Cols.",
        unlocked: false,
      },
      collect200Cols: {
        name: "Wealthy",
        description: "Collect 200 Cols.",
        unlocked: false,
      },
      // Skills \\
      unlockSkill: {
        name: "Skillful",
        description: "Unlock your first skill.",
        unlocked: false,
      },
      firstSkillPoint: {
        name: "Level Up Master",
        description: "Earn your first skill point.",
        unlocked: false,
      },
      // Rebirths \\
      firstRebirth: {
        name: "First Rebirth",
        description: "Rebirth for the first time.",
        unlocked: false,
      },
      rebirth5: {
        name: "Rebirth Veteran",
        description: "Rebirth 5 times.",
        unlocked: false,
      },
      // Rounds \\
      highestRound5: {
        name: "Endurance Test",
        description: "Reach round 5.",
        unlocked: false,
      },
      highestRound10: {
        name: "Survivor",
        description: "Reach round 10.",
        unlocked: false,
      },
      roundClearBonus: {
        name: "Area Dominator",
        description: "Clear all rounds in an area.",
        unlocked: false,
      },
      // Areas \\
      firstAreaCompleted: {
        name: "Explorer",
        description: "Complete the first area.",
        unlocked: false,
      },
      // Worlds \\
      reachWorld2: {
        name: "World Traveler",
        description: "Reach World 2.",
        unlocked: false,
      },
      // Damage \\
      maxDamage50: {
        name: "Damage Dealer",
        description: "Reach 50 damage.",
        unlocked: false,
      },
      maxDamage100: {
        name: "Powerhouse",
        description: "Reach 100 damage.",
        unlocked: false,
      },
    };
  }

  loadAchievements() {
    try {
      const savedAchievements = localStorage.getItem("playerAchievements");
      if (savedAchievements) {
        return JSON.parse(savedAchievements);
      }
    } catch (error) {
      console.error("Failed to load achievements:", error);
    }
    return null;
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

        // Check for level-based achievements
        if (key === "levelUp5" && player.level >= 5) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }
        if (key === "levelUp10" && player.level >= 10) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }

        // Check for Cols-based achievements
        if (key === "collect50Cols" && player.cols >= 50) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }
        if (key === "collect200Cols" && player.cols >= 200) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }

        // Check for skills-based achievements
        if (key === "unlockSkill" && player.unlockedSkills.length > 0) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }
        if (key === "firstSkillPoint" && player.skillPoints > 0) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }

        // Check for rebirth-based achievements
        if (key === "firstRebirth" && player.rebirths > 0) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }
        if (key === "rebirth5" && player.rebirths >= 5) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }

        // Check for round-based achievements
        if (key === "highestRound5" && player.values.round >= 5) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }
        if (key === "highestRound10" && player.values.round >= 10) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }
        if (key === "roundClearBonus" && player.values.round === 10) {
          achievement.unlocked = true; // Adjust the round number as needed
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }

        // Check for area-based achievements
        if (key === "firstAreaCompleted" && player.values.area > 1) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }

        // Check for world-based achievements
        if (key === "reachWorld2" && player.values.world >= 2) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }

        // Check for damage-based achievements
        if (key === "maxDamage50" && player.damage >= 50) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }
        if (key === "maxDamage100" && player.damage >= 100) {
          achievement.unlocked = true;
          console.log(`Achievement '${achievement.name}' unlocked!`);
        }
      }
    });

    // Save the updated achievements data
    this.saveAchievements();
  }

  saveAchievements() {
    try {
      localStorage.setItem(
        "playerAchievements",
        JSON.stringify(this.achievements)
      );
    } catch (error) {
      console.error("Failed to save achievements:", error);
    }
  }
}
