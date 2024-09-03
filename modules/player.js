// modules/Player.js
export default class Player {
  constructor(version) {
    this.version = version;
    this.level = 1;
    this.experience = 0;
    this.class = null;
    this.cols = 0;
    this.damage = 1;
    this.rebirths = 0;
    this.skillPoints = 0;
    this.inventory = [];
    this.equipment = {
      head: null,
      chest: null,
      legs: null,
      feet: null,
      weapon: null,
      shield: null,
      accessory: null,
    };
    this.unlockedSkills = [];
    this.values = {
      round: 0,
      area: 1,
      world: 1,
    };
    this.highestValues = {
      round: 0,
      area: 1,
      world: 1,
    };
    this.achievements = [];
  }

  gainExperience(amount) {
    this.experience += amount;

    while (this.experience >= this.getExperienceToNextLevel()) {
      this.levelUp();
    }
  }

  getExperienceToNextLevel() {
    let BaseEXP = 5 * this.level ** 2 + 10 * this.level + 100;

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

  addCols(amount) {
    this.cols += amount;
  }

  addItem(itemObject) {
    this.inventory.push({
      Name: itemObject.Name,
      Type: itemObject.Type,
      Attack: itemObject.Attack,
      Description: itemObject.Description,
      Value: itemObject.Value,
      Rarity: itemObject.Rarity,
    });
  }

  addEquipment(
    itemName,
    itemType,
    itemDamage,
    itemDescription,
    itemValue,
    itemRarity
  ) {
    const itemObject = {
      Name: itemName,
      Type: itemType,
      Damage: itemDamage,
      Description: itemDescription,
      Value: itemValue,
      Rarity: itemRarity,
    };
    this.equipment[itemType] = itemObject;
  }

  rebirth(player) {
    // Reset player stats
    player.level = 1;
    player.experience = 0;
    player.damage = 1;
    player.cols = 0;

    // Optionally, you can keep certain progress
    // For example, you could keep some form of currency or items

    // Increment rebirth count
    player.rebirths++;

    // Optionally, apply rebirth bonuses
    player.applyRebirthBonuses(player);

    // Optionally, you might want to reset or modify player.values
    player.values.round = 0;
    player.values.area = 1;
    player.values.world = 1;
    player.highestValues.round = 0;
    player.highestValues.area = 1;
    player.highestValues.world = 1;
  }

  applyRebirthBonuses(player) {
    // Multiplicative bonus
    const damageMultiplier = 1 + 0.01 * this.rebirths;
    player.damage = Math.floor(this.damage * damageMultiplier);

    // Additive bonus
    const additiveBonus = 5 * this.rebirths;
    player.damage += additiveBonus;
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
