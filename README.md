# API_Pokemon_TCG
An API project for Pokemon TCG that fetches and displays result based on the given input (Pokemon name).
From Base Set through Sword & Shield, the Pokémon TCG API has the card data you need to build the ultimate application, whether that be mobile or web.

# Features

Search Pokémon cards by name
Display card image, HP, type, and subtypes
View full-size card images
Show Pokémon sprite alongside card search
Dark mode toggle
Refresh, backspace, and clear input buttons
Responsive grid layout for card results

# Base URL
https://api.pokemontcg.io/v2/cards

# Endpoints
/cards - Fetch all cards or filter by name
/cards?q=name:{name} - Search cards by Pokémon name
/cards/{id} - Fetch details for a specific card (not used in search but useful for full card view)

# Required Parameters
q (optional) – A query string to filter cards, e.g., name:pikachu

# Authentication
None

# Sample JSON Response
{
  "data": [
    {
      "id": "xy7-54",
      "name": "Pikachu",
      "images": {
        "small": "https://images.pokemontcg.io/xy7/54.png",
        "large": "https://images.pokemontcg.io/xy7/54_hires.png"
      },
      "hp": "60",
      "types": ["Electric"],
      "subtypes": ["Basic"]
    }
  ]
}

# PokeAPI (for Pokemon Sprites)
# Base URL
https://pokeapi.co/api/v2/pokemon/

# Endpoints
/pokemon/{name} - Fetch details and sprites for a Pokémon
/pokemon?limit=100&offset=0 - Fetch a list of Pokémon (not used, optional)
/pokemon-species/{name} - Fetch species info (not used, optional)

# Required Parameters
name – The name of the Pokémon, e.g., pikachu

# Authentication
None

# Sample JSON Response
{
  "sprites": {
    "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  }
}

# Installation and Running
git clone https://github.com/Nyaiavan/pokemon-tcg-explorer.git
cd pokemon-tcg-explorer

Simply open index.html in any modern web browser (Chrome, Firefox, Edge).

# Usage

Enter a Pokémon name in the search bar (e.g., Pikachu).
Click Search to fetch cards and display them along with the Pokémon sprite.
Click a card to view a full-size version.
Use ⬅ Back to delete characters, ❌ Clear to reset the input, and Refresh to reload the web.
Toggle 🌙/☀️ Dark Mode to switch between light and dark backgrounds.

# Technologies Used

HTML5 & CSS3
JavaScript (ES6+)
Pokémon TCG API
PokéAPI
Google Fonts: Press Start 2P
