// modules/Inventory.js
export default class Inventory {
  constructor() {
    this.items = {};
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(itemName) {
    this.items = this.items.filter((item) => item !== itemName);
  }

  hasItem(itemName) {
    return this.items.includes(itemName);
  }

  listItems() {
    return this.items;
  }

  equipItem(player, item) {
    slot = item.type;
    // Check if the slot exists and the item is in the inventory
    if (!this.equipmentSlots.hasOwnProperty(slot)) {
      console.error(`Invalid slot: ${slot}`);
      return;
    }
    if (!this.hasItem(item)) {
      console.error(`Item not in inventory: ${item}`);
      return;
    }
    if (player.level >= item.levelRequirement) {
      player.equipment[slot] = item;
      // Update player stats based on the item equipped
      player.damage += item.attack;
      console.log(`${player.name} equipped ${item.name}`);
    } else {
      console.log(`Level too low to equip ${item.name}`);
    }
  }

  unequipItem(player, slot) {
    const item = player.equipment[slot];
    if (item) {
      // Adjust stats when item is unequipped
      player.attack -= item.attack || 0;
      player.defense -= item.defense || 0;
      player.equipment[slot] = null;
      console.log(`${player.name} unequipped ${item.name}`);
    } else {
      console.log(`No item equipped in the ${slot} slot`);
    }
  }

  listEquippedItems() {
    return this.equipmentSlots;
  }
}
