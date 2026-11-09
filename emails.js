const emails = [
  {
    id: "free-coins",
    isPhish: true,
    avatar: "🦀",
    move: "wiggle",
    from: "Captain [[Krabby Prizez]] <win@krabby-prizez.biz>",
    subject: "YOU WON 10,000 FREE GAME COINS!!!",
    body: "Ahoy, lucky winner! You won 10,000 free game coins! Claim them [[within 1 hour]] or they sink to the bottom of the sea. Just click the treasure chest and [[type your password]] to get them. [[Have a fin-tastic day!]]",
    button: "[[🎁 CLAIM MY COINS]]",
    spots: {
      "Krabby Prizez": { flag: true, why: "Real companies spell their own name right." },
      "within 1 hour": { flag: true, why: "Scammers rush you so you don't stop and think." },
      "type your password": { flag: true, why: "No real game will EVER ask for your password." },
      "🎁 CLAIM MY COINS": { flag: true, why: "This button really goes to krabby-prizez.biz, not a real game site." },
      "Have a fin-tastic day!": { flag: false, why: "Just friendly. Not a trick by itself." }
    }
  },
  {
    id: "free-tablet",
    isPhish: true,
    avatar: "⭐",
    move: "spin",
    from: "Sunny Starfish Giveaways <sunny@[[free-tablets4kids.win]]>",
    subject: "Congrats! A FREE tablet is waiting for you",
    body: "[[Hi friend!]] You were [[picked out of a million kids]] to win a brand new tablet! It's totally free. We just need $1 for shipping. Ask a grown-up for their [[credit card number]] and type it in the box below. [[Only 3 tablets left!]]",
    button: "",
    spots: {
      "free-tablets4kids.win": { flag: true, why: "A strange web address is a big clue." },
      "Hi friend!": { flag: false, why: "A normal greeting. Not a trick by itself." },
      "picked out of a million kids": { flag: true, why: "You can't win a contest you never entered." },
      "credit card number": { flag: true, why: "Never type a grown-up's card number from an email." },
      "Only 3 tablets left!": { flag: true, why: "Fake 'hurry up' pressure to rush you." }
    }
  },
  {
    // SAFE: a real security alert. Compare it with the fake BlockBay gift card later!
    id: "blockbay-signin",
    isPhish: false,
    avatar: "🧱",
    move: "bounce",
    from: "BlockBay <no-reply@[[blockbay.com]]>",
    subject: "New sign-in to your BlockBay account",
    body: "Hi {nickname}, someone signed in to your BlockBay account on a new tablet today. [[If this was you, you don't need to do anything]]. If it wasn't you, [[ask a grown-up to help you]] [[open the BlockBay app yourself]] and change your password there. [[We will never ask for your password in an email.]]",
    button: "",
    spots: {
      "blockbay.com": { flag: false, why: "This is BlockBay's real address: just the name, spelled right, with nothing extra stuck on. Good sign!" },
      "If this was you, you don't need to do anything": { flag: false, why: "No countdown and no threats. A real alert gives you time to stop and think." },
      "ask a grown-up to help you": { flag: false, why: "Safe emails tell you to get help from a grown-up. Tricky ones tell you to keep secrets." },
      "open the BlockBay app yourself": { flag: false, why: "There's no link to click. You go to the app the way you always do. That's the safest move, even when an email looks real." },
      "We will never ask for your password in an email.": { flag: false, why: "Real companies say this because it's true. If an email asks for your password, it's a phish." }
    }
  },
  {
    id: "virus-shark",
    isPhish: true,
    avatar: "🦈",
    move: "bounce",
    from: "Virus Shark Alert <alert@shark-scan.xyz>",
    subject: "WARNING!!! Your tablet has [[99 VIRUSES]]!",
    body: "[[Dear User]], DANGER!!! We scanned [[your tablet]] and found 99 VIRUSES! Your tablet will break [[in 10 minutes]] unless you [[download fix.exe]] right now. Hurry!!!",
    button: "",
    spots: {
      "99 VIRUSES": { flag: true, why: "Scary messages try to make you panic so you click fast." },
      "Dear User": { flag: true, why: "Real messages usually use your name." },
      "your tablet": { flag: false, why: "Just the topic. Not a trick by itself." },
      "in 10 minutes": { flag: true, why: "A countdown is a trick to rush you." },
      "download fix.exe": { flag: true, why: "Never download a file from an email you weren't expecting." }
    }
  },
  {
    id: "zappy-eel",
    isPhish: true,
    avatar: "⚡",
    move: "wiggle",
    from: "Ocean Games Security <security@[[oceangames-support.co]]>",
    subject: "Your game account will be DELETED today",
    body: "Your game account broke the rules and [[will be deleted at 5:00 today]]. You will lose all your [[levels and friends]]! To keep your account, log in here and type your [[username and password]].",
    button: "[[🔒 SAVE MY ACCOUNT]]",
    spots: {
      "oceangames-support.co": { flag: true, why: "It looks close to a real name, but it's a fake address." },
      "will be deleted at 5:00 today": { flag: true, why: "Threats with a deadline are a trick to scare you." },
      "levels and friends": { flag: false, why: "Just describes the game. Not a trick by itself." },
      "username and password": { flag: true, why: "Real companies never ask for your password by email." },
      "🔒 SAVE MY ACCOUNT": { flag: true, why: "Go to the game yourself instead of clicking an email link." }
    }
  },
  {
    // PHISH: a scary fake lunch-money email. Compare it with the real one from the cafeteria!
    id: "lunch-alert",
    isPhish: true,
    avatar: "🥪",
    move: "wiggle",
    from: "Lunch Lagoon Payments <billing@[[lunchlagoon-pay.co]]>",
    subject: "Your lunch account is EMPTY",
    body: "Your school lunch account has $0.00. [[You will NOT get lunch tomorrow]] unless you add money [[by 8:00 tonight]]. Ask a grown-up for their [[card number and the 3 numbers on the back]], then type them in. [[Today's lunch is fish tacos!]]",
    button: "[[💳 ADD MONEY NOW]]",
    spots: {
      "lunchlagoon-pay.co": { flag: true, why: "Lunch money is handled by your school. A strange .co address you've never seen before isn't your school." },
      "You will NOT get lunch tomorrow": { flag: true, why: "Scaring you about missing lunch is a trick to make you act without thinking. A real school won't stop you from eating because of one email." },
      "by 8:00 tonight": { flag: true, why: "A tight deadline is there to rush you, so you don't have time to ask a grown-up." },
      "card number and the 3 numbers on the back": { flag: true, why: "Never type a grown-up's card number from an email. The 3 numbers on the back are extra secret. That's exactly what scammers want." },
      "Today's lunch is fish tacos!": { flag: false, why: "A normal lunch fact. Not a trick by itself, but scammers mix in real-sounding details to seem friendly." },
      "💳 ADD MONEY NOW": { flag: true, why: "Don't pay from an email button. A grown-up can check the lunch account by going to the school's real website themselves." }
    }
  },
  {
    id: "professor-inky",
    isPhish: true,
    avatar: "🐙",
    move: "float",
    from: "Professor Inky <inky.teacher4u@[[freemail.biz]]>",
    subject: "Quick favor, don't tell anyone!",
    body: "[[Hi there!]] It's your teacher. [[I forgot my password]], so please [[send me your school login]] so I can check your grades. [[Don't tell anyone]], it's our little secret!",
    button: "",
    spots: {
      "freemail.biz": { flag: true, why: "A real teacher emails from your school's address." },
      "Hi there!": { flag: false, why: "A normal greeting. Not a trick by itself." },
      "I forgot my password": { flag: true, why: "Teachers can get help from the school. They don't need yours." },
      "send me your school login": { flag: true, why: "Never share your login, even with someone you know." },
      "Don't tell anyone": { flag: true, why: "If someone asks you to keep a secret from grown-ups, tell a grown-up!" }
    }
  },
  {
    // SAFE: the REAL lunch reminder. Same topic as Lunch Lagoon, but calm and from the school.
    id: "lunch-safe",
    isPhish: false,
    avatar: "🍎",
    move: "float",
    from: "Ms. Clam, Cafeteria <cafeteria@[[{schoolDomain}]]>",
    subject: "Lunch account reminder",
    body: "[[Hi {nickname}!]] Your lunch account is [[getting low]]. Don't worry, [[you will still get lunch]] no matter what. Please [[give this note to your grown-up]]. They can add money [[on the school website or at the front office]]. Thank you!",
    button: "",
    spots: {
      "{schoolDomain}": { flag: false, why: "Your school's real address, spelled exactly right." },
      "Hi {nickname}!": { flag: false, why: "It uses the name you picked. That's nice, but always check the address too." },
      "getting low": { flag: false, why: "Calm words. It's just giving you information, not trying to make you panic." },
      "you will still get lunch": { flag: false, why: "It tells you not to worry. That's the opposite of a scare trick." },
      "give this note to your grown-up": { flag: false, why: "Money is a grown-up job. A safe email sends it to your grown-up instead of asking YOU to pay." },
      "on the school website or at the front office": { flag: false, why: "No link to click and no card numbers. Your grown-up goes to the real place themselves." }
    }
  },
  {
    id: "dolly-dolphin",
    isPhish: true,
    avatar: "🐬",
    move: "bounce",
    from: "Dolly Dolphin <[[dolly.d0lphin]]@quizfun-kids.net>",
    subject: "OMG take this quiz!!",
    body: "hey!! i found a quiz that tells you [[which sea creature you are]]!!! you have to [[sign in with your school email and password]] first. [[send it to 10 friends or you get bad luck]] lol",
    button: "[[🐟 TAKE THE QUIZ]]",
    spots: {
      "dolly.d0lphin": { flag: true, why: "Look closely: that's a zero, not an O. Someone is faking your friend." },
      "which sea creature you are": { flag: false, why: "Fun quizzes are normal. The trick is what it asks for." },
      "sign in with your school email and password": { flag: true, why: "A quiz never needs your password." },
      "send it to 10 friends or you get bad luck": { flag: true, why: "Chain messages spread scams to more kids." },
      "🐟 TAKE THE QUIZ": { flag: true, why: "It really goes to quizfun-kids.net, a site you don't know." }
    }
  },
  {
    // PHISH: a fake game gift card. BlockBay's real address is blockbay.com (see the safe BlockBay email).
    id: "blockbay-gift",
    isPhish: true,
    avatar: "🎁",
    move: "spin",
    from: "BlockBay Gifts <gifts@[[blockbay-giftcards.net]]>",
    subject: "🎁 A gift card is waiting for you!",
    body: "Someone sent you a gift card for [[800 FREE Bay Bucks]]! To unlock it, type your [[BlockBay username and password]] and [[your birthday]] in the box below. [[Happy building!]]",
    button: "[[🎁 UNLOCK MY BAY BUCKS]]",
    spots: {
      "blockbay-giftcards.net": { flag: true, why: "BlockBay's real address is just blockbay.com. Extra words like \"-giftcards.net\" are added to make a fake look official." },
      "800 FREE Bay Bucks": { flag: true, why: "A big free prize from someone you don't know is too good to be true." },
      "BlockBay username and password": { flag: true, why: "A real gift card never needs your password. Anyone who has it can take over your account." },
      "your birthday": { flag: true, why: "Your birthday is personal info. Scammers use it to guess passwords or pretend to be you." },
      "Happy building!": { flag: false, why: "Just a friendly goodbye. Not a trick by itself." },
      "🎁 UNLOCK MY BAY BUCKS": { flag: true, why: "This button goes to the fake address, not to BlockBay. Open the game yourself to check your gifts." }
    }
  },
  {
    id: "principal-puffer",
    isPhish: true,
    avatar: "🐡",
    move: "puff",
    from: "Principal Puffer <principal.puffer@[[coralreef-schooI.com]]>",
    subject: "I need your help with a surprise",
    body: "Hello! I'm [[planning a surprise]] for your teacher. Can you ask your parents to buy two $50 [[gift cards]] and email me the codes on the back? Please [[keep this a secret]] from your teacher. [[Reply fast!]]",
    button: "",
    spots: {
      "coralreef-schooI.com": { flag: true, why: "Sneaky! That's a capital I, not an L, and it ends in .com instead of .edu." },
      "planning a surprise": { flag: false, why: "Surprises are nice. The trick is what it asks for." },
      "gift cards": { flag: true, why: "Asking for gift card codes is one of the most common scams." },
      "keep this a secret": { flag: true, why: "Secrets from grown-ups are always a red flag." },
      "Reply fast!": { flag: true, why: "Rushing you is a trick." }
    }
  },
  {
    // PHISH: someone pretending to be YOUR teacher, asking for personal info.
    id: "teacher-form",
    isPhish: true,
    avatar: "📝",
    move: "float",
    from: "{teacherName} <class.teacher@[[kidzmail-free.com]]>",
    subject: "Fun class pen pal project!",
    body: "Hi class! We're starting a [[pen pal project]] with a school far away. Please reply with your [[full name, home address, and phone number]], plus [[a photo of your face]]. [[Don't ask your parents]], I want it to be a big surprise! Thanks, {teacherName}",
    button: "",
    spots: {
      "kidzmail-free.com": { flag: true, why: "It shows your teacher's name, but anyone can type a name. Your real teacher emails from your school's address." },
      "pen pal project": { flag: false, why: "Pen pals are a real, fun thing. The trick is what the email asks you to send." },
      "full name, home address, and phone number": { flag: true, why: "This is private info. Your real teacher already has it from the school office and would never ask you to email it." },
      "a photo of your face": { flag: true, why: "Never send photos of yourself to someone from an email. Photos are personal info too." },
      "Don't ask your parents": { flag: true, why: "Anyone who tells you to keep things from your grown-ups is a big red flag. Tell a grown-up right away!" }
    }
  },
  {
    id: "bubbles-library",
    isPhish: false,
    avatar: "🐠",
    move: "float",
    from: "Bubbles the Librarian <library@[[{schoolDomain}]]>",
    subject: "Your book is due Friday",
    body: "[[Hi {nickname}!]] Just a reminder that \"The Deep Blue Mystery\" is [[due back on Friday]]. You can drop it in the return bin by the front door. [[No need to reply]]. [[Happy reading!]]",
    button: "",
    spots: {
      "{schoolDomain}": { flag: false, why: "Your school's real address. Good sign!" },
      "Hi {nickname}!": { flag: false, why: "It uses the name you picked." },
      "due back on Friday": { flag: false, why: "A normal reminder that isn't rushing or scaring you." },
      "No need to reply": { flag: false, why: "It doesn't ask for anything secret." },
      "Happy reading!": { flag: false, why: "Just friendly. Nothing sneaky here." }
    }
  },
  {
    id: "coach-shelly",
    isPhish: false,
    avatar: "🐢",
    move: "float",
    from: "Coach Shelly <coach.shelly@[[{schoolDomain}]]>",
    subject: "Swim practice moved to Thursday",
    body: "Hi team! Because of the storm, swim practice is [[moved from Tuesday to Thursday]] at 4:00. Same pool, same time to arrive. [[Ask your grown-up]] if you have questions. [[See you there!]]",
    button: "",
    spots: {
      "{schoolDomain}": { flag: false, why: "The real school address." },
      "moved from Tuesday to Thursday": { flag: false, why: "Normal news with a reason. No threats." },
      "Ask your grown-up": { flag: false, why: "Safe messages tell you to talk to grown-ups, not hide things." },
      "See you there!": { flag: false, why: "Friendly and normal." }
    }
  },
  {
    id: "seaside-games",
    isPhish: false,
    avatar: "🐚",
    move: "spin",
    from: "Seaside Games <news@[[seasidegames.com]]>",
    subject: "New level: Coral Caves is here!",
    body: "Hi {nickname}! A new level called Coral Caves is now in the game. [[Open the game app like you normally do]] to play it. [[You don't need to do anything else]]. [[We'll never ask for your password]] by email.",
    button: "",
    spots: {
      "seasidegames.com": { flag: false, why: "Matches the game's real name, spelled right." },
      "Open the game app like you normally do": { flag: false, why: "It doesn't make you click a link. You go there yourself." },
      "You don't need to do anything else": { flag: false, why: "No rushing, no deadline." },
      "We'll never ask for your password": { flag: false, why: "Real companies say this." }
    }
  },
  {
    id: "the-hard-one",
    isPhish: true,
    avatar: "🐳",
    move: "float",
    from: "{teacherName} <classpage@[[{fakeDomain}]]>",
    subject: "New reading assignment posted",
    body: "[[Hi {nickname}]], I posted this week's reading assignment on our class page. Please [[sign in with your school account]] to see it [[before class on Monday]]. Thanks, and [[have a great weekend!]] {teacherName}",
    button: "[[📖 View assignment on {schoolDomain}]]",
    spots: {
      "{fakeDomain}": { flag: true, why: "Look letter by letter. There's one extra letter, so it's not your real school address." },
      "Hi {nickname}": { flag: false, why: "Your name is fine, but it doesn't prove the email is real. Scammers can know your name." },
      "sign in with your school account": { flag: true, why: "Don't sign in from an email link. Open your class page yourself, the way you usually do." },
      "before class on Monday": { flag: false, why: "A normal deadline. No rushing or scaring." },
      "have a great weekend!": { flag: false, why: "Friendly and normal. The trick is hidden in the address and the link." },
      "📖 View assignment on {schoolDomain}": { flag: true, why: "The button says your school, but it really goes to {fakeDomain}. Words on a button can lie." }
    }
  }
];