const currentVersion = "0.3.0";
const outdatedVersions = []; // List of outdated versions

import Player from "./modules/player.js";
import Monster from "./modules/monster.js";
import Loot from "./modules/loot.js";
import Achievements from "./modules/achievement.js";
import { worlds } from "./modules/world.js";

let player = new Player(currentVersion);
let achievements = new Achievements(player);
let currentMonster = null;

// DOM Elements
const homeButton = document.getElementById("home-button");
const skilltreeButton = document.getElementById("skilltree-button");
const inventoryButton = document.getElementById("inventory-button");
const rebirthsButton = document.getElementById("rebirths-button");
const achievementsButton = document.getElementById("achievements-button");

const attackButton = document.getElementById("attack-button");
const monsterNameElement = document.getElementById("monster-name");
const monsterHealthElement = document.getElementById("monster-health");
const monsterMaxHealthElement = document.getElementById("monster-maxhealth");
const monsterLevelElement = document.getElementById("monster-level");
const playerLevelElement = document.getElementById("player-level");
const playerExpElement = document.getElementById("player-exp");
const playerMaxExpElement = document.getElementById("player-max-exp");
const playerColsElement = document.getElementById("cols");
const playerRebirthElement = document.getElementById("player-rebirths");
const currentWorldElement = document.getElementById("current-world");
const currentAreaElement = document.getElementById("current-area");
const currentRoundElement = document.getElementById("current-round");
const attackPowerElement = document.getElementById("attack-power");
const achievementsListElement = document.getElementById("achievements-list");

const healthBarFill = document.getElementById("health-bar-fill");
const worldSelect = document.getElementById("world-select");
const areaSelect = document.getElementById("area-select");
const confirmSelectionButton = document.getElementById("confirm-selection");

// Start the game
startGame();

function startGame() {
  loadPlayerData(); // Load saved data
  updateUI();
  spawnMonster();
  setupEventListeners();
}

function savePlayerData() {
  try {
    const playerData = {
      version: player.version,
      level: player.level,
      experience: player.experience,
      damage: player.damage,
      inventory: player.inventory,
      rebirths: player.rebirths,
      cols: player.cols,
      values: player.values,
    };
    localStorage.setItem("playerData", JSON.stringify(playerData));
  } catch (error) {
    console.error("Failed to save player data:", error);
  }
}

function loadPlayerData() {
  try {
    const savedData = localStorage.getItem("playerData");
    if (savedData) {
      const playerData = JSON.parse(savedData);

      if (outdatedVersions.includes(playerData.version)) {
        console.log(
          `Wiping outdated save data from version: ${playerData.version}`
        );
        localStorage.removeItem("playerData"); // Wipe the data
        return; // Return to avoid loading old data
      }

      player = new Player(playerData.version); // Use saved version
      player.level = playerData.level || player.level;
      player.experience = playerData.experience || player.experience;
      player.damage = playerData.damage || player.damage;
      player.inventory = playerData.inventory || [];
      player.cols = playerData.cols || player.cols;
      player.rebirths = playerData.rebirths || player.rebirths;
      player.values = playerData.values || player.values;
    }
  } catch (error) {
    console.error("Failed to load player data:", error);
  }
}

function spawnMonster() {
  const { world: worldIndex, area: areaIndex } = player.values;

  if (
    !worlds[`World${worldIndex}`] ||
    !worlds[`World${worldIndex}`].Areas[areaIndex]
  ) {
    handleInvalidWorldOrArea();
    return;
  }

  const monstersInArea = worlds[`World${worldIndex}`].Areas[areaIndex].monsters;
  const randomMonsterName =
    monstersInArea[Math.floor(Math.random() * monstersInArea.length)];
  const monsterLevel = getMonsterLevel();
  currentMonster = new Monster(randomMonsterName, monsterLevel);

  updateMonsterUI();
}

function updateMonsterUI() {
  if (currentMonster) {
    monsterNameElement.textContent = currentMonster.name;
    monsterHealthElement.textContent = currentMonster.health;
    monsterMaxHealthElement.textContent = currentMonster.maxhealth;
    updateHealthBar(
      currentMonster.health,
      currentMonster.maxhealth,
      currentMonster.level
    );
  }
}

function attackMonsterLogic() {
  if (!currentMonster) return false;

  const isDead = currentMonster.takeDamage(player.damage);
  updateMonsterUI();
  return isDead;
}

function handleInvalidWorldOrArea() {
  player.values.area = Math.max(player.values.area - 1, 0);
  const newAreaIndex = player.values.area;
  const newWorldIndex = player.values.world;
  const monstersInArea =
    worlds[`World${newWorldIndex}`].Areas[newAreaIndex]?.monsters;

  if (!monstersInArea) {
    console.error(`Adjusted area still invalid.`);
    return;
  }

  const randomMonsterName =
    monstersInArea[Math.floor(Math.random() * monstersInArea.length)];
  const monsterLevel = getMonsterLevel();
  currentMonster = new Monster(randomMonsterName, monsterLevel);

  updateMonsterUI();
}

function getMonsterLevel() {
  const { round, area, world } = player.values;
  const minBaseLevel = round > 0 ? Math.floor(round) : 1;
  const maxBaseLevel = round > 0 ? Math.floor(round * 2) : 1;
  const randomValue = Math.random();
  const skew = 11;
  const weightedRandom = Math.pow(randomValue, skew);
  const baseLevel =
    Math.floor(weightedRandom * (maxBaseLevel - minBaseLevel + 1)) +
    minBaseLevel;

  const minAreaBonus = area > 1 ? Math.floor((area - 1) * 10) : 0;
  const maxAreaBonus = area > 1 ? minAreaBonus + 10 : 0;
  const areaBonus =
    area > 1
      ? Math.floor(
          Math.pow(Math.random(), skew) * (maxAreaBonus - minAreaBonus + 1)
        ) + minAreaBonus
      : 0;

  const minWorldBonus = world > 1 ? Math.floor((world - 1) * 100) : 0;
  const maxWorldBonus = world > 1 ? minWorldBonus + 100 : 0;
  const worldBonus =
    world > 1
      ? Math.floor(
          Math.pow(Math.random(), skew) * (maxWorldBonus - minWorldBonus + 1)
        ) + minWorldBonus
      : 0;

  const level = Math.min(
    baseLevel + areaBonus + worldBonus,
    maxBaseLevel +
      (area > 1 ? maxAreaBonus : 0) +
      (world > 1 ? maxWorldBonus : 0)
  );

  console.log(`Monster Level BaseLevel:`, baseLevel);
  console.log(`Monster Level areaBonus:`, areaBonus);
  console.log(`Monster Level worldBonus:`, worldBonus);
  console.log(`Monster Level Calculated:`, level);

  return level;
}

function attackMonster() {
  // Calculate the new health percentage
  const healthPercentage =
    (currentMonster.health / currentMonster.maxhealth) * 100;

  // Animate the health bar to the new percentage
  healthBarFill.style.transition = "width 0.5s ease";
  healthBarFill.style.width = healthPercentage + "%";

  // Attack the monster
  const isDead = attackMonsterLogic();

  if (isDead) {
    handleMonsterDeath();
    spawnMonster(); // Spawn new monster
  } else {
    updatePlayerStats(); // Update player stats if the monster is not dead
  }
}

function handleMonsterDeath() {
  const loot = currentMonster.getLoot();
  const lootSystem = new Loot(player);
  lootSystem.processLoot(loot);

  updateGameProgression();
  updateUI(); // Ensure UI is updated
  savePlayerData();
}

function updateGameProgression() {
  player.values.round++;

  if (player.values.round > 10) {
    player.values.round = 0;
    player.values.area++;
  }

  if (player.values.area >= 100) {
    player.values.round = 0;
    player.values.area = 0;
    player.values.world++;
  }

  // Update highest values
  player.highestValues.round = Math.max(
    player.highestValues.round,
    player.values.round
  );
  player.highestValues.area = Math.max(
    player.highestValues.area,
    player.values.area
  );
  player.highestValues.world = Math.max(
    player.highestValues.world,
    player.values.world
  );

  // Update the UI elements
  updateUI();
}

function updatePlayerStats() {
  playerLevelElement.textContent = player.level;
  playerExpElement.textContent = player.experience;
  playerMaxExpElement.textContent = player.getExperienceToNextLevel();
  playerColsElement.textContent = player.cols;
  playerRebirthElement.textContent = player.rebirths;
}

function updateHealthBar(currentHealth, maxHealth, level) {
  // Calculate the percentage of health
  const healthPercentage = (currentHealth / maxHealth) * 100;

  // Set the width of the health bar fill
  healthBarFill.style.width = `${healthPercentage}%`;

  // Optionally update the text or other elements related to health and level
  monsterHealthElement.textContent = `${currentHealth}`;
  monsterLevelElement.textContent = `${level}`;
}

function renderInventory(items) {
  const inventoryGrid = document.getElementById("inventory-grid");
  inventoryGrid.innerHTML = ""; // Clear current items

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("inventory-item");
    itemElement.innerHTML = `<p>${item.Name}</p><p>Value: ${item.Value}</p>`;
    inventoryGrid.appendChild(itemElement);
  });
}

function updateInventoryDisplay(player) {
  renderInventory(player.inventory);
}

function updateAchievementsList() {
  const unlockedAchievements = Object.keys(achievements.achievements).filter(
    (key) => achievements.achievements[key].unlocked
  );
  achievementsListElement.textContent =
    unlockedAchievements.length > 0 ? unlockedAchievements.join(", ") : "None";
}

// Update the UI with dynamic area options based on player's progress
function updateUI() {
  currentWorldElement.textContent = player.values.world;
  currentAreaElement.textContent = player.values.area;
  currentRoundElement.textContent = player.values.round;

  attackPowerElement.textContent = player.damage;
  playerLevelElement.textContent = player.level;
  playerExpElement.textContent = player.experience;
  playerMaxExpElement.textContent = player.getExperienceToNextLevel();
  playerColsElement.textContent = player.cols;
  playerRebirthElement.textContent = player.rebirths;

  updateMonsterUI();

  updateInventoryDisplay(player);
  updateAchievementsList(player);

  // Enable or disable world and area selection
  const canSelect = player.highestValues.area >= player.values.area;
  worldSelect.disabled = !canSelect;
  areaSelect.disabled = !canSelect;
  confirmSelectionButton.disabled = !canSelect;

  // Update area options based on current world and progress
  populateWorldOptions();
  populateAreaOptions();
}

function populateWorldOptions() {
  worldSelect.innerHTML = ""; // Clear existing options
  Object.keys(worlds).forEach((worldKey) => {
    const option = document.createElement("option");
    option.value = parseInt(worldKey.replace("World", ""), 10);
    option.textContent = worldKey;
    worldSelect.appendChild(option);
  });

  // Select the current world
  worldSelect.value = player.values.world;
}

function populateAreaOptions() {
  const currentWorld = worlds[`World${player.values.world}`];
  if (!currentWorld) {
    console.error("Invalid world selection");
    return;
  }

  areaSelect.innerHTML = ""; // Clear previous options

  const maxArea = player.highestValues.area;
  for (let i = 1; i <= maxArea; i++) {
    if (currentWorld.Areas[i]) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `Area ${i}`;
      areaSelect.appendChild(option);
    }
  }

  // Ensure the current area is selected
  areaSelect.value = player.values.area;
}

function setupEventListeners() {
  attackButton.addEventListener("click", attackMonster);
  homeButton.addEventListener("click", () => switchSection("main"));
  skilltreeButton.addEventListener("click", () => switchSection("skilltree"));
  inventoryButton.addEventListener("click", () => switchSection("inventoryB"));
  rebirthsButton.addEventListener("click", () => switchSection("rebirths"));
  achievementsButton.addEventListener("click", () =>
    switchSection("achievements")
  );

  document.getElementById("rebirth-button").addEventListener("click", () => {
    if (player.level >= 100) {
      player.rebirth();
      updateUI();
      savePlayerData();
    } else {
      console.log("Need to be level 100 or Higher");
    }
  });

  document.getElementById("filter-all").addEventListener("click", () => {
    renderInventory(player.inventory);
  });

  document.getElementById("filter-weapons").addEventListener("click", () => {
    const filteredItems = player.inventory.filter(
      (item) => item.type === "Weapon"
    );
    renderInventory(filteredItems);
  });

  document
    .getElementById("filter-consumables")
    .addEventListener("click", () => {
      const filteredItems = player.inventory.filter(
        (item) => item.type === "Consumable"
      );
      renderInventory(filteredItems);
    });

  // Sorting
  document.getElementById("sort-name").addEventListener("click", () => {
    const sortedItems = [...player.inventory].sort((a, b) =>
      a.Name.localeCompare(b.Name)
    );
    renderInventory(sortedItems);
  });

  document.getElementById("sort-value").addEventListener("click", () => {
    const sortedItems = [...player.inventory].sort((a, b) => b.Value - a.Value);
    renderInventory(sortedItems);
  });

  // Adding Event Listener for World and Area Selection
  confirmSelectionButton.addEventListener("click", () => {
    const selectedWorld = parseInt(worldSelect.value, 10);
    const selectedArea = parseInt(areaSelect.value, 10);

    if (
      !isNaN(selectedWorld) &&
      !isNaN(selectedArea) &&
      worlds[`World${selectedWorld}`] &&
      worlds[`World${selectedWorld}`].Areas[selectedArea] !== undefined
    ) {
      player.values.world = selectedWorld;
      player.values.area = selectedArea;
      player.values.round = 0;
      updateUI(); // Update UI after selection
      spawnMonster(); // Spawn new monster based on selection
    } else {
      alert("Invalid world or area selection. Please choose again.");
    }
  });
}

// Switch between different sections of the game
function switchSection(section) {
  // Hide all sections
  document.querySelectorAll(".game-section").forEach((el) => {
    el.classList.add("hidden");
  });

  // Show the selected section
  document.getElementById(section).classList.remove("hidden");
}
