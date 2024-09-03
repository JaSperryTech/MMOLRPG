// modules/Monster.js
import { monsters } from "./world.js"; // Import monsters data

export default class Monster {
  constructor(name, level) {
    this.name = name;
    this.level = level;
    const monsterData = monsters[name];
    this.baseHealth = monsterData.stats.HP;
    this.baseDefense = monsterData.stats.Defense;
    this.isBoss = monsterData.type === "Boss"; // Identify if the monster is a boss
    this.health = this.calculateHealth(level);
    this.maxhealth = this.health; // Initialize health using calculateHealth
    this.colsDrop = Math.floor(Math.random() * level * 10);
    this.experienceDrop = this.calculateExperience(level);
    this.dropModifiers = monsterData.drops; // Use the monster's drop data
  }

  calculateHealth(level) {
    if (this.isBoss) {
      // Bosses have a more controlled scaling factor
      return Math.round(10 + (this.baseHealth * level) ** 2 / 5000);
    }
    // Regular monsters scale with level
    return Math.round(10 + (this.baseHealth * level) ** 2 / 100);
  }

  calculateExperience(level) {
    const monsterData = monsters[this.name];
    return 3 * level ** 2 + 5 * level + monsterData.experience;
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      return true; // Monster is dead
    }
    return false;
  }

  getLoot() {
    return {
      cols: this.colsDrop,
      experience: this.experienceDrop,
      item: this.randomItemDrop(), // Handle item drop logic
    };
  }

  randomItemDrop() {
    const dropRoll = Math.random();
    let cumulativeChance = 0;

    // Loop through the drop modifiers to calculate the drop
    for (const drop of this.dropModifiers) {
      cumulativeChance += drop.chance;
      if (dropRoll < cumulativeChance) {
        return drop.name;
      }
    }

    return null; // No item dropped
  }
}
