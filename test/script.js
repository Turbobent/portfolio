// script.js
 
// Card representation
class Card {
    constructor(suit, rank) {
      this.suit = suit; // 'hearts', 'diamonds', 'clubs', 'spades'
      this.rank = rank; // 1-13 representing Ace to King
      this.faceUp = false;
    }
   
    // Returns a placeholder name for the card
    getName() {
      const suits = {
        hearts: "H",
        diamonds: "D",
        clubs: "C",
        spades: "S",
      };
      const ranks = {
        1: "A",
        11: "J",
        12: "Q",
        13: "K",
      };
      const rankName = ranks[this.rank] || this.rank;
      return `${rankName}${suits[this.suit]}`;
    }
   
    // Creates the HTML element for the card
     // Creates the HTML element for the card
    createElement() {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.suit = this.suit;
        cardElement.dataset.rank = this.rank;
        cardElement.dataset.color = this.suit === "hearts" || this.suit === "diamonds" ? "red" : "black";
        cardElement.draggable = this.faceUp;
    
        if (this.faceUp) {
            const imgPath = `../pics/cards/${this.suit}_${this.rank}.png`;
            cardElement.style.backgroundImage = `url('${imgPath}')`;
            cardElement.classList.add(cardElement.dataset.color);
            console.log(imgPath);
        } else {
            cardElement.classList.add("face-down");
            cardElement.style.backgroundImage = `url('../pics/cards/cardBack.png')`;
        }

        return cardElement;
    }
  }
   
  // Game state
  const GameState = {
    stock: [],
    waste: [],
    foundations: [[], [], [], []],
    tableau: [[], [], [], [], [], [], []],
    drawCount: 1, // Default to drawing 1 card
  };
   
  // Initialize the game
  function initGame() {
    // Clear previous game state
    GameState.stock = [];
    GameState.waste = [];
    GameState.foundations = [[], [], [], []];
    GameState.tableau = [[], [], [], [], [], [], []];
   
    // Get draw count from select
    const drawSelect = document.getElementById("draw-count");
    GameState.drawCount = parseInt(drawSelect.value, 10);
   
    // Create and shuffle the deck
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const deck = [];
    for (const suit of suits) {
      for (let rank = 1; rank <= 13; rank++) {
        deck.push(new Card(suit, rank));
      }
    }
    shuffle(deck);
   
    // Deal to tableau
    let cardIndex = 0;
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = deck[cardIndex];
        card.faceUp = i === j;
        GameState.tableau[j].push(card);
        cardIndex++;
      }
    }
   
    // Remaining cards go to stock
    GameState.stock = deck.slice(cardIndex);
   
    // Render the game
    renderGame();
  }
   
  // Shuffle function using Fisher-Yates algorithm
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
   
  // Render the game state to the DOM
  function renderGame() {
    // Clear all piles
    document
      .querySelectorAll(".pile, .stock, .waste, .foundation")
      .forEach((pile) => {
        pile.innerHTML = "";
      });
   
    // Render stock
    const stockElement = document.getElementById("stock");
    if (GameState.stock.length > 0) {
      const cardBack = document.createElement("div");
      cardBack.classList.add("card", "face-down");
      stockElement.appendChild(cardBack);
    }
   
    // Render waste
    const wasteElement = document.getElementById("waste");
    const wasteCards = GameState.waste.slice(-GameState.drawCount);
    wasteCards.forEach((card, index) => {
      const cardElement = card.createElement();
      cardElement.style.left = `${index * 15}px`;
      // Add data attributes to identify the pile type and card index
      cardElement.dataset.pileType = "waste";
      cardElement.dataset.cardIndex =
        GameState.waste.length - GameState.drawCount + index;
      wasteElement.appendChild(cardElement);
    });
   
    // Render foundations
    for (let i = 0; i < 4; i++) {
      const foundation = document.getElementById(`foundation-${i}`);
      if (GameState.foundations[i].length > 0) {
        const topCard =
          GameState.foundations[i][GameState.foundations[i].length - 1];
        const cardElement = topCard.createElement();
        foundation.appendChild(cardElement);
      }
    }
   
    // Render tableau
    for (let i = 0; i < 7; i++) {
      const pileElement = document.getElementById(`pile-${i}`);
      const pile = GameState.tableau[i];
      pileElement.innerHTML = "";
      pile.forEach((card, index) => {
        const cardElement = card.createElement();
        cardElement.style.top = `${index * 20}px`;
        cardElement.style.zIndex = index;
        // Attach data to card element for reference
        cardElement.dataset.pileType = "tableau";
        cardElement.dataset.pileIndex = i;
        cardElement.dataset.cardIndex = index;
        pileElement.appendChild(cardElement);
      });
    }
   
    // Add event listeners
    addEventListeners();
   
    // Check for win condition
    checkWinCondition();
  }
   
  // Event listeners for drag and drop
  function addEventListeners() {
    // Remove existing event listeners to prevent duplication
    document.querySelectorAll(".card").forEach((card) => {
      card.removeEventListener("dragstart", onDragStart);
      card.removeEventListener("dragend", onDragEnd);
    });
   
    // Add dragstart and dragend listeners to all face-up cards
    document.querySelectorAll(".card").forEach((card) => {
      if (!card.classList.contains("face-down")) {
        card.addEventListener("dragstart", onDragStart);
        card.addEventListener("dragend", onDragEnd);
      }
    });
   
    // Add dragover and drop listeners to tableau piles
    document.querySelectorAll(".pile").forEach((pile) => {
      pile.addEventListener("dragover", onDragOver);
      pile.addEventListener("drop", onDropOnTableau);
    });
   
    // Add dragover and drop listeners to foundation piles
    document.querySelectorAll(".foundation").forEach((foundation) => {
      foundation.addEventListener("dragover", onDragOver);
      foundation.addEventListener("drop", onDropOnFoundation);
    });
   
    // Add click listener to stock
    document.getElementById("stock").removeEventListener("click", onStockClick);
    document.getElementById("stock").addEventListener("click", onStockClick);
   
    // Add click listener to face-down cards in tableau
    document.querySelectorAll(".face-down").forEach((card) => {
      card.removeEventListener("click", onFaceDownCardClick);
      card.addEventListener("click", onFaceDownCardClick);
    });
  }
   
  // Drag and drop handlers
  let draggedCards = [];
  let sourcePile = null;
   
  // Handler for drag start
  function onDragStart(event) {
    const cardElement = event.target;
    const pileType = cardElement.dataset.pileType;
    let pileIndex, cardIndex, sourcePileArray;
   
    if (pileType === "tableau") {
      pileIndex = parseInt(cardElement.dataset.pileIndex, 10);
      cardIndex = parseInt(cardElement.dataset.cardIndex, 10);
      sourcePileArray = GameState.tableau[pileIndex];
    } else if (pileType === "waste") {
      pileIndex = null; // Waste pile doesn't need a pile index
      cardIndex = parseInt(cardElement.dataset.cardIndex, 10);
      sourcePileArray = GameState.waste;
    } else {
      return; // Invalid pile type
    }
   
    // Get all face-up cards from the selected card onwards
    draggedCards = sourcePileArray.slice(cardIndex);
   
    // Store the dragged card data
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        pileType: pileType,
        pileIndex: pileIndex,
        cardIndex: cardIndex,
      })
    );
   
    // Apply dragging style to all dragged cards
    draggedCards.forEach((card, idx) => {
      const cardEl = cardElement.parentElement.children[cardIndex + idx];
      if (cardEl) {
        cardEl.classList.add("dragging");
      }
    });
  }
   
  // Handler for drag end
  function onDragEnd(event) {
    // Remove dragging style from all cards
    document.querySelectorAll(".card.dragging").forEach((cardEl) => {
      cardEl.classList.remove("dragging");
    });
    draggedCards = [];
    sourcePile = null;
  }
   
  // Handler for drag over (allows dropping)
  function onDragOver(event) {
    event.preventDefault();
  }
   
  // Handler for dropping on tableau piles
  function onDropOnTableau(event) {
    event.preventDefault();
    const targetPileElement = event.currentTarget;
    const targetPileIndex = parseInt(targetPileElement.id.split("-")[1], 10);
    const targetPile = GameState.tableau[targetPileIndex];
   
    // Get target card if any
    const targetCardElement = targetPileElement.querySelector(".card:last-child");
    let targetCard = null;
    if (targetCardElement) {
      const targetCardIndex = parseInt(targetCardElement.dataset.cardIndex, 10);
      targetCard = targetPile[targetCardIndex];
    }
   
    // Get dragged card data
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    let movingCard;
    let movingCards = [];
   
    if (data.pileType === "tableau") {
      movingCard = GameState.tableau[data.pileIndex][data.cardIndex];
      movingCards = GameState.tableau[data.pileIndex].slice(data.cardIndex);
    } else if (data.pileType === "waste") {
      movingCard = GameState.waste[data.cardIndex];
      movingCards = GameState.waste.slice(data.cardIndex);
    } else {
      return; // Invalid pile type
    }
   
    // Validate move according to game rules
    if (isValidTableauMove(movingCard, targetCard, targetPile)) {
      // Move the cards
      if (data.pileType === "tableau") {
        GameState.tableau[data.pileIndex].splice(
          data.cardIndex,
          movingCards.length
        );
        targetPile.push(...movingCards);
        // If source pile has a face-down card, flip it
        const sourcePileArray = GameState.tableau[data.pileIndex];
        if (
          sourcePileArray.length > 0 &&
          !sourcePileArray[sourcePileArray.length - 1].faceUp
        ) {
          sourcePileArray[sourcePileArray.length - 1].faceUp = true;
        }
      } else if (data.pileType === "waste") {
        GameState.waste.splice(data.cardIndex, movingCards.length);
        targetPile.push(...movingCards);
      }
      renderGame();
    }
  }
   
  // Handler for dropping on foundation piles
  function onDropOnFoundation(event) {
    event.preventDefault();
    const foundationElement = event.currentTarget;
    const foundationIndex = parseInt(foundationElement.id.split("-")[1], 10);
    const foundationPile = GameState.foundations[foundationIndex];
   
    // Get dragged card data
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    let movingCard;
   
    if (data.pileType === "tableau") {
      movingCard = GameState.tableau[data.pileIndex][data.cardIndex];
    } else if (data.pileType === "waste") {
      movingCard = GameState.waste[data.cardIndex];
    } else {
      return; // Invalid pile type
    }
   
    // Validate move according to game rules
    if (isValidFoundationMove(movingCard, foundationPile)) {
      // Move the card
      if (data.pileType === "tableau") {
        GameState.tableau[data.pileIndex].pop();
        // Flip the next card if it's face-down
        const sourcePile = GameState.tableau[data.pileIndex];
        if (sourcePile.length > 0 && !sourcePile[sourcePile.length - 1].faceUp) {
          sourcePile[sourcePile.length - 1].faceUp = true;
        }
      } else if (data.pileType === "waste") {
        GameState.waste.splice(data.cardIndex, 1);
      }
      foundationPile.push(movingCard);
      renderGame();
    }
  }
   
  // Handler for clicking the stock pile
  function onStockClick() {
    if (GameState.stock.length === 0) {
      // Reset stock from waste
      GameState.stock = GameState.waste.reverse();
      GameState.waste = [];
    } else {
      // Move cards from stock to waste according to draw count
      const drawCount = Math.min(GameState.drawCount, GameState.stock.length);
      for (let i = 0; i < drawCount; i++) {
        const card = GameState.stock.pop();
        card.faceUp = true;
        GameState.waste.push(card);
      }
    }
    renderGame();
  }
   
  // Handler for clicking face-down cards in tableau
  function onFaceDownCardClick(event) {
    // Flip the card if it's the last in the pile
    const cardElement = event.target;
    const pileElement = cardElement.parentElement;
    const pileIndex = parseInt(pileElement.id.split("-")[1], 10);
    const pile = GameState.tableau[pileIndex];
   
    if (pile[pile.length - 1].faceUp === false) {
      pile[pile.length - 1].faceUp = true;
      renderGame();
    }
  }
   
  // Validate tableau move
  function isValidTableauMove(movingCard, targetCard, targetPile) {
    if (targetCard) {
      // Check colors are alternating and ranks are descending
      const movingColor =
        movingCard.suit === "hearts" || movingCard.suit === "diamonds"
          ? "red"
          : "black";
      const targetColor =
        targetCard.suit === "hearts" || targetCard.suit === "diamonds"
          ? "red"
          : "black";
      if (movingColor === targetColor) {
        return false;
      }
      if (movingCard.rank !== targetCard.rank - 1) {
        return false;
      }
      return true;
    } else {
      // Empty tableau pile, only kings can be placed
      if (movingCard.rank === 13) {
        return true;
      } else {
        return false;
      }
    }
  }
   
  // Validate foundation move
  function isValidFoundationMove(movingCard, foundationPile) {
    if (foundationPile.length === 0) {
      // Only aces can be placed on empty foundation
      return movingCard.rank === 1;
    } else {
      const topCard = foundationPile[foundationPile.length - 1];
      // Check same suit and ascending rank
      if (
        movingCard.suit === topCard.suit &&
        movingCard.rank === topCard.rank + 1
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
   
  // Check for win condition
  function checkWinCondition() {
    const totalCardsInFoundations = GameState.foundations.reduce(
      (sum, foundation) => sum + foundation.length,
      0
    );
    if (totalCardsInFoundations === 52) {
      showGameOverMessage("Congratulations! You have won the game!");
    } else if (isNoMoreMoves()) {
      showGameOverMessage("No more moves available. You have lost the game.");
    }
  }
   
  // Show game over message
  function showGameOverMessage(message) {
    const gameOverMessage = document.getElementById("game-over-message");
    const gameOverText = document.getElementById("game-over-text");
    gameOverText.textContent = message;
    gameOverMessage.classList.remove("hidden");
  }
   
  // Hide game over message
  function hideGameOverMessage() {
    const gameOverMessage = document.getElementById("game-over-message");
    gameOverMessage.classList.add("hidden");
  }
   
  // Check if there are no more moves
  function isNoMoreMoves() {
    // Implement logic to check if no more moves are possible
    // For simplicity, we'll return false here
    return false;
  }
   
  // Restart button handler
  document.getElementById("restart-button").addEventListener("click", () => {
    hideGameOverMessage();
    initGame();
  });
   
  // New game button handler
  document.getElementById("new-game-button").addEventListener("click", () => {
    hideGameOverMessage();
    initGame();
  });
   
  // Draw count select handler
  document.getElementById("draw-count").addEventListener("change", () => {
    initGame();
  });
   
  // Initialize the game on page load
  window.onload = initGame;
   
   