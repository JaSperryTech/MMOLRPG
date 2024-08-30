// game.js
const currentVersion = "0.4.0";
const outdatedVersions = []; // List of outdated versions

import Player from "./modules/player.js";
import Monster from "./modules/monster.js";
import Loot from "./modules/loot.js";
import Achievements from "./modules/achievement.js";
import { skills } from "./modules/skills.js";
import { worlds } from "./modules/world.js";

let player = new Player(currentVersion);
let achievements = new Achievements(player);
let currentMonster = null;
let selectedSkill = null;

//--  DOM Elements --\\
const homeButton = document.getElementById("home-button");
const skilltreeButton = document.getElementById("skilltree-button");
const inventoryButton = document.getElementById("inventory-button");
const rebirthsButton = document.getElementById("rebirths-button");
const achievementsButton = document.getElementById("achievements-button");
const currentWorldElement = document.getElementById("current-world");
const currentAreaElement = document.getElementById("current-area");
const currentRoundElement = document.getElementById("current-round");
const worldSelectElement = document.getElementById("world-select");
const areaSelectElement = document.getElementById("area-select");
const confirmSelectionButton = document.getElementById("confirm-selection");
const healthBarFillElement = document.getElementById("health-bar-fill");
const monsterNameElement = document.getElementById("monster-name");
const monsterHealthElement = document.getElementById("monster-health");
const monsterMaxHealthElement = document.getElementById("monster-max-health");
const monsterLevelElement = document.getElementById("monster-level");
const playerRebirthsElement = document.getElementById("player-rebirths");
const playerColsElement = document.getElementById("player-cols");
const playerLevelElement = document.getElementById("player-level");
const playerExperienceElement = document.getElementById("player-experience");
const playerMaxExperienceElement = document.getElementById(
  "player-max-experience"
);
const playerDamageElement = document.getElementById("player-damage");
const attackButton = document.getElementById("attack-button");
const skillTreeContainer = document.getElementById("skill-tree-container");
const skillDescriptionElement = document.getElementById("skill-description");
const unlockedSkillButton = document.getElementById("unlock-skill-button");
const achievementsListElement = document.getElementById("achievements-list");

// Start the game
startGame();

function startGame() {
  loadPlayerData(); // Load saved data

  // Update area options based on current world and progress
  populateWorldOptions();
  populateAreaOptions();
  updateMonster();

  updateUI();
  setupEventListeners();
}

function savePlayerData() {
  try {
    localStorage.setItem("playerVersion", player.version);
    localStorage.setItem("playerRebirths", player.rebirths);
    localStorage.setItem("playerLevel", player.level);
    localStorage.setItem("playerExperience", player.experience);
    localStorage.setItem("playerClass", player.class);
    localStorage.setItem("playerCols", player.cols);
    localStorage.setItem("playerDamage", player.damage);
    localStorage.setItem("playerSkillPoints", player.skillPoints);
    localStorage.setItem("playerValues", JSON.stringify(player.values));
    localStorage.setItem(
      "playerHighestValues",
      JSON.stringify(player.highestValues)
    );
    localStorage.setItem(
      "playerUnlockedSkills",
      JSON.stringify(player.unlockedSkills)
    );
    localStorage.setItem("playerInventory", JSON.stringify(player.inventory));
  } catch (error) {
    console.error("Failed to save player data:", error);
  }
}

function loadPlayerData() {
  try {
    const version = localStorage.getItem("playerVersion");
    const rebirths = localStorage.getItem("playerRebirths");
    const level = localStorage.getItem("playerLevel");
    const experience = localStorage.getItem("playerExperience");
    const playerClass = localStorage.getItem("playerClass");
    const cols = localStorage.getItem("playerCols");
    const damage = localStorage.getItem("playerDamage");
    const skillPoints = localStorage.getItem("playerSkillPoints");
    const values = localStorage.getItem("playerValues");
    const highestValues = localStorage.getItem("playerHighestValues");
    const unlockedSkills = localStorage.getItem("playerUnlockedSkills");
    const inventory = localStorage.getItem("playerInventory");

    if (version) {
      if (outdatedVersions.includes(version)) {
        console.log(`Wiping outdated save data from version: ${version}`);
        localStorage.removeItem("playerVersion");
        localStorage.removeItem("playerRebirths");
        localStorage.removeItem("playerLevel");
        localStorage.removeItem("playerExperience");
        localStorage.removeItem("playerClass");
        localStorage.removeItem("playerCols");
        localStorage.removeItem("playerDamage");
        localStorage.removeItem("playerSkillPoints");
        localStorage.removeItem("playerValues");
        localStorage.removeItem("playerHighestValues");
        localStorage.removeItem("playerUnlockedSkills");
        localStorage.removeItem("playerInventory");
        return; // Return to avoid loading old data
      }

      player = new Player(currentVersion); // Ensure player is initialized with current version
      player.version = version;
      player.level = level ? parseInt(level, 10) : player.level;
      player.experience = experience
        ? parseInt(experience, 10)
        : player.experience;
      player.damage = damage ? parseInt(damage, 10) : player.damage;
      player.inventory = inventory ? JSON.parse(inventory) : [];
      player.rebirths = rebirths ? parseInt(rebirths, 10) : player.rebirths;
      player.cols = cols ? parseInt(cols, 10) : player.cols;
      player.values = values ? JSON.parse(values) : [];
      player.highestValues = highestValues ? JSON.parse(highestValues) : [];
      player.unlockedSkills = unlockedSkills ? JSON.parse(unlockedSkills) : [];
      player.skillPoints = skillPoints
        ? parseInt(skillPoints, 10)
        : player.skillPoints;
      player.class = playerClass || player.class; // Handle class assignment

      if (player.class !== null) {
        const skillTreeElement = document.getElementById("skilltreeContainer");
        skillTreeElement.classList.remove("hidden");
        generateSkillTree();
      } else {
        const classSelectionElement = document.getElementById("chooseClass");
        classSelectionElement.classList.remove("hidden");
      }
    }
  } catch (error) {
    console.error("Failed to load player data:", error);
  }
}

// Update the UI with dynamic area options based on player's progress
function updateUI() {
  updatePlayerStatsUI();
  updateMonsterUI();
  updateInventoryDisplay(player);
  updateAchievementsList();
  updateWorldAndAreaSelection();
}

function updatePlayerStatsUI() {
  playerLevelElement.textContent = player.level;
  playerExperienceElement.textContent = player.experience;
  playerMaxExperienceElement.textContent = player.getExperienceToNextLevel();
  playerColsElement.textContent = player.cols;
  playerRebirthsElement.textContent = player.rebirths;
  playerDamageElement.textContent = player.damage;
}

function updateMonsterUI() {
  // Calculate the percentage of health
  const healthPercentage =
    (currentMonster.health / currentMonster.maxhealth) * 100;

  // Set the width of the health bar fill
  healthBarFillElement.style.width = `${healthPercentage}%`;

  monsterNameElement.textContent = currentMonster.name;
  monsterHealthElement.textContent = currentMonster.health;
  monsterMaxHealthElement.textContent = currentMonster.maxhealth;
  monsterLevelElement.textContent = currentMonster.level;
}

function updateInventoryDisplay(player) {
  renderInventory(player.inventory);
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

function updateAchievementsList() {
  const unlockedAchievements = Object.keys(achievements.achievements).filter(
    (key) => achievements.achievements[key].unlocked
  );
  achievementsListElement.textContent =
    unlockedAchievements.length > 0 ? unlockedAchievements.join(", ") : "None";
}

function updateWorldAndAreaSelection() {
  currentWorldElement.textContent = player.values.world;
  currentAreaElement.textContent = player.values.area;
  currentRoundElement.textContent = player.values.round;

  const canSelect = player.highestValues.area >= player.values.area;
  worldSelectElement.disabled = !canSelect;
  areaSelectElement.disabled = !canSelect;
  confirmSelectionButton.disabled = !canSelect;

  populateWorldOptions();
  populateAreaOptions();
}

function populateWorldOptions() {
  worldSelectElement.innerHTML = ""; // Clear existing options
  Object.keys(worlds).forEach((worldKey) => {
    const option = document.createElement("option");
    option.value = parseInt(worldKey.replace("World", ""), 10);
    option.textContent = worldKey;
    worldSelectElement.appendChild(option);
  });

  // Select the current world
  worldSelectElement.value = player.values.world;
}

function populateAreaOptions() {
  const currentWorld = worlds[`World${player.values.world}`];
  if (!currentWorld) {
    console.error("Invalid world selection");
    return;
  }

  areaSelectElement.innerHTML = ""; // Clear previous options

  const maxArea = player.highestValues.area;
  for (let i = 1; i <= maxArea; i++) {
    if (currentWorld.Areas[i]) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `Area ${i}`;
      areaSelectElement.appendChild(option);
    }
  }

  // Ensure the current area is selected
  areaSelectElement.value = player.values.area;
}

function updateMonster() {
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

function setupEventListeners() {
  homeButton.addEventListener("click", () => switchSection("main"));
  skilltreeButton.addEventListener("click", () => switchSection("skilltree"));
  inventoryButton.addEventListener("click", () => switchSection("inventoryB"));
  rebirthsButton.addEventListener("click", () => switchSection("rebirths"));
  achievementsButton.addEventListener("click", () =>
    switchSection("achievements")
  );

  attackButton.addEventListener("click", attackMonster);

  // Adding Event Listener for World and Area Selection
  confirmSelectionButton.addEventListener("click", () => {
    const selectedWorld = parseInt(worldSelectElement.value, 10);
    const selectedArea = parseInt(areaSelectElement.value, 10);

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
      updateMonster(); // Spawn new monster based on selection
    } else {
      alert("Invalid world or area selection. Please choose again.");
    }
  });

  // New class selection listeners
  document.getElementById("select-warrior").addEventListener("click", () => {
    player.class = "warrior";
    selectClass("warrior");
  });

  document.getElementById("select-mage").addEventListener("click", () => {
    player.class = "mage";
    selectClass("mage");
  });

  document.getElementById("select-archer").addEventListener("click", () => {
    player.class = "archer";
    selectClass("archer");
  });

  unlockedSkillButton.addEventListener("click", () => {
    if (selectedSkill && selectedSkill.canUnlock(player)) {
      selectedSkill.applyEffect(player);
      player.skillPoints -= selectedSkill.cost;
      updateUI();
    } else {
      alert("Not enough skill points or prerequisites not met.");
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

  document.getElementById("rebirth-button").addEventListener("click", () => {
    if (player.level >= 100) {
      player.rebirth();
      updateUI();
      savePlayerData();
    } else {
      console.log("Need to be level 100 or Higher");
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

function attackMonster() {
  updateMonsterUI();

  // Attack the monster
  const isDead = attackMonsterLogic();

  if (isDead) {
    handleMonsterDeath();
    updateMonster(); // Spawn new monster
  } else {
    updatePlayerStatsUI(); // Update player stats if the monster is not dead
  }
}

function attackMonsterLogic() {
  if (!currentMonster) return false;

  const isDead = currentMonster.takeDamage(player.damage);
  updateMonsterUI();
  return isDead;
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

function selectClass(className) {
  player.class = className;

  // Ensure the class-selection and skilltree elements exist
  const classSelectionElement = document.getElementById("chooseClass");
  const skillTreeElement = document.getElementById("skilltreeContainer");

  if (!classSelectionElement || !skillTreeElement) {
    console.error(
      "Required elements for class selection or skill tree not found."
    );
    return;
  }

  // Hide class selection and show skill tree
  classSelectionElement.classList.add("hidden");
  skillTreeElement.classList.remove("hidden");

  // Generate the skill tree based on the selected class
  generateSkillTree();
}

function generateSkillTree() {
  if (!player.class) return; // Ensure a class is selected

  skillTreeContainer.innerHTML = ""; // Clear existing skills

  const skillsForClass = skills[player.class];

  Object.keys(skillsForClass).forEach((subClass) => {
    const classContainer = document.createElement("div");
    classContainer.classList.add("skill-class-container");

    const classTitle = document.createElement("h3");
    classTitle.textContent =
      subClass.charAt(0).toUpperCase() + subClass.slice(1);
    classContainer.appendChild(classTitle);

    Object.values(skillsForClass[subClass]).forEach((skill) => {
      const skillElement = document.createElement("div");
      skillElement.classList.add("skill");

      skillElement.innerHTML = `
        <p><strong>${skill.name}</strong></p>
        <p>Cost: ${skill.cost} Points</p>
      `;

      skillElement.addEventListener("click", () => {
        selectSkill(skill);
      });

      classContainer.appendChild(skillElement);
    });

    skillTreeContainer.appendChild(classContainer);
  });
}

function selectSkill(skill) {
  selectedSkill = skill;
  skillDescriptionElement.textContent = skill.description;
}
