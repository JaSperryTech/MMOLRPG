// modules/Loot.js
export const items = {
  Sword: { baseValue: 100, dropChance: 0.1 },
  Shield: { baseValue: 150, dropChance: 0.08 },
  Potion: { baseValue: 50, dropChance: 0.3 },
  // Add more items as needed
};

export default class Loot {
  constructor(player) {
    this.player = player;
  }

  processLoot(monsterLoot) {
    this.player.addCols(monsterLoot.cols);
    this.player.gainExperience(monsterLoot.experience);
    if (monsterLoot.item) {
      const itemName = monsterLoot.item;
      const itemValue = items[itemName].baseValue;
      const itemObject = { Name: itemName, Value: itemValue };
      this.player.addItem(itemObject);
    }
  }
}
