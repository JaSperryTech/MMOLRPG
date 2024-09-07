// modules/Loot.js
export const items = {
  SlimeGel: {
    id: "item-001",
    name: "Slime Gel",
    type: "material",
    description: "Used in crafting basic potions and traps.",
    value: 5,
    rarity: "common",
  },
  AcidicResidue: {
    id: "item-002",
    name: "Acidic Residue",
    type: "material",
    description:
      "Used in crafting corrosive traps or weapons that deal additional poison damage.",
    value: 8,
    rarity: "common",
  },
  SlimeCore: {
    id: "item-003",
    name: "Slime Core",
    type: "material",
    description: "Used to create minor upgrades or enhancements.",
    value: 10,
    rarity: "common",
  },
  SlimeCrystal: {
    id: "item-004",
    name: "Slime Crystal",
    type: "material",
    description: "Used in low-tier crafting recipes.",
    value: 50,
    rarity: "uncommon",
  },
  SlimeScale: {
    id: "item-005",
    name: "Slime Scale",
    type: "material",
    description: "Used to craft early-game armor.",
    value: 25,
    rarity: "uncommon",
  },
  SlimeCharm: {
    id: "item-006",
    name: "Slime Charm",
    type: "accessory",
    description: "Increases experience gain from slimes.",
    value: 100,
    rarity: "rare",
  },
  SlimeEssence: {
    id: "item-007",
    name: "Slime Essence",
    type: "material",
    description: "Used to create powerful slime-based items.",
    value: 150,
    rarity: "rare",
  },
  KingSlimeCrown: {
    id: "item-008",
    name: "King Slime Crown",
    type: "head",
    description: "Provides a significant boost to defense.",
    value: 50,
    rarity: "common",
  },
  RoyalSlimeArmorPiece: {
    id: "item-009",
    name: "Royal Slime Armor Piece",
    type: "material",
    description: "Provides high protection.",
    value: 50,
    rarity: "uncommon",
  },
  KingSlimeAmulet: {
    id: "item-010",
    name: "King Slime’s Amulet",
    type: "accessory",
    description: "Grants significant buffs to strength and resistance.",
    value: 150,
    rarity: "rare",
  },
  SlimeKingScepter: {
    id: "item-011",
    name: "Slime King’s Scepter",
    type: "weapon",
    attack: 50,
    description: "Grants powerful slime-related abilities.",
    value: 250,
    rarity: "rare",
  },
  GoblinTeeth: {
    id: "item-012",
    name: "Goblin Teeth",
    type: "material",
    description: "Used in crafting basic weapons and traps.",
    value: 3,
    rarity: "common",
  },
  GoblinDagger: {
    id: "item-013",
    name: "Goblin Dagger",
    type: "weapon",
    attack: 5,
    description: "Provides quick attacks with low damage.",
    value: 10,
    rarity: "common",
  },
  GoblinTrinket: {
    id: "item-014",
    name: "Goblin Trinket",
    type: "accessory",
    description:
      "Grants minor buffs or can be sold for a small amount of gold.",
    value: 8,
    rarity: "common",
  },
  GoblinMask: {
    id: "item-015",
    name: "Goblin Mask",
    type: "head",
    description: "Provides bonuses to stealth or perception.",
    value: 30,
    rarity: "uncommon",
  },
  GoblinBelt: {
    id: "item-016",
    name: "Goblin’s Belt",
    type: "accessory",
    description: "Increases movement speed or evasion.",
    value: 40,
    rarity: "uncommon",
  },
  GoblinCharm: {
    id: "item-017",
    name: "Goblin’s Charm",
    type: "accessory",
    description: "Increases the likelihood of finding additional loot.",
    value: 75,
    rarity: "rare",
  },
  GoblinCloak: {
    id: "item-018",
    name: "Goblin’s Cloak",
    type: "chest",
    description: "Increases stealth or evasion.",
    value: 90,
    rarity: "uncommon",
  },
  GoblinRelic: {
    id: "item-019",
    name: "Goblin Relic",
    type: "material",
    description: "Used in crafting or trading.",
    value: 50,
    rarity: "common",
  },
  GoblinSpellbook: {
    id: "item-020",
    name: "Goblin’s Spellbook",
    type: "book",
    description: "Teaches a special upgrade or ability.",
    value: 120,
    rarity: "rare",
  },
  KingGoblinTeeth: {
    id: "item-021",
    name: "King Goblin Teeth",
    type: "material",
    description: "Used in high-tier crafting recipes.",
    value: 10,
    rarity: "common",
  },
  KingGoblinDagger: {
    id: "item-022",
    name: "King Goblin Dagger",
    type: "weapon",
    attack: 15,
    description: "Higher damage and speed compared to regular goblin daggers.",
    value: 30,
    rarity: "common",
  },
  KingGoblinCrown: {
    id: "item-023",
    name: "King Goblin’s Crown",
    type: "head",
    description: "Provides significant defensive bonuses.",
    value: 180,
    rarity: "uncommon",
  },
  KingGoblinAmulet: {
    id: "item-024",
    name: "King Goblin’s Amulet",
    type: "accessory",
    description: "Grants substantial buffs to various stats or abilities.",
    value: 250,
    rarity: "rare",
  },
  GoblinKingStaff: {
    id: "item-025",
    name: "Goblin King’s Staff",
    type: "weapon",
    attack: 40,
    description: "Provides powerful abilities or spells.",
    value: 400,
    rarity: "rare",
  },
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
      const itemType = items[itemName].type;
      const itemAttack = items[itemName].attack || 0;
      const itemDescription = items[itemName].description;
      const itemValue = items[itemName].value;
      const itemRarity = items[itemName].rarity;
      const itemObject = {
        Name: itemName,
        Type: itemType,
        Damage: itemAttack,
        Description: itemDescription,
        Value: itemValue,
        Rarity: itemRarity,
      };
      this.player.addItem(itemObject);
    }
  }
}
