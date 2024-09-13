// modules/skills.js
export default class Upgrade {
  constructor(name, description, cost, effect) {
    this.name = name;
    this.description = description;
    this.cost = cost;
    this.effect = effect; // Function or value that represents the effect of the upgrade
    this.unlocked = false;
  }

  canUnlock(player) {
    return player.skillPoints >= this.cost && !this.unlocked;
  }

  applyEffect(player) {
    if (this.effect && typeof this.effect === "function") {
      this.effect(player);
      this.unlocked = true;
    }
  }
}

// Define upgrades for each class

// Warrior Upgrades
let warriorUpgrades = {
  Berserker: {
    Fury: new Upgrade(
      "Fury",
      "Increase damage by 30% for 10 seconds after leveling up.",
      3,
      (player) => {
        player.damage = Math.floor(player.damage * 1.3);
      }
    ),
  },
  Paladin: {
    ShieldOfFaith: new Upgrade(
      "Shield of Faith",
      "Gain 5% more damage every minute, up to a maximum of 50%.",
      2,
      (player) => {
        player.damage = Math.floor(player.damage * 1.5);
      }
    ),
  },
  Guardian: {
    DefendersCall: new Upgrade(
      "Defender's Call",
      "Increase damage by 15% and reduce experience needed for the next level by 10%.",
      3,
      (player) => {
        player.damage = Math.floor(player.damage * 1.15);
        player.getExperienceToNextLevel = (function (original) {
          return function () {
            return Math.round(original.call(player) * 0.9);
          };
        })(player.getExperienceToNextLevel);
      }
    ),
  },
};

// Mage Upgrades
let mageUpgrades = {
  Elementalist: {
    ElementalSurge: new Upgrade(
      "Elemental Surge",
      "Double damage after casting a skill.",
      3,
      (player) => {
        player.damage *= 2;
      }
    ),
  },
  Necromancer: {
    SoulHarvest: new Upgrade(
      "Soul Harvest",
      "Gain 1% extra experience every minute, up to a maximum of 50%.",
      2,
      (player) => {
        player.experience *= 1.5;
      }
    ),
  },
  Enchanter: {
    EnchantedFocus: new Upgrade(
      "Enchanted Focus",
      "Increase damage by 15% and gain a 10% chance to double experience gained from battles.",
      3,
      (player) => {
        player.damage = Math.floor(player.damage * 1.15);

        const originalGainExperience = player.gainExperience.bind(player);
        player.gainExperience = (amount) => {
          if (Math.random() < 0.1) {
            amount *= 2;
          }
          originalGainExperience(amount);
        };
      }
    ),
  },
};

// Archer Upgrades
let archerUpgrades = {
  Ranger: {
    RapidFire: new Upgrade(
      "Rapid Fire",
      "Increase damage by 25% for 5 seconds after gaining a certain amount of currency.",
      3,
      (player) => {
        player.damage = Math.floor(player.damage * 1.25);
      }
    ),
  },
  Sharpshooter: {
    PrecisionShot: new Upgrade(
      "Precision Shot",
      "Increase damage by 10% for every 10 minutes of idle time, up to a maximum of 50%.",
      2,
      (player) => {
        player.damage = Math.floor(player.damage * 1.1);
      }
    ),
  },
  Beastmaster: {
    BeastlyCompanion: new Upgrade(
      "Beastly Companion",
      "Increase damage by 20% and gain an extra 5% damage boost for every 5 minutes of playtime.",
      3,
      (player) => {
        player.damage = Math.floor(player.damage * 1.2);
      }
    ),
  },
};

// Define the upgrades for each class
export const skills = {
  warrior: warriorUpgrades,
  mage: mageUpgrades,
  archer: archerUpgrades,
};
