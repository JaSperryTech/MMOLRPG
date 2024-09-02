// modules/Loot.js
export const items = {
  SlimeGel: {
    baseValue: 5,
    description: "A gooey substance collected from slimes.",
    effect: "Used in crafting basic potions and traps.",
  },
  AcidicResidue: {
    baseValue: 8,
    description: "A corrosive byproduct of slimes.",
    effect:
      "Used in crafting corrosive traps or weapons that deal additional poison damage.",
  },
  SlimeCore: {
    baseValue: 10,
    description:
      "A small, collectible piece of slime that can be used to craft minor items.",
    effect: "Used to create minor upgrades or enhancements.",
  },
  SlimeCrystal: {
    baseValue: 50,
    description: "A rare, crystallized form of slime essence.",
    effect: "Used in high-tier crafting recipes.",
  },
  SlimeScale: {
    baseValue: 25,
    description: "Scales from slimes that offer some protection.",
    effect: "Used to craft early-game armor.",
  },
  SlimeCharm: {
    baseValue: 100,
    description: "A magical charm infused with slime essence.",
    effect: "Increases experience gain from slimes.",
  },
  SlimeEssence: {
    baseValue: 150,
    description: "A concentrated form of slime magic.",
    effect: "Used to create powerful slime-based items.",
  },
  KingSlimeCrown: {
    baseValue: 200,
    description: "A regal crown worn by the King Slime.",
    effect: "Provides a significant boost to defense.",
  },
  RoyalSlimeArmorPiece: {
    baseValue: 120,
    description: "A piece of the King Slime's royal armor.",
    effect: "Provides high protection.",
  },
  KingSlimeAmulet: {
    baseValue: 300,
    description: "A majestic amulet worn by the King Slime.",
    effect: "Grants significant buffs to strength and resistance.",
  },
  SlimeKingScepter: {
    baseValue: 500,
    description: "A powerful scepter wielded by the King Slime.",
    effect: "Grants powerful slime-related abilities.",
  },
  GoblinTeeth: {
    baseValue: 3,
    description: "Sharp teeth collected from goblins.",
    effect: "Used in crafting basic weapons and traps.",
  },
  GoblinDagger: {
    baseValue: 10,
    description: "A small, fast weapon favored by goblins.",
    effect: "Provides quick attacks with low damage.",
  },
  GoblinTrinket: {
    baseValue: 8,
    description: "A small, decorative item worn by goblins.",
    effect: "Grants minor buffs or can be sold for a small amount of gold.",
  },
  GoblinMask: {
    baseValue: 30,
    description: "A mask worn by goblins to conceal their identity.",
    effect: "Provides bonuses to stealth or perception.",
  },
  GoblinBelt: {
    baseValue: 40,
    description: "A belt worn by goblins that provides utility.",
    effect: "Increases movement speed or evasion.",
  },
  GoblinCharm: {
    baseValue: 75,
    description: "A charm that goblins use to attract luck.",
    effect: "Increases the likelihood of finding additional loot.",
  },
  GoblinSpellbook: {
    baseValue: 120,
    description: "A spellbook containing goblin magic.",
    effect: "Teaches a special upgrade or ability.",
  },
  KingGoblinTeeth: {
    baseValue: 10,
    description: "Higher quality teeth from the King Goblin.",
    effect: "Used in high-tier crafting recipes.",
  },
  KingGoblinDagger: {
    baseValue: 30,
    description: "A finely crafted dagger from the King Goblin.",
    effect: "Higher damage and speed compared to regular goblin daggers.",
  },
  GoblinRelic: {
    baseValue: 50,
    description: "An ancient artifact from the King Goblin.",
    effect: "Used in crafting or trading.",
  },
  KingGoblinCrown: {
    baseValue: 180,
    description: "A crown that signifies the King Goblin's rule.",
    effect: "Provides significant defensive bonuses.",
  },
  GoblinCloak: {
    baseValue: 90,
    description: "A cloak that enhances stealth.",
    effect: "Increases stealth or evasion.",
  },
  KingGoblinAmulet: {
    baseValue: 250,
    description: "A powerful amulet worn by the King Goblin.",
    effect: "Grants substantial buffs to various stats or abilities.",
  },
  GoblinKingStaff: {
    baseValue: 400,
    description: "A staff wielded by the King Goblin with magical properties.",
    effect: "Provides powerful abilities or spells.",
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
      const itemValue = items[itemName].baseValue;
      const itemObject = { Name: itemName, Value: itemValue };
      this.player.addItem(itemObject);
    }
  }
}
