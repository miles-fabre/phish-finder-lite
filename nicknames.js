/* =========================================================
   nicknames.js: the ONLY nicknames a player can use.

   Kids pick one of these instead of typing a name, so no real
   names ever end up in the game (kid privacy).

   Used by:
     index.html  builds the picker from this list
     play.html   checks the saved nickname is really on this list
   ========================================================= */
// Emojis are ones old school tablets can show (no seahorse emoji exists,
// and newer ones like 🪼 jellyfish show as blank boxes on older iPads).
const NICKNAMES = [
  { name: "Clever Clownfish",  emoji: "🐠" },
  { name: "Speedy Sailfish",   emoji: "🐟" },
  { name: "Shimmering Shell",  emoji: "🐚" },
  { name: "Brave Blue Whale",  emoji: "🐳" },
  { name: "Swift Dolphin",     emoji: "🐬" },
  { name: "Tricky Octopus",    emoji: "🐙" },
  { name: "Sneaky Squid",      emoji: "🦑" },
  { name: "Cool Crab",         emoji: "🦀" },
  { name: "Lucky Lobster",     emoji: "🦞" },
  { name: "Wise Sea Turtle",   emoji: "🐢" },
  { name: "Puffy Pufferfish",  emoji: "🐡" },
  { name: "Sharp-Eyed Shark",  emoji: "🦈" },
  { name: "Shiny Shrimp",      emoji: "🦐" },
  { name: "Happy Seal",        emoji: "🦭" },
  { name: "Starry Starfish",   emoji: "⭐" },
  { name: "Daring Diver",      emoji: "🤿" }
];
