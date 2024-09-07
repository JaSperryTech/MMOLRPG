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
      accessory1: null,
      accessory2: null,
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
        ? Math.round(BaseEXP * (1.05 * this.rebirths) + BaseEXP)
        : BaseEXP;
    return need;
  }

  levelUp() {
    let neededEXP = this.getExperienceToNextLevel();

    while (this.experience >= neededEXP) {
      this.experience -= neededEXP;
      this.level++;
      this.damage += 3;

      if (this.level % 10 == 0) {
        this.skillPoints++;
      }

      // Update experience required for the next level
      neededEXP = this.getExperienceToNextLevel();
    }
  }

  addCols(amount) {
    this.cols += amount;
  }

  addItem(item) {
    const existingItem = this.inventory.find((i) => i.Name === item.Name);

    if (existingItem) {
      // Item already exists, increment quantity
      existingItem.Quantity += item.Quantity || 1;
    } else {
      // Add the new item with initial quantity
      this.inventory.push({
        Name: item.Name,
        Type: item.Type,
        Attack: item.Attack,
        Description: item.Description,
        Value: item.Value,
        Rarity: item.Rarity,
        Quantity: item.Quantity || 1, // Default to 1 if quantity isn't specified
      });
    }
  }

  removeItem(item, quantity = 1) {
    const index = this.inventory.findIndex((i) => i.Name === item.Name);

    if (index !== -1) {
      if (this.inventory[index].Quantity > quantity) {
        // Reduce the quantity
        this.inventory[index].Quantity -= quantity;
      } else {
        // Remove the item completely if quantity becomes 0 or less
        this.inventory.splice(index, 1);
      }
    } else {
      console.error(`Item not found: ${item.Name}`);
    }
  }

  hasItem(item, quantity = 1) {
    const inventoryItem = this.inventory.find((i) => i.Name === item.Name);
    return inventoryItem && inventoryItem.Quantity >= quantity;
  }

  equipItem(player, item) {
    const slot = item.Type;

    if (!player.hasItem(item)) {
      console.error(`Item not in inventory: ${item.Name}`);
      return;
    }

    if (slot === "accessory") {
      if (!player.equipment.accessory1) {
        player.equipment.accessory1 = item;
      } else if (!player.equipment.accessory2) {
        player.equipment.accessory2 = item;
      } else {
        console.log("Both accessory slots are occupied");
        alert("Unequip an accessory to equip this item.");
        return;
      }
    } else {
      if (!player.equipment.hasOwnProperty(slot)) {
        console.error(`Invalid slot: ${slot}`);
        return;
      }

      if (player.equipment[slot]) {
        player.unequipItem(player, slot);
      }

      player.equipment[slot] = item;
    }

    player.damage += item.Attack || 0;
    player.removeItem(item);
    console.log(`${player.name} equipped ${item.Name}`);
  }

  unequipItem(player, slot) {
    const item = player.equipment[slot];

    if (!item) {
      console.error(`No item to unequip in slot: ${slot}`);
      return;
    }

    player.damage -= item.Attack || 0;
    player.equipment[slot] = null;
    player.addItem(item);

    console.log(`${player.name} unequipped ${item.Name}`);
  }

  rebirth(player) {
    let remaining = player.level / 100;

    // Reset player stats
    player.level = 1;
    player.experience = 0;
    player.damage = 1;
    player.cols = 0;

    // Optionally, you can keep certain progress
    // For example, you could keep some form of currency or items

    // Increment rebirth count
    player.rebirths += remaining;

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
}
