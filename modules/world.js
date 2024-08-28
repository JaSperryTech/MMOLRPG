// modules/world.js
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

export const monsters = {
  Slime: {
    name: "Slime",
    type: "Common",
    stats: {
      HP: 10,
      Defense: 10,
    },
    experience: 10,
    drops: [{ name: "Potion", chance: 0.5 }],
  },
  Goblin: {
    name: "Goblin",
    type: "Uncommon",
    stats: {
      HP: 20,
      Defense: 15,
    },
    experience: 25,
    drops: [
      { name: "Sword", chance: 0.25 },
      { name: "Shield", chance: 0.25 },
    ],
  },
  King_Slime: {
    name: "King Slime",
    type: "Common",
    stats: {
      HP: 100,
      Defense: 100,
    },
    experience: 100,
    drops: [{ name: "Potion", chance: 1 }],
  },
  King_Goblin: {
    name: "King Goblin",
    type: "Uncommon",
    stats: {
      HP: 200,
      Defense: 150,
    },
    experience: 250,
    drops: [
      { name: "Sword", chance: 0.5 },
      { name: "Shield", chance: 0.5 },
    ],
  },
  // Define more monsters as needed
};
