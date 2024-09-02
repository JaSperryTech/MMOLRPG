import { items } from "./loot.js";

// Function to create monster drops with chances
const createDrops = (dropDefinitions) => {
  return dropDefinitions
    .map(({ name, chance }) => {
      if (items[name]) {
        return {
          name: name,
          chance: chance,
          baseValue: items[name].baseValue,
        };
      }
      return null;
    })
    .filter((drop) => drop !== null);
};

// Function to create monsters with drops
const createMonsters = () => {
  return {
    Slime: {
      name: "Slime",
      type: "Common",
      stats: {
        HP: 10,
        Defense: 10,
      },
      experience: 10,
      drops: createDrops([
        { name: "SlimeGel", chance: 0.5 },
        { name: "AcidicResidue", chance: 0.3 },
        { name: "SlimeCore", chance: 0.2 },
      ]),
    },
    Goblin: {
      name: "Goblin",
      type: "Uncommon",
      stats: {
        HP: 20,
        Defense: 15,
      },
      experience: 25,
      drops: createDrops([
        { name: "GoblinTeeth", chance: 0.5 },
        { name: "GoblinDagger", chance: 0.25 },
        { name: "GoblinMask", chance: 0.1 },
      ]),
    },
    King_Slime: {
      name: "King Slime",
      type: "Boss",
      stats: {
        HP: 100,
        Defense: 100,
      },
      experience: 100,
      drops: createDrops([
        { name: "SlimeCrystal", chance: 0.5 },
        { name: "KingSlimeCrown", chance: 0.25 },
        { name: "SlimeEssence", chance: 0.1 },
        { name: "RoyalSlimeArmorPiece", chance: 0.15 },
      ]),
    },
    King_Goblin: {
      name: "King Goblin",
      type: "Boss",
      stats: {
        HP: 200,
        Defense: 150,
      },
      experience: 250,
      drops: createDrops([
        { name: "KingGoblinTeeth", chance: 0.5 },
        { name: "KingGoblinDagger", chance: 0.25 },
        { name: "KingGoblinCrown", chance: 0.15 },
        { name: "GoblinKingStaff", chance: 0.1 },
      ]),
    },
  };
};

// Export the worlds and monsters
export const worlds = {
  World1: {
    Areas: {
      1: { monsters: ["Slime"] },
      2: { monsters: ["Slime"] },
      3: { monsters: ["Slime"] },
      4: { monsters: ["Slime"] },
      5: { monsters: ["Slime"] },
      6: { monsters: ["Slime"] },
      7: { monsters: ["Slime"] },
      8: { monsters: ["Slime"] },
      9: { monsters: ["Slime"] },
      10: { monsters: ["King_Slime"] },
      11: { monsters: ["Slime", "Goblin"] },
      12: { monsters: ["Slime", "Goblin"] },
      13: { monsters: ["Slime", "Goblin"] },
      14: { monsters: ["Slime", "Goblin"] },
      15: { monsters: ["Goblin"] },
      16: { monsters: ["Goblin"] },
      17: { monsters: ["Goblin"] },
      18: { monsters: ["Goblin"] },
      19: { monsters: ["Goblin"] },
      20: { monsters: ["King_Goblin"] },
    },
  },
};

export const monsters = createMonsters();
