export default class Crafting {
  constructor(player) {
    this.player = player;
    this.recipes = [
      {
        name: "Iron Sword",
        materials: { iron: 10, wood: 5 },
        result: { type: "Weapon", Name: "Iron Sword", Value: 100 },
      },
      {
        name: "Health Potion",
        materials: { herb: 5, water: 3 },
        result: { type: "Consumable", Name: "Health Potion", Value: 50 },
      },
    ];
  }

  craft(itemName) {
    const recipe = this.recipes.find((recipe) => recipe.name === itemName);
    if (this.hasMaterials(recipe)) {
      this.removeMaterials(recipe);
      this.player.inventory.push(recipe.result);
    } else {
      console.log("Not enough materials.");
    }
  }

  hasMaterials(recipe) {
    return Object.entries(recipe.materials).every(([material, quantity]) =>
      this.player.inventory.some(
        (item) => item.Name === material && item.Quantity >= quantity
      )
    );
  }

  removeMaterials(recipe) {
    Object.entries(recipe.materials).forEach(([material, quantity]) => {
      const materialItem = this.player.inventory.find(
        (item) => item.Name === material
      );
      materialItem.Quantity -= quantity;
    });
  }
}

// Example usage in game.js
import Crafting from "./modules/crafting.js";

let craftingSystem = new Crafting(player);
craftingSystem.craft("Iron Sword"); // Craft an Iron Sword
