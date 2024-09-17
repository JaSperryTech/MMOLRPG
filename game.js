// game.js
const currentVersion = "1.1.2";
const outdatedVersions = ["1.0.3", "1.1.0"]; // List of outdated versions

window.debug = false;

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
const settingsButton = document.getElementById("settings-button");
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
const sortBy = document.getElementById("sort-select");
const filterby = document.getElementById("filter-select");

// Start the game
startGame();

function startGame() {
  try {
    loadPlayerData(); // Load saved data
    renderInventory(player.inventory);
    renderEquipment(player.equipment);
    updateGameProgression();
    updateAchievementsList();
    populateWorldOptions();
    populateAreaOptions();
    updateMonster();
    updatePlayerStatsUI();
    setupEventListeners();
  } catch (error) {
    // Optionally, show a generic error message to users
    console.warn("An error occurred. Please try again later.");
  }
}

function savePlayerData() {
  try {
    localStorage.setItem("playerDebug", window.debug);

    // Separate storage operations with debugging and error handling
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
  try {
    const defaultAchievements = achievements.getDefaultAchievements();

    // Merge default achievements with existing achievements
    Object.keys(defaultAchievements).forEach(function (key) {
      if (!achievements.achievements[key]) {
        achievements.achievements[key] = defaultAchievements[key];
      }
    });
  } catch (error) {
    console.error("Failed to initialize achievements:", error);
  }
}

function initializeSkills() {
  try {
    // Clone skills object to avoid mutating the original
    playerSkills = JSON.parse(JSON.stringify(skills));
  } catch (error) {
    console.error("Failed to clone skills:", error);
  }
}

function loadPlayerData() {
  try {
    // Retrieve all player data from localStorage
    const playerData = {
      version: localStorage.getItem("playerVersion"),
      rebirths: localStorage.getItem("playerRebirths"),
      level: localStorage.getItem("playerLevel"),
      experience: localStorage.getItem("playerExperience"),
      class: localStorage.getItem("playerClass"),
      cols: localStorage.getItem("playerCols"),
      damage: localStorage.getItem("playerDamage"),
      skillPoints: localStorage.getItem("playerSkillPoints"),
      values: localStorage.getItem("playerValues"),
      highestValues: localStorage.getItem("playerHighestValues"),
      achievements: localStorage.getItem("playerAchievements"),
      skills: localStorage.getItem("playerSkills"),
      inventory: localStorage.getItem("playerInventory"),
      equipment: localStorage.getItem("playerEquipment"),
    };

    // Handle outdated versions and reset if needed
    if (!playerData.version || outdatedVersions.includes(playerData.version)) {
      localStorage.clear();
      savePlayerData(); // Save default data after clearing
      return; // Exit early after reset
    }

    // Initialize player with current version
    player = new Player(currentVersion);
    player.version = playerData.version || currentVersion;
    player.level = parseInt(playerData.level, 10) || player.level;
    player.experience =
      parseInt(playerData.experience, 10) || player.experience;

    // Parse and round floating-point values to 2 decimal places
    player.damage = parseFloat(playerData.damage) || player.damage;
    player.damage = Math.round(player.damage * 100) / 100; // Round to 2 decimal places

    player.inventory = JSON.parse(playerData.inventory || "[]");
    player.equipment = JSON.parse(playerData.equipment || "[]");

    player.rebirths = parseFloat(playerData.rebirths) || player.rebirths;
    player.rebirths = Math.round(player.rebirths * 100) / 100; // Round to 2 decimal places

    player.cols = parseFloat(playerData.cols) || player.cols;
    player.cols = Math.round(player.cols * 100) / 100; // Round to 2 decimal places

    player.values = JSON.parse(playerData.values || "[]");
    player.highestValues = JSON.parse(playerData.highestValues || "[]");
    player.skillPoints =
      parseInt(playerData.skillPoints, 10) || player.skillPoints;
    player.class = playerData.class || player.class;

    // Handle achievements and skills
    achievements.achievements = playerData.achievements
      ? JSON.parse(playerData.achievements)
      : initializeAchievements();
    playerSkills = playerData.skills
      ? JSON.parse(playerData.skills)
      : initializeSkills();

    // Handle class assignment and UI updates
    const classSelectionElement = document.getElementById("chooseClass");
    const skillTreeElement = document.getElementById("skilltreeContainer");

    if (player.class === "null" || !playerData.class) {
      classSelectionElement.classList.remove("hidden");
    } else {
      skillTreeElement.classList.remove("hidden");
      generateSkillTree();
    }
  } catch (error) {
    console.error("Failed to load player data:", error);
  }
}

function updateTextContent(element, text) {
  try {
    if (element && text !== undefined) {
      element.textContent = text;
    } else {
      console.warn("Invalid parameters for updateTextContent:", {
        element,
        text,
      });
    }
  } catch (error) {
    console.error("Failed to update text content:", error);
  }
}

function updatePlayerStatsUI() {
  const progressBarFill = document.getElementById("progress-bar-fill");
  const stats = {
    playerLevelElement: player.level,
    playerExperienceElement: player.experience,
    playerMaxExperienceElement: player.getExperienceToNextLevel(),
    playerColsElement: player.cols,
    playerRebirthsElement: player.rebirths,
    playerDamageElement: player.damage,
    playerSkillPointsElement: player.skillPoints,
    playerRebirthsBonusElement: player.rebirthsBonus,
  };

  for (const [element, value] of Object.entries(stats)) {
    updateTextContent(document.getElementById(element), value);
  }
  progressBarFill.style.width = `${player.level}%`;
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

// Function to render the inventory
function renderInventory(items) {
  const inventoryGrid = document.getElementById("inventory-grid");
  inventoryGrid.innerHTML = ""; // Clear current items

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("inventory-item");

    // Display the item's name and value
    itemElement.innerHTML = `
      <p>${item.Name}</p>
      <p>Value: ${item.Value}</p>
    `;

    // Store all relevant item data in dataset
    itemElement.dataset.name = item.Name;
    itemElement.dataset.value = item.Value;
    itemElement.dataset.type = item.Type;
    itemElement.dataset.damage = item.Damage || null;
    itemElement.dataset.description = item.Description;
    itemElement.dataset.rarity = item.Rarity;
    itemElement.dataset.quantity = item.Quantity;

    // Add quantity circle in the top right corner if quantity is greater than or equal to 1
    if (item.Quantity >= 1) {
      const quantityBadge = document.createElement("div");
      quantityBadge.classList.add("quantity-badge");
      quantityBadge.textContent = item.Quantity;
      itemElement.appendChild(quantityBadge);
    }

    // Append the item to the inventory grid
    inventoryGrid.appendChild(itemElement);

    // Add click effect to show persistent tooltip
    itemElement.addEventListener("click", (event) =>
      handleItemClick(event, item, "inventory")
    );
  });
}

function renderEquipment(equipment) {
  const equipmentSlots = {
    head: document.getElementById("equipment-head"),
    chest: document.getElementById("equipment-chest"),
    legs: document.getElementById("equipment-legs"),
    feet: document.getElementById("equipment-feet"),
    shield: document.getElementById("equipment-shield"),
    weapon: document.getElementById("equipment-weapon"),
    accessory1: document.getElementById("equipment-accessory1"),
    accessory2: document.getElementById("equipment-accessory2"),
  };

  for (const [slot, item] of Object.entries(equipment)) {
    const slotElement = equipmentSlots[slot] || null;

    if (!slotElement) {
      console.error(`No element found for slot: ${slot}`);
      continue; // Skip to the next iteration
    }

    slotElement.innerHTML = ""; // Clear the slot

    // Clear any previous event listeners by cloning the node
    const newSlotElement = slotElement.cloneNode(true);
    slotElement.replaceWith(newSlotElement);

    // Update slot with item details or show as unequipped
    if (item) {
      newSlotElement.innerHTML = `<p>${slot}: ${item.Name}</p><p>Value: ${item.Value}</p>`;
      newSlotElement.addEventListener("click", (event) =>
        handleItemClick(event, item, "equipment", slot)
      );
    } else {
      newSlotElement.innerHTML = `<p>${slot}: Unequipped</p>`;
    }

    // Reassign the newSlotElement back to the equipmentSlots
    equipmentSlots[slot] = newSlotElement;
  }
}

// Function to handle item clicks and display tooltips
function handleItemClick(event, item, source, slot = null) {
  // Remove any existing tooltips
  const existingTooltip = document.querySelector(".tooltip");
  if (existingTooltip) {
    existingTooltip.remove();
  }

  // Create a new tooltip with more detailed information
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");

  // Build the tooltip content, including the quantity
  tooltip.innerHTML = `
    <p><strong>${item.Name}</strong></p>
    <p>Type: ${item.Type}</p>
    ${item.Damage ? `<p>Damage: ${item.Damage}</p>` : ""}
    <p>Description: ${item.Description}</p>
    <p>Value: ${item.Value}</p>
    <p>Rarity: ${item.Rarity}</p>
    <p>Quantity: ${item.Quantity}</p> <!-- Display the item quantity -->
    <button class="exit-button">Exit</button>
  `;

  // Add Equip or Unequip buttons based on context
  const equipableTypes = [
    "head",
    "chest",
    "legs",
    "feet",
    "weapon",
    "shield",
    "accessory",
  ];

  if (equipableTypes.includes(item.Type.toLowerCase())) {
    if (source === "inventory") {
      // Equip button for inventory items
      const equipButton = document.createElement("button");
      equipButton.textContent = "Equip";
      equipButton.classList.add("equip-button");
      equipButton.addEventListener("click", () => {
        player.equipItem(player, item); // Equip the item
        tooltip.remove(); // Remove tooltip after equipping
        renderEquipment(player.equipment); // Update the equipment display
        renderInventory(player.inventory); // Update the inventory display
      });
      tooltip.appendChild(equipButton);
    } else if (source === "equipment" && slot) {
      // Unequip button for equipped items
      const unequipButton = document.createElement("button");
      unequipButton.textContent = "Unequip";
      unequipButton.classList.add("unequip-button");
      unequipButton.addEventListener("click", () => {
        player.unequipItem(player, slot); // Unequip the item
        tooltip.remove(); // Remove tooltip after unequipping
        renderEquipment(player.equipment); // Update the equipment display
        renderInventory(player.inventory); // Update the inventory display
      });
      tooltip.appendChild(unequipButton);
    }
  }

  // Position the tooltip
  document.body.appendChild(tooltip);
  const rect = event.currentTarget.getBoundingClientRect();
  let left = rect.left + window.pageXOffset;
  let top = rect.top + rect.height + window.pageYOffset;

  // Ensure tooltip stays within screen bounds
  if (left + tooltip.offsetWidth > window.innerWidth) {
    left = window.innerWidth - tooltip.offsetWidth - 10;
  }
  if (top + tooltip.offsetHeight > window.innerHeight) {
    top = window.innerHeight - tooltip.offsetHeight - 10;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;

  // Add event listener to the exit button
  const exitButton = tooltip.querySelector(".exit-button");
  exitButton.addEventListener("click", () => {
    tooltip.remove();
  });
}

function filterAndSortInventory(type = "all", sortBy = "name") {
  let filteredItems = player.inventory;

  if (type !== "all") {
    filteredItems = player.inventory.filter((item) => item.Type === type);
  }

  const sortedItems = filteredItems.sort((a, b) =>
    sortBy === "name" ? a.Name.localeCompare(b.Name) : b.Value - a.Value
  );

  renderInventory(sortedItems);
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
    });
  } else {
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
  const currentWorld = worlds[`World${player.values.world}`] || null;
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
  const {
    world: worldIndex,
    area: areaIndex,
    round: roundIndex,
  } = player.values;

  const world = worlds[`World${worldIndex}`];
  const area = world?.Areas[areaIndex];

  if (!world || !area) {
    // Handle invalid world or area and update currentMonster
    player.values.area = Math.max(player.values.area - 1, 0);
    const newAreaIndex = player.values.area;
    const newWorldIndex = player.values.world;
    const newMonstersInArea =
      worlds[`World${newWorldIndex}`]?.Areas[newAreaIndex]?.monsters;

    if (!newMonstersInArea) {
      console.error(`Adjusted area still invalid.`);
      return;
    }

    const randomMonsterName =
      newMonstersInArea[Math.floor(Math.random() * newMonstersInArea.length)];
    const monsterLevel = getMonsterLevel();
    currentMonster = new Monster(randomMonsterName, monsterLevel);
  } else {
    // Handle valid world and area
    if (areaIndex % 10 === 0 && roundIndex === 10) {
      const bossInArea = area.boss;
      const randomBossName =
        bossInArea[Math.floor(Math.random() * bossInArea.length)];
      const bossLevel = getMonsterLevel();
      currentMonster = new Monster(randomBossName, bossLevel);
    } else {
      const monstersInArea = area.monsters;
      const randomMonsterName =
        monstersInArea[Math.floor(Math.random() * monstersInArea.length)];
      const monsterLevel = getMonsterLevel();
      currentMonster = new Monster(randomMonsterName, monsterLevel);
    }
  }

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

  // Calculate final level
  const level = Math.round(baseLevel + areaBonus + worldBonus);

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
  settingsButton.addEventListener("click", () => switchSection("settings"));

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
      updateGameProgression();
      updatePlayerStatsUI();
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

      updatePlayerStatsUI();
      savePlayerData();
    } else {
      alert("Not enough skill points or prerequisites not met.");
    }
  });

  // Use filterAndSortInventory function in filter buttons
  filterby.addEventListener("change", function () {
    filterAndSortInventory(filterby.value, sortBy.value);
  });

  sortBy.addEventListener("change", function () {
    filterAndSortInventory(filterby.value, sortBy.value);
  });

  document.getElementById("rebirth-button").addEventListener("click", () => {
    if (player.level >= 100) {
      player.rebirth(player);
      updatePlayerStatsUI();
      updateGameProgression();
      updateWorldAndAreaSelection();
      updateMonster();
      savePlayerData();
    } else {
      console.log("Need to be level 100 or Higher");
    }
  });

  document.getElementById("reset-button").addEventListener("click", () => {
    if (
      confirm(
        "Are you sure you want to reset all data? This action cannot be undone."
      )
    ) {
      // Clear all game data, e.g., localStorage or any other saved state
      localStorage.clear();
      localStorage.removeItem("playerInventory");
      localStorage.removeItem("playerEquipment");
      localStorage.removeItem("playerClass");
      alert("All data has been reset.");
      // Optionally, reload the page to reset everything
      window.location.reload();
    }
  });
}

// Switch between different sections of the game
function switchSection(section) {
  // Hide all sections
  document.querySelectorAll(".game-section").forEach((el) => {
    el.classList.add("hidden");
  });

  if (section == "equipment") {
    renderEquipment(player.equipment);
  } else if (section == "inventoryB") {
    renderInventory(player.inventory);
  } else if (section == "achievements") {
    achievements.checkAchievements(player);
    updateAchievementsList();
  }

  // Show the selected section
  document.getElementById(section).classList.remove("hidden");
}

function attackMonster() {
  // Attack the monster and check if it's dead
  const isDead = currentMonster.takeDamage(player.damage);

  updateMonsterUI();

  if (isDead) {
    const loot = currentMonster.getLoot();
    const lootSystem = new Loot(player);
    lootSystem.processLoot(loot);
    updateGameProgression();
    savePlayerData();
    updateMonster(); // Spawn a new monster
  }
  updatePlayerStatsUI();
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

  updateWorldAndAreaSelection();
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
  const upgrade = playerSkills[classType]?.[specialization]?.[upgradeName];
  if (!upgrade) {
    console.error(
      `Upgrade ${upgradeName} not found in ${classType} ${specialization}`
    );
    return;
  }

  // Apply the effect and mark the upgrade as unlocked
  if (
    typeof skills[classType][specialization][upgradeName].effect === "function"
  ) {
    skills[classType][specialization][upgradeName].effect(player);
  }
  upgrade.unlocked = true;
}

setInterval(commands.checkCommands, 5000); // Check every 100ms

// Get the modal
var modal = document.getElementById("alertModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Display the modal after page load
window.onload = function() {
    modal.style.display = "block";
}

// Close the modal when the user clicks on <span> (x)
span.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when the user clicks outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
