/* =========================================================
   tricks.js: the 9 kinds of phishing tricks in Phish Finder.
   Shared by play.html (the kids' Field Guide) and
   teacher.html (the class debrief).

   TRICK_OF_SPOT maps each red-flag spot (the text inside
   [[double brackets]] in emails.js) to a trick type.
   If you add a new email, add its red flags here too.
   (Any flag you forget shows up as "Sneaky Trick".)
   ========================================================= */

const TRICKS = {
  rush:     { icon: "⏰", name: "The Rush",            tip: "Phishers hurry you so you don't stop and think." },
  password: { icon: "🔑", name: "Password Grab",       tip: "Real companies and teachers never ask for your password." },
  info:     { icon: "👤", name: "Info Grab",           tip: "Never send your birthday, address, phone number or photos to someone from an email." },
  faker:    { icon: "🎭", name: "The Faker",           tip: "Look-alike names and addresses pretend to be someone you trust." },
  prize:    { icon: "🎁", name: "Too Good to Be True", tip: "You can't win a contest you never entered." },
  secret:   { icon: "🤫", name: "Secret Keeper",       tip: "Anyone asking you to keep secrets from grown-ups is a red flag." },
  money:    { icon: "💳", name: "Money Ask",           tip: "Never send card numbers or gift card codes from an email." },
  scare:    { icon: "😱", name: "Scare Tactic",        tip: "Scary messages try to make you panic and click." },
  link:     { icon: "🔗", name: "Tricky Link",         tip: "Buttons and downloads can lead somewhere sneaky. Go there yourself instead." },
  other:    { icon: "🚩", name: "Sneaky Trick",        tip: "Something here doesn't add up." }
};

// The 9 cards in the Field Guide (in this order)
const TRICK_ORDER = ["rush", "password", "info", "faker", "prize", "secret", "money", "scare", "link"];

const TRICK_OF_SPOT = {
  // Captain Krabby
  "Krabby Prizez": "faker",
  "within 1 hour": "rush",
  "type your password": "password",
  "🎁 CLAIM MY COINS": "link",
  // Sunny Starfish
  "free-tablets4kids.win": "faker",
  "picked out of a million kids": "prize",
  "credit card number": "money",
  "Only 3 tablets left!": "rush",
  // Virus Shark
  "99 VIRUSES": "scare",
  "Dear User": "faker",
  "in 10 minutes": "rush",
  "download fix.exe": "link",
  // Zappy Eel
  "oceangames-support.co": "faker",
  "will be deleted at 5:00 today": "scare",
  "username and password": "password",
  "🔒 SAVE MY ACCOUNT": "link",
  // Professor Inky
  "freemail.biz": "faker",
  "I forgot my password": "password",
  "send me your school login": "password",
  "Don't tell anyone": "secret",
  // Dolly Dolphin
  "dolly.d0lphin": "faker",
  "sign in with your school email and password": "password",
  "send it to 10 friends or you get bad luck": "scare",
  "🐟 TAKE THE QUIZ": "link",
  // Principal Puffer
  "coralreef-schooI.com": "faker",
  "gift cards": "money",
  "keep this a secret": "secret",
  "Reply fast!": "rush",
  // BlockBay gift card (fake)
  "blockbay-giftcards.net": "faker",
  "800 FREE Bay Bucks": "prize",
  "BlockBay username and password": "password",
  "your birthday": "info",
  "🎁 UNLOCK MY BAY BUCKS": "link",
  // Lunch Lagoon (fake lunch money)
  "lunchlagoon-pay.co": "faker",
  "You will NOT get lunch tomorrow": "scare",
  "by 8:00 tonight": "rush",
  "card number and the 3 numbers on the back": "money",
  "💳 ADD MONEY NOW": "link",
  // Fake teacher pen pal form
  "kidzmail-free.com": "faker",
  "full name, home address, and phone number": "info",
  "a photo of your face": "info",
  "Don't ask your parents": "secret",
  // The hard one
  "{fakeDomain}": "faker",
  "sign in with your school account": "password",
  "📖 View assignment on {schoolDomain}": "link"
};

function trickFor(spotKey) {
  return TRICK_OF_SPOT[spotKey] || "other";
}
