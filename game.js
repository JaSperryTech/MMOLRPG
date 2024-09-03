// game.js
const currentVersion = "1.0.3";
const outdatedVersions = []; // List of outdated versions

import Player from "./modules/player.js";
import Monster from "./modules/monster.js";
import Loot from "./modules/loot.js";
import Achievements from "./modules/achievement.js";
import { skills } from "./modules/skills.js";
import { worlds } from "./modules/world.js";
import * as commands from "./modules/commands.js";

let player = new Player(currentVersion);
let achievements = new Achievements(player);
let playerSkills = skills;
let currentMonster = null;
let selectedSkill = null;

//--  DOM Elements --\\
const homeButton = document.getElementById("home-button");
const skilltreeButton = document.getElementById("skilltree-button");
const inventoryButton = document.getElementById("inventory-button");
const equipmentButton = document.getElementById("equipment-button");
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
const attackButton = document.getElementById("attack-button");
const skillTreeContainer = document.getElementById("skill-tree-container");
const skillDescriptionElement = document.getElementById("skill-description");
const unlockedSkillButton = document.getElementById("unlock-skill-button");
const achievementsListElement = document.getElementById("achievements-grid");

// Start the game
startGame();

function startGame() {
  loadPlayerData(); // Load saved data

  // Update area options based on current world and progress
  populateWorldOptions();
  populateAreaOptions();
  updateMonster();
  setupEventListeners();
  updateUI();
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

    // Filter out unlocked achievements
    const unlockedAchievements = Object.entries(
      achievements.achievements
    ).reduce((acc, [key, achievement]) => {
      acc[key] = achievement;
      return acc;
    }, {});

    localStorage.setItem(
      "playerAchievements",
      JSON.stringify(unlockedAchievements)
    );

    localStorage.setItem("playerSkills", JSON.stringify(playerSkills));

    localStorage.setItem("playerInventory", JSON.stringify(player.inventory));
    localStorage.setItem("playerEquipment", JSON.stringify(player.equipment));
  } catch (error) {
    console.error("Failed to save player data:", error);
  }
}

function initializeAchievements() {
  const defaultAchievements = achievements.getDefaultAchievements();

  Object.keys(defaultAchievements).forEach((key) => {
    if (!achievements.achievements[key]) {
      achievements.achievements[key] = defaultAchievements[key];
    }
  });
}

// Initialize skills properly
function initializeSkills() {
  try {
    playerSkills = JSON.parse(JSON.stringify(skills)); // Ensure cloning is done correctly
    console.log(playerSkills);
  } catch (error) {
    console.error("Failed to clone skills:", error);
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
    const achievementsData = localStorage.getItem("playerAchievements");
    const unlockedSkills = localStorage.getItem("playerSkills");
    const inventory = localStorage.getItem("playerInventory");
    const equipment = localStorage.getItem("playerEquipment");

    if (!version || outdatedVersions.includes(version)) {
      localStorage.clear();
      savePlayerData();
    }

    player = new Player(currentVersion); // Ensure player is initialized with current version
    player.version = version || currentVersion;
    player.level = level ? parseInt(level, 10) : player.level;
    player.experience = experience
      ? parseInt(experience, 10)
      : player.experience;
    player.damage = damage ? parseInt(damage, 10) : player.damage;
    player.inventory = inventory ? JSON.parse(inventory) : [];
    player.equipment = equipment ? JSON.parse(equipment) : [];
    player.rebirths = rebirths ? parseInt(rebirths, 10) : player.rebirths;
    player.cols = cols ? parseInt(cols, 10) : player.cols;
    player.values = values ? JSON.parse(values) : [];
    player.highestValues = highestValues ? JSON.parse(highestValues) : [];

    if (achievementsData) {
      const parsedAchievements = JSON.parse(achievementsData);
      if (Object.keys(parsedAchievements).length > 0) {
        achievements.achievements = parsedAchievements;
      } else {
        initializeAchievements();
      }
    } else {
      initializeAchievements();
    }

    if (unlockedSkills) {
      playerSkills = JSON.parse(unlockedSkills);
    } else {
      initializeSkills();
    }

    player.skillPoints = skillPoints
      ? parseInt(skillPoints, 10)
      : player.skillPoints;
    player.class = playerClass || player.class; // Handle class assignment

    // Explicitly check if player.class is null or doesn't match playerClass
    if (player.class === "null" && playerClass === "null") {
      // Display class selection screen
      const classSelectionElement = document.getElementById("chooseClass");
      classSelectionElement.classList.remove("hidden");
    } else if (player.class === playerClass) {
      const skillTreeElement = document.getElementById("skilltreeContainer");
      skillTreeElement.classList.remove("hidden");

      generateSkillTree();
    } else {
      const classSelectionElement = document.getElementById("chooseClass");
      classSelectionElement.classList.remove("hidden");
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
  achievements.checkAchievements(player);
  updateAchievementsList();
  updateWorldAndAreaSelection();

  updateProgressBar(player.level);
}

function updateTextContent(element, text) {
  if (element && text !== undefined) {
    element.textContent = text;
  }
}

function updatePlayerStatsUI() {
  const stats = {
    playerLevelElement: player.level,
    playerExperienceElement: player.experience,
    playerMaxExperienceElement: player.getExperienceToNextLevel(),
    playerColsElement: player.cols,
    playerRebirthsElement: player.rebirths,
    playerDamageElement: player.damage,
    playerSkillPointsElement: player.skillPoints,
  };

  for (const [element, value] of Object.entries(stats)) {
    updateTextContent(document.getElementById(element), value);
  }
}

function updateProgressBar(value) {
  const progressBarFill = document.getElementById("progress-bar-fill");
  progressBarFill.style.width = `${value}%`;
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

function filterAndSortInventory(type = "all", sortBy = "name") {
  let filteredItems = player.inventory;

  if (type !== "all") {
    filteredItems = player.inventory.filter((item) => item.type === type);
  }

  const sortedItems = filteredItems.sort((a, b) =>
    sortBy === "name" ? a.Name.localeCompare(b.Name) : b.Value - a.Value
  );

  renderInventory(sortedItems);
}

function renderInventory(items) {
  const inventoryGrid = document.getElementById("inventory-grid");
  inventoryGrid.innerHTML = ""; // Clear current items

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("inventory-item");
    itemElement.innerHTML = `<p>${item.Name}</p><p>Value: ${item.Value}</p>`;

    // Store all relevant item data
    itemElement.dataset.name = item.Name;
    itemElement.dataset.value = item.Value;
    itemElement.dataset.type = item.Type;
    itemElement.dataset.damage = item.Damage || null;
    itemElement.dataset.description = item.Description;
    itemElement.dataset.rarity = item.Rarity;

    inventoryGrid.appendChild(itemElement);

    // Add click effect to show persistent tooltip
    itemElement.addEventListener("click", handleItemClick);
  });
}

function handleItemClick(event) {
  // Remove any existing tooltips
  const existingTooltip = document.querySelector(".tooltip");
  if (existingTooltip) {
    existingTooltip.remove();
  }

  // Get the relevant data from the clicked item
  const itemName = event.currentTarget.dataset.name;
  const itemType = event.currentTarget.dataset.type;
  const itemDamage = event.currentTarget.dataset.damage;
  const itemDescription = event.currentTarget.dataset.description;
  const itemValue = event.currentTarget.dataset.value;
  const itemRarity = event.currentTarget.dataset.rarity;

  // Create a new tooltip with more detailed information
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");

  // Build the tooltip content
  tooltip.innerHTML = `
    <p><strong>${itemName}</strong></p>
    <p>Type: ${itemType}</p>
    ${
      itemDamage !== "null" && itemDamage !== ""
        ? `<p>Damage: ${itemDamage}</p>`
        : ""
    }
    <p>Description: ${itemDescription}</p>
    <p>Value: ${itemValue}</p>
    <p>Rarity: ${itemRarity}</p>
    <button class="exit-button">Exit</button>
  `;

  // Add Equip button for certain types
  const equipableTypes = [
    "head",
    "chest",
    "legs",
    "feet",
    "weapon",
    "shield",
    "accessory",
  ];
  if (equipableTypes.includes(itemType.toLowerCase())) {
    const equipButton = document.createElement("button");
    equipButton.textContent = "Equip";
    equipButton.classList.add("equip-button");
    equipButton.addEventListener("click", () => {
      // Handle equipping logic here
      player.addEquipment(
        itemName,
        itemType,
        itemDamage,
        itemDescription,
        itemValue,
        itemRarity
      );
    });
    tooltip.appendChild(equipButton);
  }

  // Position the tooltip
  document.body.appendChild(tooltip);
  const rect = event.currentTarget.getBoundingClientRect();
  tooltip.style.left = `${rect.left + window.pageXOffset}px`;
  tooltip.style.top = `${rect.top + rect.height + window.pageYOffset}px`;

  // Add event listener to the exit button
  const exitButton = tooltip.querySelector(".exit-button");
  exitButton.addEventListener("click", () => {
    tooltip.remove();
  });

  // Store reference to the tooltip
  event.currentTarget.tooltipElement = tooltip;
}

function updateAchievementsList() {
  console.log("Updating achievements list...");
  achievementsListElement.innerHTML = ""; // Clear previous list

  const unlockedAchievements = Object.keys(achievements.achievements).filter(
    (key) => achievements.achievements[key].unlocked
  );

  if (unlockedAchievements.length > 0) {
    unlockedAchievements.forEach((achievementKey) => {
      const achievement = achievements.achievements[achievementKey];

      // Create a new div for each unlocked achievement
      const achievementElement = document.createElement("div");
      achievementElement.classList.add("achievement-box");

      // Add the achievement name and description to the div
      achievementElement.innerHTML = `
        <p><strong>${achievement.name}</strong></p>
        <p>${achievement.description}</p>
      `;

      // Append the achievement div to the achievements list element
      achievementsListElement.appendChild(achievementElement);

      console.log(`Achievement '${achievement.name}' displayed in the list.`);
    });
  } else {
    console.log("No achievements unlocked.");
    achievementsListElement.textContent = "No achievements unlocked.";
  }
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
    location.reload();
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

  // Calculate base level based on round
  const minBaseLevel = round > 0 ? Math.floor(round) : 1;
  const maxBaseLevel = round > 0 ? Math.floor(round * 2) : 1;

  // Generate a skewed random value to favor lower levels
  const randomValue = Math.random();
  const skewFactor = 2;
  const skewedRandomValue = Math.pow(randomValue, skewFactor);

  // Calculate the base level using the skewed random value
  const baseLevel =
    Math.floor(skewedRandomValue * (maxBaseLevel - minBaseLevel + 1)) +
    minBaseLevel;

  // Calculate area and world bonuses
  const areaBonus =
    area > 1 ? Math.floor((area - 1) * 10 + Math.random() * 10) : 0;
  const worldBonus =
    world > 1 ? Math.floor((world - 1) * 100 + Math.random() * 100) : 0;

  // Apply difficulty modifier based on player power
  const difficultyModifier = Math.log1p(player.damage) / 10;

  // Calculate final level
  const level = Math.round(
    baseLevel + areaBonus + worldBonus // + difficultyModifier
  );

  return level;
}

function setupEventListeners() {
  homeButton.addEventListener("click", () => switchSection("main"));
  skilltreeButton.addEventListener("click", () => switchSection("skilltree"));
  inventoryButton.addEventListener("click", () => switchSection("inventoryB"));
  equipmentButton.addEventListener("click", () => switchSection("equipment"));
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

  // Class selection listeners
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

  // Event listener for unlocking a skill
  unlockedSkillButton.addEventListener("click", () => {
    if (
      selectedSkill &&
      canUnlock(
        player,
        player.class,
        selectedSkill.subClass,
        selectedSkill.name
      )
    ) {
      applyEffect(
        player,
        player.class,
        selectedSkill.subClass,
        selectedSkill.name
      );
      player.skillPoints -= selectedSkill.cost;

      updateUI();
      savePlayerData();
    } else {
      alert("Not enough skill points or prerequisites not met.");
    }
  });

  // Use filterAndSortInventory function in filter buttons
  document.getElementById("filter-all").addEventListener("click", () => {
    filterAndSortInventory("all");
  });

  document.getElementById("filter-weapons").addEventListener("click", () => {
    filterAndSortInventory("Weapon");
  });

  document
    .getElementById("filter-consumables")
    .addEventListener("click", () => {
      filterAndSortInventory("Consumable");
    });

  // Use filterAndSortInventory function in sort buttons
  document.getElementById("sort-name").addEventListener("click", () => {
    filterAndSortInventory("all", "name");
  });

  document.getElementById("sort-value").addEventListener("click", () => {
    filterAndSortInventory("all", "value");
  });

  document.getElementById("rebirth-button").addEventListener("click", () => {
    if (player.level >= 100) {
      player.rebirth(player);
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

// Function to generate the skill tree UI
function generateSkillTree() {
  if (!player.class || !playerSkills[player.class]) {
    console.log("Invalid class or skills data.");
    return;
  }

  // Clear existing skill tree container
  skillTreeContainer.innerHTML = "";

  const skillsForClass = playerSkills[player.class];

  // Iterate through each subclass and skill
  Object.keys(skillsForClass).forEach((subClass) => {
    const classContainer = document.createElement("div");
    classContainer.classList.add("skill-class-container");

    // Create a title for each subclass
    const classTitle = document.createElement("h3");
    classTitle.textContent =
      subClass.charAt(0).toUpperCase() + subClass.slice(1);
    classContainer.appendChild(classTitle);

    // Iterate through each skill in the subclass
    Object.entries(skillsForClass[subClass]).forEach(([skillName, skill]) => {
      const skillElement = document.createElement("div");
      skillElement.classList.add("skill");

      skillElement.innerHTML = `
        <p><strong>${skill.name}</strong></p>
        <p>Cost: ${skill.cost} Points</p>
        <p>Status: ${skill.unlocked ? "Unlocked" : "Locked"}</p>
      `;

      // Event listener for selecting a skill
      skillElement.addEventListener("click", () => {
        selectedSkill = { ...skill, subClass, name: skillName }; // Explicitly set subClass and name

        // Update skill description
        skillDescriptionElement.textContent = skill.description;

        // Update the state of the unlock button based on whether the skill can be unlocked
        unlockedSkillButton.disabled = !canUnlock(
          player,
          player.class,
          subClass,
          skillName
        );
      });

      classContainer.appendChild(skillElement);
    });

    skillTreeContainer.appendChild(classContainer);
  });
}

function canUnlock(player, classType, specialization, upgradeName) {
  console.log(
    `Attempting to unlock skill: ${upgradeName} in ${classType} - ${specialization}`
  );

  const upgrade = playerSkills[classType]?.[specialization]?.[upgradeName];
  if (!upgrade) {
    console.error(
      `Upgrade ${upgradeName} not found in ${classType} ${specialization}`
    );
    return false;
  }

  // Check if the player has enough skill points and the skill isn't already unlocked
  return player.skillPoints >= upgrade.cost && !upgrade.unlocked;
}

function applyEffect(player, classType, specialization, upgradeName) {
  console.log(
    `Applying effect for skill: ${upgradeName} in ${classType} - ${specialization}`
  );

  const upgrade = playerSkills[classType]?.[specialization]?.[upgradeName];
  if (!upgrade) {
    console.error(
      `Upgrade ${upgradeName} not found in ${classType} ${specialization}`
    );
    return;
  }

  // Apply the effect and mark the upgrade as unlocked
  if (typeof upgrade.effect === "function") {
    upgrade.effect(player);
  }
  upgrade.unlocked = true;
}

setInterval(commands.checkCommands, 100); // Check every 100ms
