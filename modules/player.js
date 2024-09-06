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
      this.damage += 1;

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
    this.inventory.push({
      Name: item.Name,
      Type: item.Type,
      Attack: item.Attack,
      Description: item.Description,
      Value: item.Value,
      Rarity: item.Rarity,
    });
  }

  removeItem(item) {
    // Find the index of the first occurrence of the item with the matching name
    const index = this.inventory.findIndex((items) => items.name === item.name);

    // Check if the item was found in the inventory
    if (index !== -1) {
      // Remove the item at the found index
      this.inventory.splice(index, 1);
    }
  }

  hasItem(item) {
    return this.inventory.some((i) => i.name === item.name);
  }

  equipItem(player, item) {
    const slot = item.Type;

    // Check if the item is in the player's inventory
    if (!player.hasItem(item)) {
      console.error(`Item not in inventory: ${item.name}`);
      return;
    }

    // Handle accessories separately since there are two slots
    if (slot === "accessory") {
      // Check accessory slots
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
      // Check if the equipment slot exists
      if (!player.equipment.hasOwnProperty(slot)) {
        console.error(`Invalid slot: ${slot}`);
        return;
      }

      // Check level requirement if applicable (uncomment and adapt this if necessary)
      // if (player.level < item.levelRequirement) {
      //     console.log(`Level too low to equip ${item.name}`);
      //     return;
      // }

      // Unequip existing item if there is one
      if (player.equipment[slot]) {
        player.unequipItem(player, slot);
      }

      // Equip the new item
      player.equipment[slot] = item;
    }

    // Apply item's effects (e.g., increase damage)
    player.damage += item.attack || 0;

    // Remove the item from the player's inventory
    player.removeItem(item);
    console.log(`${player.name} equipped ${item.name}`);
  }

  unequipItem(player, slot) {
    // Get the item from the specified equipment slot
    const item = player.equipment[slot];

    // Check if there is an item in the slot
    if (!item) {
      console.error(`No item to unequip in slot: ${slot}`);
      return;
    }

    // Adjust stats when item is unequipped
    player.damage -= item.attack || 0;

    // Remove the item from the slot
    player.equipment[slot] = null;

    // Add the item back to the player's inventory
    player.addItem(item);

    console.log(`${player.name} unequipped ${item.name}`);
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
}
