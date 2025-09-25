// Game State Management
class GameState {
  constructor() {
    // Initialize default game state
    this.data = {
      plantLevel: 1,
      plantProgress: 0,
      selectedPet: "gatito",
      profileIcon: "Corazón.png",
      completedGoals: 0,
      goals: [],
      achievements: {
        goals5: false,
        goals10: false,
        goals20: false,
        plantCare: false,
      },
      soundEnabled: true,
      firstTime: true,
    }

    // Load saved data from localStorage
    this.loadGame()
  }

  // Save game data to localStorage
  saveGame() {
    localStorage.setItem("makeTheDifferenceGrowing", JSON.stringify(this.data))
  }

  // Load game data from localStorage
  loadGame() {
    const savedData = localStorage.getItem("makeTheDifferenceGrowing")
    if (savedData) {
      this.data = { ...this.data, ...JSON.parse(savedData) }
    }
  }

  // Reset game data
  resetGame() {
    localStorage.removeItem("makeTheDifferenceGrowing")
    this.data = {
      plantLevel: 1,
      plantProgress: 0,
      selectedPet: "gatito",
      profileIcon: "Corazón.png",
      completedGoals: 0,
      goals: [],
      achievements: {
        goals5: false,
        goals10: false,
        goals20: false,
        plantCare: false,
      },
      soundEnabled: true,
      firstTime: true,
    }
    this.saveGame()
  }
}

// Initialize game state
const gameState = new GameState()

// Screen Management
class ScreenManager {
  constructor() {
    this.currentScreen = "start-screen"
    this.currentGameScreen = "home-screen"
  }

  // Show a main screen (start, quiz, pet-selection, game-container)
  showScreen(screenId) {
    // Hide all main screens
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active")
    })

    // Show target screen
    document.getElementById(screenId).classList.add("active")
    this.currentScreen = screenId
  }

  // Show a game screen within the game container
  showGameScreen(screenId) {
    // Hide all game screens
    document.querySelectorAll(".game-screen").forEach((screen) => {
      screen.classList.remove("active")
    })

    // Show target game screen
    document.getElementById(screenId).classList.add("active")
    this.currentGameScreen = screenId

    // Update navigation buttons
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.querySelector(`[data-screen="${screenId}"]`).classList.add("active")
  }
}

// Initialize screen manager
const screenManager = new ScreenManager()

// Plant Growth System
class PlantSystem {
  constructor() {
    this.maxLevel = 5
    this.progressPerGoal = 1
    this.maxProgressPerLevel = 5
  }

  // Update plant visual based on current level
  updatePlantVisual() {
    const plantImg = document.getElementById("current-plant")
    const plantDetailImg = document.getElementById("plant-detail")
    const progressBar = document.getElementById("progress-bar")

    if (plantImg) {
      plantImg.src = `assets/images/Plant${gameState.data.plantLevel}.png`
      plantImg.classList.add("growing")
      setTimeout(() => plantImg.classList.remove("growing"), 800)
    }

    if (plantDetailImg) {
      plantDetailImg.src = `assets/images/Plant${gameState.data.plantLevel}.png`
    }

    if (progressBar) {
      const progressLevel = Math.min(gameState.data.plantProgress, 4)
      progressBar.src = `assets/images/progreso${progressLevel}.png`
    }

    // Update plant info displays
    document.getElementById("plant-level").textContent = gameState.data.plantLevel
    document.getElementById("plant-detail-level").textContent = gameState.data.plantLevel
    document.getElementById("plant-progress-text").textContent =
      `${gameState.data.plantProgress}/${this.maxProgressPerLevel}`
  }

  // Add progress to plant (ahora sube cada dos metas completadas)
  addProgress() {
    // Solo suma progreso si el número de metas completadas es par y mayor a 0
    if (gameState.data.completedGoals > 0 && gameState.data.completedGoals % 2 === 0) {
      gameState.data.plantProgress++
      if (gameState.data.plantProgress >= this.maxProgressPerLevel && gameState.data.plantLevel < this.maxLevel) {
        gameState.data.plantLevel++
        gameState.data.plantProgress = 0
        if (!gameState.data.achievements.plantCare) {
          gameState.data.achievements.plantCare = true
          achievementSystem.unlockAchievement("plantCare")
        }
      }
      this.updatePlantVisual()
      petSystem.triggerHappyAnimation()
      gameState.saveGame()
    }
  }

  // Water plant (solo permite si hay metas completadas)
  waterPlant() {
    this.addProgress()

    // Visual feedback
    const waterBtn = document.getElementById("water-plant-btn")
    waterBtn.style.transform = "scale(1.2)"
    setTimeout(() => {
      waterBtn.style.transform = "scale(1)"
    }, 200)

    // Mensajes positivos para regar la planta
    const positiveMessages = [
      (name) => `🌱 ¡Bien hecho, ${name}! Tu esfuerzo hace que tu planta crezca fuerte y hermosa.`,
      (name) => `✨ Cada meta cumplida es un paso más cerca de tus sueños, ${name}. ¡Sigue así!`,
      (name) => `🌸 Tu disciplina está floreciendo igual que tu planta. ¡Felicidades, ${name}!`,
      (name) => `💡 Lograste una meta más. Tu mente y corazón se fortalecen cada día, ${name}.`,
      (name) => `🌻 ¡Increíble! Tu constancia alimenta tu crecimiento personal, ${name}.`,
      () => "🎉 Tu planta sonríe contigo. ¡Orgullosa de tu progreso!",
      () => "📘 Hoy sembraste conocimiento, mañana cosecharás oportunidades.",
      () => "🌿 Un objetivo cumplido es un nuevo brote en tu camino. ¡Sigue regando tu futuro!",
      () => "🪴 Eres capaz, eres constante, ¡y eso se nota en tu planta y en ti!",
      () => "🌟 ¡Otro logro desbloqueado! Tu esfuerzo te hace brillar cada vez más."
    ]

    // Mensajes cortos para la mascota
    const petMessages = [
      "Estoy orgulloso de ti!",
      "¡Lo has hecho excelente!",
      "Sigue adelante, eres increíble!",
      "¡Me alegra verte crecer!",
      "¡Eres mi héroe!",
      "¡Tu esfuerzo me inspira!",
      "¡Vamos por más metas!",
      "¡Siempre contigo!",
      "¡Tu constancia es admirable!",
      "¡Te acompaño en cada paso!"
    ]

    // Mostrar mensaje positivo en pantalla
    function showPositiveMessage() {
      let msgBox = document.getElementById("positive-message-box")
      if (!msgBox) {
        msgBox = document.createElement("div")
        msgBox.id = "positive-message-box"
        msgBox.style.position = "fixed"
        msgBox.style.top = "30%"
        msgBox.style.left = "50%"
        msgBox.style.transform = "translate(-50%, -50%)"
        msgBox.style.background = "rgba(255,255,255,0.95)"
        msgBox.style.border = "3px solid #d4a5d8"
        msgBox.style.borderRadius = "20px"
        msgBox.style.padding = "1.5rem"
        msgBox.style.fontSize = "1.3rem"
        msgBox.style.color = "#5d4e75"
        msgBox.style.zIndex = "2000"
        msgBox.style.textAlign = "center"
        document.body.appendChild(msgBox)
      }
      const name = gameState.data.playerName || "¡Amigo!"
      const msgFn = positiveMessages[Math.floor(Math.random() * positiveMessages.length)]
      msgBox.textContent = typeof msgFn === "function" ? msgFn(name) : msgFn()
      msgBox.style.display = "block"
      setTimeout(() => {
        msgBox.style.display = "none"
      }, 4000)
    }

    // Mostrar mensaje corto de mascota (debe estar en el ámbito global)
    function showPetMessage() {
      const petMsgBox = document.getElementById("pet-message-box")
      if (petMsgBox) {
        petMsgBox.textContent = petMessages[Math.floor(Math.random() * petMessages.length)]
        petMsgBox.style.display = "block"
        setTimeout(() => {
          petMsgBox.style.display = "none"
        }, 2500)
      }
    }

    showPositiveMessage()
  }
}

// Initialize plant system
const plantSystem = new PlantSystem()

// Pet System
class PetSystem {
  constructor() {
    this.availablePets = ["gatito", "perrito", "lorito", "conejito"]
  }

  // Update pet visual
  updatePetVisual() {
    const petImg = document.getElementById("current-pet")
    const petDisplayImg = document.getElementById("current-pet-display")

    if (petImg) {
      petImg.src = `assets/images/${gameState.data.selectedPet}.png`
    }

    if (petDisplayImg) {
      petDisplayImg.src = `assets/images/${gameState.data.selectedPet}.png`
    }

    // Update pet selection buttons
    document.querySelectorAll(".pet-change-option").forEach((btn) => {
      btn.classList.remove("selected")
      if (btn.dataset.pet === gameState.data.selectedPet) {
        btn.classList.add("selected")
      }
    })
  }

  // Change selected pet
  changePet(petName) {
    if (this.availablePets.includes(petName)) {
      gameState.data.selectedPet = petName
      this.updatePetVisual()
      gameState.saveGame()
    }
  }

  // Trigger happy animation when progress is made
  triggerHappyAnimation() {
    const petImg = document.getElementById("current-pet")
    if (petImg) {
      petImg.classList.add("happy")
      setTimeout(() => petImg.classList.remove("happy"), 1000)
    }
  }
}

// Initialize pet system
const petSystem = new PetSystem()

// Achievement System
class AchievementSystem {
  constructor() {
    this.achievements = {
      goals5: { name: "5 Metas", image: "5goals.png", unlocked: false },
      goals10: { name: "10 Metas", image: "10goals.png", unlocked: false },
      goals20: { name: "20 Metas", image: "20goals.png", unlocked: false },
      plantCare: { name: "Cuidado de Planta", image: "PlantCare.png", unlocked: false },
    }
  }

  // Check and unlock achievements based on progress
  checkAchievements() {
    const completedGoals = gameState.data.completedGoals

    // Check goal-based achievements
    if (completedGoals >= 5 && !gameState.data.achievements.goals5) {
      gameState.data.achievements.goals5 = true
      this.unlockAchievement("goals5")
    }

    if (completedGoals >= 10 && !gameState.data.achievements.goals10) {
      gameState.data.achievements.goals10 = true
      this.unlockAchievement("goals10")
    }

    if (completedGoals >= 20 && !gameState.data.achievements.goals20) {
      gameState.data.achievements.goals20 = true
      this.unlockAchievement("goals20")
    }
  }

  // Unlock specific achievement
  unlockAchievement(achievementId) {
    const slot = document.getElementById(`achievement-${achievementId}`)
    if (slot && this.achievements[achievementId]) {
      const img = document.createElement("img")
      img.src = `assets/images/${this.achievements[achievementId].image}`
      img.alt = this.achievements[achievementId].name
      slot.appendChild(img)

      // Visual feedback
      slot.style.animation = "bounce 0.8s ease-in-out"
      setTimeout(() => {
        slot.style.animation = ""
      }, 800)
    }
  }

  // Update achievement display
  updateAchievementDisplay() {
    Object.keys(gameState.data.achievements).forEach((achievementId) => {
      if (gameState.data.achievements[achievementId]) {
        this.unlockAchievement(achievementId)
      }
    })
  }
}

// Initialize achievement system
const achievementSystem = new AchievementSystem()

// Goal Management System
class GoalSystem {
  constructor() {
    this.goalIdCounter = 0
  }

  // Add new goal
  addGoal(goalText) {
    if (!goalText.trim()) return

    const goal = {
      id: this.goalIdCounter++,
      text: goalText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }

    gameState.data.goals.push(goal)
    this.renderGoals()
    gameState.saveGame()
  }

  // Complete a goal
  completeGoal(goalId) {
    const goal = gameState.data.goals.find((g) => g.id === goalId)
    if (goal && !goal.completed) {
      goal.completed = true
      gameState.data.completedGoals++
      document.getElementById("completed-goals").textContent = gameState.data.completedGoals
      plantSystem.addProgress()
      if (typeof showPetMessage === "function") showPetMessage()
      achievementSystem.checkAchievements()
      this.renderGoals()
      gameState.saveGame()
      updateWaterButtonState()
    }
  }

  // Render goals list
  renderGoals() {
    const goalsList = document.getElementById("goals-list")
    if (!goalsList) return

    goalsList.innerHTML = ""

    // Show only incomplete goals first, then completed ones
    const incompleteGoals = gameState.data.goals.filter((g) => !g.completed)
    const completedGoals = gameState.data.goals.filter((g) => g.completed)
    ;[...incompleteGoals, ...completedGoals].forEach((goal) => {
      const goalElement = document.createElement("div")
      goalElement.className = `goal-item ${goal.completed ? "completed" : ""}`

      goalElement.innerHTML = `
                <span class="goal-text">${goal.text}</span>
                ${
                  !goal.completed
                    ? `<button class="complete-goal-btn" onclick="goalSystem.completeGoal(${goal.id})">
                        ✓
                    </button>`
                    : '<span style="color: #90c695;">✓</span>'
                }
            `

      goalsList.appendChild(goalElement)
    })
  }
}

// Initialize goal system
const goalSystem = new GoalSystem()

// Modal Management
class ModalManager {
  static showModal(modalId) {
    document.getElementById(modalId).classList.add("active")
  }

  static hideModal(modalId) {
    document.getElementById(modalId).classList.remove("active")
  }
}

// Guardar resultado de la encuesta y mostrarlo en el perfil
function processQuizResult() {
  let mente = 0
  let corazon = 0
  for (let i = 1; i <= 5; i++) {
    const val = document.querySelector(`input[name='q${i}']:checked`)
    if (val) {
      if (val.value === "mente") mente++
      else corazon++
    }
  }
  let resultText = ""
  let icon = ""
  if (mente > corazon) {
    resultText = "Tu lógica y claridad te caracterizan. Eres una persona que analiza, reflexiona y busca comprender el mundo con la mente abierta. Tu capacidad para resolver problemas y tomar decisiones te llevará lejos. ¡Confía en tu inteligencia y sigue creciendo!"
    icon = "Cerebro.png"
  } else {
    resultText = "Tu corazón y sensibilidad te distinguen. Eres alguien que conecta profundamente con los demás y con tus propios sueños. Tu empatía y pasión te impulsan a lograr grandes cosas. ¡Sigue escuchando a tu corazón y deja que te guíe hacia tus metas!"
    icon = "Corazón.png"
  }
  gameState.data.profileResult = resultText
  gameState.data.profileIcon = icon
  // Guardar nombre de usuario
  const nameInput = document.getElementById("playerName")
  if (nameInput) {
    gameState.data.playerName = nameInput.value.trim() || "Usuario"
  }
  gameState.saveGame()
  // Mostrar modal con resultado
  showQuizResultModal(resultText, icon)
}

function showQuizResultModal(text, icon) {
  let modal = document.getElementById("quiz-result-modal")
  if (!modal) {
    modal = document.createElement("div")
    modal.id = "quiz-result-modal"
    modal.style.position = "fixed"
    modal.style.top = "0"
    modal.style.left = "0"
    modal.style.width = "100vw"
    modal.style.height = "100vh"
    modal.style.background = "rgba(0,0,0,0.5)"
    modal.style.zIndex = "3000"
    modal.style.display = "flex"
    modal.style.alignItems = "center"
    modal.style.justifyContent = "center"
    modal.innerHTML = `<div style='background:white;padding:2rem;border-radius:20px;border:3px solid #d4a5d8;max-width:400px;text-align:center;'>
      <img src='assets/images/${icon}' alt='icon' style='width:80px;height:80px;margin-bottom:1rem;'>
      <p style='font-size:1.2rem;color:#5d4e75;'>${text}</p>
      <button id='close-quiz-result-btn' style='margin-top:1.5rem;padding:0.7rem 1.5rem;background:#d4a5d8;color:white;border:none;border-radius:10px;font-size:1rem;cursor:pointer;'>Continuar</button>
    </div>`
    document.body.appendChild(modal)
  } else {
    modal.querySelector("p").textContent = text
    modal.querySelector("img").src = `assets/images/${icon}`
    modal.style.display = "flex"
  }
  document.getElementById("close-quiz-result-btn").onclick = function() {
    modal.style.display = "none"
    screenManager.showScreen("pet-selection-screen")
  }
}

// Initialize Game
function initializeGame() {
  // Check if it's first time playing
  if (gameState.data.firstTime) {
    screenManager.showScreen("start-screen")
  } else {
    screenManager.showScreen("game-container")
    updateAllDisplays()
  }

  setupEventListeners()
}

// Update all visual displays
function updateAllDisplays() {
  plantSystem.updatePlantVisual()
  petSystem.updatePetVisual()
  achievementSystem.updateAchievementDisplay()
  goalSystem.renderGoals()

  // Update stats
  document.getElementById("completed-goals").textContent = gameState.data.completedGoals
  document.getElementById("profile-icon").src = `assets/images/${gameState.data.profileIcon}`
  document.getElementById("sound-toggle").checked = gameState.data.soundEnabled

  // Mostrar resultado de perfil si existe
  const profileResultBox = document.getElementById("profile-result-box")
  if (profileResultBox) {
    profileResultBox.textContent = gameState.data.profileResult || "";
    profileResultBox.style.display = gameState.data.profileResult ? "block" : "none";
  }
  // Nombre de usuario
  const profileUserName = document.getElementById("profile-user-name")
  if (profileUserName) {
    profileUserName.textContent = gameState.data.playerName ? `Usuario: ${gameState.data.playerName}` : ""
  }
  // Nombre de mascota
  const profilePetName = document.getElementById("profile-pet-name")
  if (profilePetName) {
    profilePetName.textContent = gameState.data.petName ? `Mascota: ${gameState.data.petName}` : ""
  }
  // Medallas por metas
  const medals = [5, 10, 15, 20]
  const medalImages = ["medalla5.png", "medalla10.png", "medalla15.png", "medalla20.png"]
  const goalMedals = document.getElementById("goal-medals")
  if (goalMedals) {
    goalMedals.innerHTML = ""
    medals.forEach((m, i) => {
      if (gameState.data.completedGoals >= m) {
        const img = document.createElement("img")
        img.src = `assets/images/${medalImages[i]}`
        img.alt = `Medalla ${m} metas`
        img.style.width = "32px"
        img.style.height = "32px"
        goalMedals.appendChild(img)
      }
    })
  }

  // Actualiza el botón de regadera según metas completadas
  function updateWaterButtonState() {
    const waterBtn = document.getElementById("water-plant-btn")
    if (waterBtn) {
      waterBtn.disabled = false
      waterBtn.style.opacity = "1"
      waterBtn.title = "Riega tu planta para darle un impulso extra!"
    }
  }
  updateWaterButtonState()
}

// Setup Event Listeners
function setupEventListeners() {
  // Start button
  document.getElementById("start-button").addEventListener("click", () => {
    if (gameState.data.firstTime) {
      screenManager.showScreen("quiz-screen")
    } else {
      screenManager.showScreen("game-container")
      updateAllDisplays()
    }
  })

  // Quiz options
  document.querySelectorAll(".quiz-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      const answer = e.currentTarget.dataset.answer
      gameState.data.profileIcon = answer === "heart" ? "Corazón.png" : "Cerebro.png"
      screenManager.showScreen("pet-selection-screen")
    })
  })

  // Pet selection (initial)
  document.querySelectorAll(".pet-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      const pet = e.currentTarget.dataset.pet
      gameState.data.selectedPet = pet
      gameState.data.firstTime = false
      gameState.saveGame()

      screenManager.showScreen("game-container")
      updateAllDisplays()
    })
  })

  // Pet change options
  document.querySelectorAll(".pet-change-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      const pet = e.currentTarget.dataset.pet
      petSystem.changePet(pet)
    })
  })

  // Bottom navigation
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const targetScreen = e.currentTarget.dataset.screen
      screenManager.showGameScreen(targetScreen)
    })
  })

  // Add goal button
  document.getElementById("add-goal-btn").addEventListener("click", () => {
    ModalManager.showModal("goal-modal")
    document.getElementById("goal-input").focus()
  })

  // Goal modal buttons
  document.getElementById("save-goal-btn").addEventListener("click", () => {
    const goalText = document.getElementById("goal-input").value
    if (goalText.trim()) {
      goalSystem.addGoal(goalText)
      document.getElementById("goal-input").value = ""
      ModalManager.hideModal("goal-modal")
    }
  })

  document.getElementById("cancel-goal-btn").addEventListener("click", () => {
    document.getElementById("goal-input").value = ""
    ModalManager.hideModal("goal-modal")
  })

  // Goal input enter key
  document.getElementById("goal-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      document.getElementById("save-goal-btn").click()
    }
  })

  // Water plant button
  document.getElementById("water-plant-btn").addEventListener("click", () => {
    plantSystem.waterPlant()
  })

  // Settings
  document.getElementById("sound-toggle").addEventListener("change", (e) => {
    gameState.data.soundEnabled = e.target.checked
    gameState.saveGame()
  })

  document.getElementById("reset-game-btn").addEventListener("click", () => {
    if (confirm("¿Estás seguro de que quieres reiniciar el juego? Se perderá todo el progreso.")) {
      gameState.resetGame()
      location.reload()
    }
  })

  document.getElementById("help-btn").addEventListener("click", () => {
    alert(
      "¡Bienvenido a Make the Difference Growing!\n\n" +
        "• Agrega metas y complétalas para hacer crecer tu planta\n" +
        "• Cuida tu mascota y observa cómo reacciona a tu progreso\n" +
        "• Desbloquea logros completando metas\n" +
        "• Riega tu planta para darle un impulso extra\n\n" +
        "¡Disfruta creciendo junto a tu planta virtual!",
    )
  })

  // Close modal when clicking outside
  document.getElementById("goal-modal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      ModalManager.hideModal("goal-modal")
    }
  })

  // EXTRA para navegación de pantallas
  const submitQuizBtn = document.getElementById("submit-quiz-btn")
  if (submitQuizBtn) {
    submitQuizBtn.addEventListener("click", () => {
      processQuizResult()
    })
  }

  // Guardar nombre de mascota
  const petNameInput = document.getElementById("petNameInput")
  if (petNameInput) {
    petNameInput.addEventListener("change", () => {
      gameState.data.petName = petNameInput.value.trim()
      gameState.saveGame()
      updateAllDisplays()
    })
  }
  // Mensaje al tocar mascota
  const currentPetImg = document.getElementById("current-pet")
  if (currentPetImg) {
    currentPetImg.addEventListener("click", showPetMessage)
  }
}

// Start the game when page loads
document.addEventListener("DOMContentLoaded", initializeGame)

// Expose global functions for inline event handlers
window.goalSystem = goalSystem
window.ModalManager = ModalManager
