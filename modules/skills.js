// modules/skills.js
export default class Skill {
  constructor(name, description, cost, effect, dependencies = []) {
    this.name = name;
    this.description = description;
    this.cost = cost;
    this.effect = effect; // A function or value that represents the effect of the skill
    this.dependencies = dependencies; // List of other skill names required to unlock this skill
  }

  // Check if the skill can be unlocked based on player's skills and points
  canUnlock(player) {
    if (player.skillPoints < this.cost) return false;
    return this.dependencies.every((dep) =>
      player.unlockedSkills.includes(dep)
    );
  }

  // Apply the skill effect to the player
  applyEffect(player) {
    if (typeof this.effect === "function") {
      this.effect(player);
    } else {
      console.error(`Effect for skill ${this.name} is not a function.`);
    }
  }
}

export const warriorSkills = {
  Berserker: {
    strength: new Skill(
      "Strength",
      "Increase your attack power by 10%.",
      1,
      (player) => {
        player.damage += Math.round(player.damage * 0.1);
      }
    ),
    // Add more Warrior skills here
  },
  Paladin: {
    strength: new Skill(
      "Strength",
      "Increase your attack power by 10%.",
      1,
      (player) => {
        player.damage += Math.round(player.damage * 0.1);
      }
    ),
    // Add more Warrior skills here
  },
  Guardian: {
    strength: new Skill(
      "Strength",
      "Increase your attack power by 10%.",
      1,
      (player) => {
        player.damage += Math.round(player.damage * 0.1);
      }
    ),
    // Add more Warrior skills here
  },
};

export const mageSkills = {
  Elementalist: {
    strength: new Skill(
      "Strength",
      "Increase your attack power by 10%.",
      1,
      (player) => {
        player.damage += Math.round(player.damage * 0.1);
      }
    ),
    // Add more Warrior skills here
  },
  Necromancer: {
    strength: new Skill(
      "Strength",
      "Increase your attack power by 10%.",
      1,
      (player) => {
        player.damage += Math.round(player.damage * 0.1);
      }
    ),
    // Add more Warrior skills here
  },
  Enchanter: {
    strength: new Skill(
      "Strength",
      "Increase your attack power by 10%.",
      1,
      (player) => {
        player.damage += Math.round(player.damage * 0.1);
      }
    ),
    // Add more Warrior skills here
  },
};

export const archerSkills = {
  Ranger: {
    strength: new Skill(
      "Strength",
      "Increase your attack power by 10%.",
      1,
      (player) => {
        player.damage += Math.round(player.damage * 0.1);
      }
    ),
    // Add more Warrior skills here
  },
  Sharpshooter: {
    strength: new Skill(
      "Strength",
      "Increase your attack power by 10%.",
      1,
      (player) => {
        player.damage += Math.round(player.damage * 0.1);
      }
    ),
    // Add more Warrior skills here
  },
  Beastmaster: {
    strength: new Skill(
      "Strength",
      "Increase your attack power by 10%.",
      1,
      (player) => {
        player.damage += Math.round(player.damage * 0.1);
      }
    ),
    // Add more Warrior skills here
  },
};

// Define the skills for each class
export const skills = {
  warrior: warriorSkills,
  mage: mageSkills,
  archer: archerSkills,
};
