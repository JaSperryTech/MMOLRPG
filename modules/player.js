// modules/Player.js
export default class Player {
  constructor(version) {
    this.level = 1;
    this.experience = 0;
    this.cols = 0;
    this.damage = 1;
    this.rebirths = 0;
    this.inventory = [];
    this.values = {
      round: 1,
      area: 1,
      world: 1,
    };
    this.highestValues = {
      round: 0,
      area: 0,
      world: 0,
    };
    this.version = version;
  }

  gainExperience(amount) {
    this.experience += amount;

    while (this.experience >= this.getExperienceToNextLevel()) {
      this.levelUp();
    }
  }

  getExperienceToNextLevel() {
    let BaseEXP = Math.round((5000 + (10 * this.level) ** 2) / 10);

    let need =
      this.rebirths !== 0
        ? Math.round(BaseEXP * (1.25 * this.rebirths) + BaseEXP)
        : BaseEXP;
    return need;
  }

  levelUp() {
    let neededEXP = this.getExperienceToNextLevel();

    while (this.experience >= neededEXP) {
      this.level++;
      this.experience -= neededEXP;
      this.damage += 1; // Increase damage on level up

      // Update experience required for the next level
      neededEXP = this.getExperienceToNextLevel();
    }
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      // Handle player death or respawn logic here
    }
  }

  heal(amount) {
    this.health += amount;
    if (this.health > 100) {
      this.health = 100;
    }
  }

  addCols(amount) {
    this.cols += amount;
  }

  addItem(itemObject) {
    this.inventory.push({ Name: itemObject.Name, Value: itemObject.Value });
  }

  updateValues({ round, area, world }) {
    if (round !== undefined) this.values.round = round;
    if (area !== undefined) this.values.area = area;
    if (world !== undefined) this.values.world = world;
  }

  rebirth() {
    // Reset player stats
    this.level = 1;
    this.experience = 0;
    this.damage = 1;
    this.cols = 0;

    // Optionally, you can keep certain progress
    // For example, you could keep some form of currency or items

    // Increment rebirth count
    this.rebirths++;

    // Optionally, apply rebirth bonuses
    this.applyRebirthBonuses();

    // Optionally, you might want to reset or modify player.values
    this.values.round = 0;
    this.values.area = 1;
    this.values.world = 1;
  }

  applyRebirthBonuses() {
    // Example bonus: Increase base damage by 10% per rebirth
    this.damage += Math.floor(this.damage * 0.01 * this.rebirths);
  }

  updateValues({ round, area, world }) {
    if (round !== undefined) {
      this.values.round = round;
      this.highestValues.round = Math.max(this.highestValues.round, round); // Update highest round
    }
    if (area !== undefined) {
      this.values.area = area;
      this.highestValues.area = Math.max(this.highestValues.area, area); // Update highest area
    }
    if (world !== undefined) {
      this.values.world = world;
      this.highestValues.world = Math.max(this.highestValues.world, world); // Update highest world
    }
  }
}
