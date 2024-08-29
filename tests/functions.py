from graphviz import Digraph

# Create a directed graph
dot = Digraph(comment="Game Function Flow")

# Define nodes for major functions
dot.node("startGame", "startGame()")
dot.node("setupEventListeners", "setupEventListeners()")
dot.node("loadPlayerData", "loadPlayerData()")
dot.node("savePlayerData", "savePlayerData()")
dot.node("updateUI", "updateUI()")
dot.node("populateWorldOptions", "populateWorldOptions()")
dot.node("populateAreaOptions", "populateAreaOptions()")
dot.node("spawnMonster", "spawnMonster()")
dot.node("generateSkillTree", "generateSkillTree()")
dot.node("selectClass", "selectClass(className)")
dot.node("switchSection", "switchSection(section)")
dot.node("updatePlayerStats", "updatePlayerStats()")
dot.node("updateMonsterUI", "updateMonsterUI()")
dot.node("attackMonster", "attackMonster()")
dot.node("handleMonsterDeath", "handleMonsterDeath()")
dot.node("handleInvalidWorldOrArea", "handleInvalidWorldOrArea()")
dot.node("getMonsterLevel", "getMonsterLevel()")
dot.node("updateInventoryDisplay", "updateInventoryDisplay(player)")
dot.node("renderInventory", "renderInventory(items)")
dot.node("updateAchievementsList", "updateAchievementsList()")
dot.node("selectSkill", "selectSkill(skill)")
dot.node("unlockSkillButton", "unlockSkillButton EventListener")
dot.node("confirmSelectionButton", "confirmSelectionButton EventListener")

# Add edges to show relationships
dot.edge("startGame", "loadPlayerData")
dot.edge("startGame", "updateUI")
dot.edge("startGame", "populateWorldOptions")
dot.edge("startGame", "populateAreaOptions")
dot.edge("startGame", "spawnMonster")
dot.edge("startGame", "setupEventListeners")

dot.edge("setupEventListeners", "attackMonster")
dot.edge("setupEventListeners", "switchSection")
dot.edge("setupEventListeners", "selectClass")
dot.edge("setupEventListeners", "unlockSkillButton")
dot.edge("setupEventListeners", "confirmSelectionButton")

dot.edge("attackMonster", "updateMonsterUI")
dot.edge("attackMonster", "handleMonsterDeath")

dot.edge("handleMonsterDeath", "updateGameProgression")
dot.edge("handleMonsterDeath", "savePlayerData")
dot.edge("handleMonsterDeath", "spawnMonster")

dot.edge("updateUI", "updatePlayerStats")
dot.edge("updateUI", "updateMonsterUI")
dot.edge("updateUI", "updateInventoryDisplay")
dot.edge("updateUI", "updateAchievementsList")

dot.edge("updatePlayerStats", "populateWorldOptions")
dot.edge("updatePlayerStats", "populateAreaOptions")

dot.edge("selectClass", "generateSkillTree")

dot.edge("unlockSkillButton", "selectSkill")

dot.edge("confirmSelectionButton", "populateWorldOptions")
dot.edge("confirmSelectionButton", "populateAreaOptions")
dot.edge("confirmSelectionButton", "spawnMonster")

# Render the graph to a file
file_path = '/mnt/data/game_function_flow'
dot.render(file_path, format='png')

file_path
