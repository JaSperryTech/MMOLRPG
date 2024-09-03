export default class Quests {
  constructor(player) {
    this.player = player;
    this.activeQuests = [];
    this.completedQuests = [];
  }

  addQuest(quest) {
    this.activeQuests.push(quest);
  }

  completeQuest(quest) {
    this.completedQuests.push(quest);
    this.activeQuests = this.activeQuests.filter((q) => q !== quest);
    this.applyQuestRewards(quest);
  }

  applyQuestRewards(quest) {
    if (quest.rewards.experience)
      this.player.gainExperience(quest.rewards.experience);
    if (quest.rewards.items) this.player.inventory.push(...quest.rewards.items);
  }

  getQuestList() {
    return this.activeQuests;
  }
}

// Example usage in game.js
import Quests from "./modules/quests.js";

let playerQuests = new Quests(player);

// Add a new quest
playerQuests.addQuest({
  name: "Defeat 10 Monsters",
  description: "Help clear the area by defeating 10 monsters.",
  target: { type: "monster", count: 10 },
  rewards: { experience: 100, items: [{ Name: "Health Potion", Value: 50 }] },
});

// On monster defeat
if (playerQuests.getQuestList()[0].target.count <= 0) {
  playerQuests.completeQuest(playerQuests.getQuestList()[0]);
}
