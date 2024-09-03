// modules/Inventory.js
export default class Inventory {
  constructor() {
    this.items = [];
    this.equipmentSlots = {
      head: null,
      body: null,
      legs: null,
      weapon: null,
    };
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

  equipItem(slot, item) {
    // Check if the slot exists and the item is in the inventory
    if (!this.equipmentSlots.hasOwnProperty(slot)) {
      console.error(`Invalid slot: ${slot}`);
      return;
    }
    if (!this.hasItem(item)) {
      console.error(`Item not in inventory: ${item}`);
      return;
    }

    // Equip the item
    this.equipmentSlots[slot] = item;
    this.removeItem(item);
    console.log(`${item} equipped to ${slot}`);
  }

  unequipItem(slot) {
    // Check if the slot exists and an item is equipped
    if (!this.equipmentSlots.hasOwnProperty(slot)) {
      console.error(`Invalid slot: ${slot}`);
      return;
    }
    if (!this.equipmentSlots[slot]) {
      console.error(`No item equipped in slot: ${slot}`);
      return;
    }

    // Unequip the item
    const unequippedItem = this.equipmentSlots[slot];
    this.equipmentSlots[slot] = null;
    this.addItem(unequippedItem);
    console.log(`${unequippedItem} unequipped from ${slot}`);
  }

  listEquippedItems() {
    return this.equipmentSlots;
  }
}
