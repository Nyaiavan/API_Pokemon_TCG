// ================== CONSTANTS & DOM ELEMENTS ==================
const API_URL = "https://api.pokemontcg.io/v2/cards";

const resultsEl = document.getElementById("results");
const statusEl = document.getElementById("status");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const pokemonDisplay = document.getElementById("pokemonDisplay");
const darkModeBtn = document.getElementById("darkModeBtn");
const refreshBtn = document.getElementById("refreshBtn");
const backBtn = document.getElementById("backBtn");
const clearInputBtn = document.getElementById("clearInputBtn");

let darkMode = false;
let lastCards = [];
let lastPokemonName = "";

// ================== DARK MODE TOGGLE ==================
darkModeBtn.addEventListener("click", () => {
  darkMode = !darkMode;
  document.body.classList.toggle("dark-mode", darkMode);
  darkModeBtn.textContent = darkMode ? "☀️" : "🌙";
});

// ================== REFRESH BUTTON ==================
refreshBtn.addEventListener("click", () => {
  location.reload();
});

// ================== BACK BUTTON ==================
backBtn.addEventListener("click", () => {
  searchInput.value = searchInput.value.slice(0, -1);
});

// ================== CLEAR INPUT BUTTON ==================
clearInputBtn.addEventListener("click", () => {
  searchInput.value = "";
});

// ================== STATUS HANDLING ==================
function showStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "red" : "white";
}

// ================== LOADING STATE ==================
function setLoading(isLoading) {
  // Disable/enable the buttons and input
  searchBtn.disabled = isLoading;
  backBtn.disabled = isLoading;
  clearInputBtn.disabled = isLoading;
  refreshBtn.disabled = isLoading;
  searchInput.disabled = isLoading;

  if (isLoading) {
    showStatus("Loading...");
  } else {
    showStatus("");
  }
}

// ================== CLEAR RESULTS ==================
function clearResults() {
  resultsEl.innerHTML = "";
  pokemonDisplay.innerHTML = "";
}

// ================== INPUT VALIDATION ==================
function isValidPokemonName(input) {
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(input);
}

// ================== FETCH TCG CARDS ==================
async function fetchCards(filter = "") {
  try {
    setLoading(true);

    let url = API_URL;
    if (filter) url += `?q=name:${filter}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();
    return data.data || [];

  } catch (error) {
    console.error(error);
    showStatus("Failed to fetch cards.", true);
    return [];
  } finally {
    setLoading(false);
  }
}

// ================== DISPLAY SEARCHED POKÉMON ==================
function showSearchedPokemon(name, sprite) {
  pokemonDisplay.innerHTML = `
    <img src="${sprite}" alt="${name}">
    <h3>${name.toUpperCase()}</h3>
  `;
}

// ================== DISPLAY CARD RESULTS ==================
function displayCards(cards) {
  clearResults();
  lastCards = cards;

  if (cards.length === 0) {
    showStatus("No cards found.", true);
    return;
  }
  showStatus("");
  cards.forEach(card => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.innerHTML = `
      <img src="${card.images.small}" alt="${card.name}">
      <h4>${card.name}</h4>
      <p><strong>HP:</strong> ${card.hp || "N/A"}</p>
      <p><strong>Subtypes:</strong> ${card.subtypes ? card.subtypes.join(", ") : "N/A"}</p>
      <p><strong>Types:</strong> ${card.types ? card.types.join(", ") : "N/A"}</p>
    `;
    cardEl.addEventListener("click", () => viewCardImage(card));
    resultsEl.appendChild(cardEl);
  });
}

// ================== FETCH POKÉMON SPRITE ==================
async function getPokemonSprite(name) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    );
    if (!response.ok) throw new Error("Sprite not found");
    const data = await response.json();
    return data.sprites.front_default || "";
  } catch {
    return "";
  }
}

// ================== VIEW CARD IMAGE FULL ==================
function viewCardImage(card) {
  clearResults();

  const cardView = document.createElement("div");
  cardView.style.position = "fixed";
  cardView.style.top = 0;
  cardView.style.left = 0;
  cardView.style.width = "100vw";
  cardView.style.height = "100vh";
  cardView.style.background = "rgba(0,0,0,0.9)";
  cardView.style.display = "flex";
  cardView.style.justifyContent = "center";
  cardView.style.alignItems = "center";
  cardView.style.zIndex = 1000;

  const img = document.createElement("img");
  img.src = card.images.large || card.images.small;
  img.alt = card.name;
  img.style.maxWidth = "95%";
  img.style.maxHeight = "95%";
  img.style.imageRendering = "pixelated";
  img.style.border = "4px solid red";
  img.style.borderRadius = "10px";
  img.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";

  const returnBtn = document.createElement("button");
  returnBtn.textContent = "⬅ Return";
  returnBtn.style.position = "absolute";
  returnBtn.style.top = "20px";
  returnBtn.style.left = "20px";
  returnBtn.style.padding = "10px 14px";
  returnBtn.style.border = "2px solid black";
  returnBtn.style.borderRadius = "8px";
  returnBtn.style.background = "black";
  returnBtn.style.color = "white";
  returnBtn.style.cursor = "pointer";
  returnBtn.style.fontFamily = "'Press Start 2P', cursive";
  returnBtn.style.fontWeight = "bold";
  returnBtn.style.transition = "transform 0.2s, box-shadow 0.2s";

  returnBtn.addEventListener("mouseover", () => {
    returnBtn.style.transform = "scale(1.1)";
    returnBtn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
    returnBtn.style.color = "#3EB489"; // mint green
  });
  returnBtn.addEventListener("mouseout", () => {
    returnBtn.style.transform = "scale(1)";
    returnBtn.style.boxShadow = "none";
    returnBtn.style.color = "white";
  });

  returnBtn.addEventListener("click", async () => {
    displayCards(lastCards);
    if (lastPokemonName) {
      const sprite = await getPokemonSprite(lastPokemonName);
      showSearchedPokemon(lastPokemonName, sprite);
    }
  });

  cardView.appendChild(img);
  cardView.appendChild(returnBtn);
  resultsEl.appendChild(cardView);
}

// ================== SEARCH EVENT ==================
searchBtn.addEventListener("click", async () => {
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    showStatus("Enter a search term.", true);
    return;
  }

  if (!isValidPokemonName(searchTerm)) {
    showStatus("Invalid input! Please search using Pokémon name only.", true);
    return;
  }

  lastPokemonName = searchTerm;

  const cards = await fetchCards(searchTerm);
  displayCards(cards);

  const sprite = await getPokemonSprite(searchTerm);
  showSearchedPokemon(searchTerm, sprite);
});
