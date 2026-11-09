/* =========================================================
   characters.js: animated SVG sea characters for Phish Finder

   HOW TO USE (in play.html):
     const svg = makeCharacter("free-coins");   // an <svg> element (or null)
     someCircle.append(svg);
     characterReact(svg, "happy");              // bounce + big smile
     characterReact(svg, "oops");               // shake + worried face

   Each entry in `characters` is a function that returns an SVG
   string. Every character is drawn on the same 120 x 120 grid
   (viewBox="0 0 120 120"), so they all scale cleanly into any
   size circle. Each moving part is its own <g> group with a class,
   and the CSS at the bottom of this file animates those classes.
   ========================================================= */

const characters = (function () {
  const LINE = "#16385a";            // outline color for every character
  const SW = 2.6;                    // outline thickness
  const O = `stroke="${LINE}" stroke-width="${SW}"`;   // shortcut for "outlined"

  // ---------- SHARED BUILDING BLOCKS ----------
  // Using the same eyes, mouths and cheeks for everyone keeps the
  // style consistent and makes the face reactions work everywhere.

  // An eye at (cx, cy) with radius r. side = "l" or "r" (which way the
  // worried eyebrow tilts). Contains three versions of the eye:
  //   .cc-eye-open   the normal eye (squashes flat to blink)
  //   .cc-eye-happy  a "^" arc shown when happy
  //   .cc-brow       a worried eyebrow shown on "oops"
  function eye(cx, cy, r, side) {
    const by = cy - r * 1.3;
    const brow = side === "l"
      ? `M${cx - r} ${by + 1} L${cx + r * 0.8} ${by - 4}`
      : `M${cx - r * 0.8} ${by - 4} L${cx + r} ${by + 1}`;
    return `
      <g class="cc-eye">
        <g class="cc-eye-open" style="transform-origin:${cx}px ${cy}px">
          <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.12}" fill="#fff" ${O}/>
          <g class="cc-pupil" style="transform-origin:${cx}px ${cy + 1}px">
            <circle cx="${cx}" cy="${cy + 1}" r="${r * 0.58}" fill="${LINE}"/>
            <circle cx="${cx + r * 0.22}" cy="${cy - r * 0.16}" r="${r * 0.22}" fill="#fff"/>
          </g>
        </g>
        <path class="cc-eye-happy" d="M${cx - r} ${cy + 2} Q${cx} ${cy - r * 1.3} ${cx + r} ${cy + 2}" fill="none" stroke="${LINE}" stroke-width="${SW + 0.4}" stroke-linecap="round"/>
        <path class="cc-brow" d="${brow}" fill="none" stroke="${LINE}" stroke-width="${SW}" stroke-linecap="round"/>
      </g>`;
  }

  // A mouth centered at (x, y), w wide. Three versions again:
  // normal smile, big open "happy" grin, wobbly "oops" mouth.
  // `custom` lets a character swap in its own normal mouth (the shark).
  function mouth(x, y, w, custom) {
    const h = w / 2;
    const normal = custom ||
      `<path class="cc-m-norm" d="M${x - h} ${y} Q${x} ${y + w * 0.55} ${x + h} ${y}" fill="none" stroke="${LINE}" stroke-width="${SW}" stroke-linecap="round"/>`;
    return `
      ${normal}
      <g class="cc-m-happy">
        <path d="M${x - h * 1.2} ${y - 1} Q${x} ${y + w * 1.05} ${x + h * 1.2} ${y - 1} Z" fill="#b8243f" ${O}/>
        <ellipse cx="${x}" cy="${y + w * 0.34}" rx="${w * 0.24}" ry="${w * 0.1}" fill="#ff8aa0"/>
      </g>
      <path class="cc-m-oops" d="M${x - h} ${y + 2} q${w / 8} -3.5 ${w / 4} 0 t${w / 4} 0 t${w / 4} 0 t${w / 4} 0" fill="none" stroke="${LINE}" stroke-width="${SW}" stroke-linecap="round"/>`;
  }

  // Rosy cheeks
  const cheeks = list => list.map(([x, y]) =>
    `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.2" fill="#ff7f9e" opacity=".5"/>`).join("");

  // A 4-point twinkle star
  function sparkle(x, y, s, cls = "") {
    return `<path class="${cls}" style="transform-origin:${x}px ${y}px" d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z" fill="#fff4a8" stroke="#e8a400" stroke-width="1.4" stroke-linejoin="round"/>`;
  }

  // Extras every character gets: a sweat drop (oops) and sparkles (happy)
  function extras(sweatX, sweatY, sparkles) {
    const x = sweatX, y = sweatY;
    return `
      <path class="cc-oops-only cc-sweat" style="transform-origin:${x}px ${y}px" d="M${x} ${y - 7} C${x + 6} ${y + 1} ${x + 5} ${y + 7} ${x} ${y + 7} C${x - 5} ${y + 7} ${x - 6} ${y + 1} ${x} ${y - 7} Z" fill="#a8e3ff" stroke="${LINE}" stroke-width="1.8"/>
      <g class="cc-happy-only">${sparkles.map(([sx, sy, s]) => sparkle(sx, sy, s)).join("")}</g>`;
  }

  // A thick outlined "noodle" (legs, arms, tentacles): a dark wide
  // stroke underneath and a colored narrower stroke on top.
  function limb(d, color, w) {
    return `<path d="${d}" fill="none" stroke="${LINE}" stroke-width="${w + SW * 2}" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  // Wrap the parts in an <svg>. .cc-root is the layer that bounces
  // or shakes for reactions; everything else animates inside it.
  function svg(id, name, inner) {
    return `<svg class="cc cc-${id}" viewBox="0 0 120 120" role="img" aria-label="${name}" xmlns="http://www.w3.org/2000/svg">
      <g class="cc-root" stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;
  }

  // ---------- THE CHARACTERS ----------
  return {

    // 🦀 Captain Krabby: claws snap, legs scuttle, eye stalks bob
    "free-coins": () => {
      const R = "#ff6b4a", D = "#e2482c";
      const legsL = ["M32 82 Q18 82 14 94", "M34 88 Q22 92 20 104", "M40 93 Q32 100 32 110"];
      const legsR = ["M88 82 Q102 82 106 94", "M86 88 Q98 92 100 104", "M80 93 Q88 100 88 110"];
      return svg("free-coins", "Captain Krabby", `
        <g class="krab-legs" style="transform-origin:38px 86px">${legsL.map(d => limb(d, R, 5)).join("")}</g>
        <g class="krab-legs krab-legs-r" style="transform-origin:82px 86px">${legsR.map(d => limb(d, R, 5)).join("")}</g>

        <g class="krab-arm" style="transform-origin:38px 70px">
          ${limb("M40 72 Q24 68 22 54", R, 6)}
          <path d="M9 46 A12 12 0 0 0 33 46 Z" fill="${R}" ${O}/>
          <path class="krab-claw-l" style="transform-origin:32px 44px" d="M9 43 A12 12 0 0 1 33 43 Z" fill="${R}" ${O}/>
        </g>
        <g class="krab-arm krab-arm-r" style="transform-origin:82px 70px">
          ${limb("M80 72 Q96 68 98 54", R, 6)}
          <path d="M87 46 A12 12 0 0 0 111 46 Z" fill="${R}" ${O}/>
          <path class="krab-claw-r" style="transform-origin:88px 44px" d="M87 43 A12 12 0 0 1 111 43 Z" fill="${R}" ${O}/>
        </g>

        <g class="krab-stalk" style="transform-origin:48px 60px">
          ${limb("M48 62 L43 38", R, 4)}
          ${eye(42, 32, 7.5, "l")}
        </g>
        <g class="krab-stalk krab-stalk-r" style="transform-origin:72px 60px">
          ${limb("M72 62 L77 38", R, 4)}
          ${eye(78, 32, 7.5, "r")}
        </g>

        <ellipse cx="60" cy="76" rx="34" ry="23" fill="${R}" ${O}/>
        <ellipse cx="60" cy="86" rx="21" ry="9" fill="#ffa185"/>
        <circle cx="40" cy="70" r="3" fill="${D}"/><circle cx="80" cy="68" r="2.6" fill="${D}"/><circle cx="85" cy="78" r="2" fill="${D}"/>

        <path d="M49 54 Q48 40 60 39 Q72 40 71 54 Z" fill="#fff" ${O}/>
        <path d="M49.5 47 L70.5 47 L71 52 L49 52 Z" fill="#1d4e89"/>
        <path d="M44 55 Q60 49 76 55 Q60 60 44 55 Z" fill="#1d4e89" ${O}/>
        <circle cx="60" cy="44" r="3" fill="#ffc93c" stroke="${LINE}" stroke-width="1.4"/>

        ${mouth(60, 72, 14)}
        ${cheeks([[44, 76], [76, 76]])}
        ${extras(92, 56, [[14, 20, 6], [106, 18, 7]])}
      `);
    },

    // ⭐ Sunny the Starfish: arms wave one after another, sparkles twinkle
    "free-tablet": () => {
      const Y = "#ffb63b", Lt = "#ffdb8a";
      const arms = [0, 72, 144, 216, 288].map((a, i) => `
        <g transform="rotate(${a} 60 64)">
          <g class="sunny-arm" style="transform-origin:60px 54px; animation-delay:${i * 0.28}s">
            <path d="M48 60 C51 38 55 24 60 21 C65 24 69 38 72 60 Z" fill="${Y}" ${O}/>
            <circle cx="60" cy="33" r="2.6" fill="${Lt}"/><circle cx="58" cy="43" r="2.2" fill="${Lt}"/>
          </g>
        </g>`).join("");
      return svg("free-tablet", "Sunny the Starfish", `
        ${sparkle(16, 22, 6, "sunny-spark")}
        ${sparkle(105, 30, 7, "sunny-spark sunny-spark-2")}
        ${sparkle(104, 102, 5, "sunny-spark sunny-spark-3")}
        ${arms}
        <circle cx="60" cy="64" r="19" fill="${Y}"/>
        ${eye(52, 60, 6, "l")}${eye(68, 60, 6, "r")}
        ${mouth(60, 70, 10)}
        ${cheeks([[46, 69], [74, 69]])}
        ${extras(86, 44, [[28, 92, 6], [96, 82, 5]])}
      `);
    },

    // 🦈 Virus Shark: tail swishes, fin bobs, mouth chomps
    "virus-shark": () => {
      const B = "#6aa8ec", Bd = "#4d86cf";
      const germ = (x, y, cls) => `
        <g class="shark-germ ${cls}" style="transform-origin:${x}px ${y}px">
          <path d="M${x - 8} ${y} L${x + 8} ${y} M${x} ${y - 8} L${x} ${y + 8} M${x - 6} ${y - 6} L${x + 6} ${y + 6} M${x - 6} ${y + 6} L${x + 6} ${y - 6}" stroke="${LINE}" stroke-width="2"/>
          <circle cx="${x}" cy="${y}" r="5.5" fill="#7ed957" stroke="${LINE}" stroke-width="2"/>
          <circle cx="${x - 2}" cy="${y - 1}" r="1" fill="${LINE}"/><circle cx="${x + 2}" cy="${y - 1}" r="1" fill="${LINE}"/>
        </g>`;
      const chomp = `
        <g class="cc-m-norm shark-mouth" style="transform-origin:24px 68px">
          <path d="M16 68 Q24 67 32 68 Q24 80 16 68 Z" fill="#8a2140" ${O}/>
          <path d="M18.5 68.6 L20.5 72 L22.5 68.6 Z M23.5 68.6 L25.5 72 L27.5 68.6 Z" fill="#fff"/>
        </g>`;
      return svg("virus-shark", "Virus Shark", `
        ${germ(102, 18, "")}
        ${germ(16, 26, "shark-germ-2")}
        <g class="shark-fin" style="transform-origin:60px 44px">
          <path d="M48 42 C52 30 58 23 68 20 C66 28 66 35 72 42 Z" fill="${Bd}" ${O}/>
        </g>
        <g class="shark-tail" style="transform-origin:90px 63px">
          <path d="M88 60 C96 52 103 44 112 37 C108 52 108 70 113 88 C104 80 97 72 88 67 Z" fill="${Bd}" ${O}/>
        </g>
        <path d="M10 66 C14 46 38 36 62 39 C78 41 90 52 96 62 C90 72 78 83 60 85 C38 87 16 82 10 66 Z" fill="${B}" ${O}/>
        <path d="M18 73 C32 80 54 81 72 77 C58 82 36 83 22 79 Z" fill="#eef8ff"/>
        <path d="M64 56 q-3 6 0 12 M70 55 q-3 6 0 12 M76 57 q-3 5 0 10" fill="none" stroke="${Bd}" stroke-width="2.4"/>
        <g class="shark-pec" style="transform-origin:54px 78px">
          <path d="M50 76 C48 86 42 93 34 96 C44 94 54 88 60 80 Z" fill="${Bd}" ${O}/>
        </g>
        ${eye(30, 54, 7, "l")}${eye(46, 52, 6, "r")}
        ${mouth(24, 69, 13, chomp)}
        ${cheeks([[40, 66]])}
        ${extras(14, 46, [[26, 100, 6], [88, 102, 6]])}
      `);
    },

    // ⚡ Zappy the Eel: body waves like an S, sparks flicker
    "zappy-eel": () => {
      const G = "#3fcfb4", Yl = "#ffe14d";
      // [x, y, radius] for each body segment, head first
      const segs = [[24, 60, 20], [43, 61, 16], [58, 61, 14], [71, 60, 12.5], [83, 60, 11], [94, 60, 9.5], [103, 60, 8], [110, 60, 6.5]];
      const last = segs.length - 1;
      // Layer 1: outlines (drawn first so they sit behind every fill)
      const outlines = segs.map(([x, y, r], i) => `
        <g class="eel-seg" style="--i:${i}">
          ${i === last ? `<path d="M110 60 L119 50 Q115 60 119 70 Z" fill="${G}" ${O}/>` : ""}
          <circle cx="${x}" cy="${y}" r="${r + SW}" fill="${LINE}"/>
        </g>`).join("");
      // Layer 2: colored fills, tail first so the head ends up on top
      const fills = segs.map(([x, y, r], i) => `
        <g class="eel-seg" style="--i:${i}">
          <circle cx="${x}" cy="${y}" r="${r}" fill="${G}"/>
          ${i > 0 ? `<path d="M${x - r * 0.6} ${y + r * 0.35} Q${x} ${y + r * 0.75} ${x + r * 0.6} ${y + r * 0.35}" fill="none" stroke="#2aa58f" stroke-width="2"/>` : ""}
          ${i === 0 ? `
            ${eye(17, 54, 6.5, "l")}${eye(31, 53, 6, "r")}
            ${mouth(24, 66, 11)}
            ${cheeks([[12, 63], [36, 63]])}` : ""}
        </g>`).reverse().join("");
      const bolt = (x, y, cls) =>
        `<path class="eel-spark ${cls}" d="M${x} ${y} l-6 10 h6 l-4 10 l11 -13 h-6 l5 -7 z" fill="${Yl}" stroke="${LINE}" stroke-width="1.6"/>`;
      return svg("zappy-eel", "Zappy the Eel", `
        ${bolt(56, 18, "")}${bolt(96, 26, "eel-spark-2")}${bolt(72, 88, "eel-spark-3")}
        ${outlines}${fills}
        ${extras(44, 34, [[10, 30, 6], [110, 94, 6]])}
      `);
    },

    // 🐙 Professor Inky: tentacles curl in a wave, glasses bob
    "professor-inky": () => {
      const P = "#b57cf0", Pl = "#dcbdff";
      const tents = [[36, -1], [48, -1], [60, 1], [72, 1], [84, 1]].map(([x, s], i) => `
        <g class="inky-tent" style="transform-origin:${x}px 66px; animation-delay:${i * 0.22}s">
          ${limb(`M${x} 64 C${x + s * 10} 80 ${x - s * 8} 90 ${x + s * 4} 101 Q${x + s * 9} 108 ${x + s * 11} 100`, P, 9)}
        </g>`).join("");
      return svg("professor-inky", "Professor Inky", `
        ${tents}
        <ellipse cx="60" cy="46" rx="31" ry="28" fill="${P}" ${O}/>
        <circle cx="38" cy="34" r="4" fill="${Pl}"/><circle cx="82" cy="32" r="3" fill="${Pl}"/><circle cx="86" cy="46" r="2.4" fill="${Pl}"/>

        <path d="M47 18 L47 25 Q60 30 73 25 L73 18 Z" fill="#2d2b55" ${O}/>
        <path d="M37 15 L60 7 L83 15 L60 23 Z" fill="#2d2b55" ${O}/>
        <g class="inky-tassel" style="transform-origin:60px 15px">
          <path d="M60 15 Q74 15 78 25" fill="none" stroke="#ffc93c" stroke-width="2"/>
          <circle cx="78" cy="27" r="2.6" fill="#ffc93c" stroke="${LINE}" stroke-width="1.2"/>
        </g>

        ${eye(48, 48, 6.5, "l")}${eye(72, 48, 6.5, "r")}
        <g class="inky-glasses">
          <circle cx="48" cy="48" r="11" fill="#dff6ff" fill-opacity=".3" ${O}/>
          <circle cx="72" cy="48" r="11" fill="#dff6ff" fill-opacity=".3" ${O}/>
          <path d="M59 47 Q60 44 61 47 M37 46 L30 42 M83 46 L90 42" fill="none" ${O}/>
        </g>
        ${mouth(60, 63, 11)}
        ${cheeks([[39, 62], [81, 62]])}
        ${extras(94, 28, [[16, 26, 6], [106, 70, 6]])}
      `);
    },

    // 🐬 Dolly Dolphin: leaps in an arc, flippers flap
    "dolly-dolphin": () => {
      const B = "#7cc6f4", Bd = "#5aa9e0";
      return svg("dolly-dolphin", "Dolly Dolphin", `
        <path class="dolly-water" d="M0 110 q8 -6 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#fff" stroke-width="3" opacity=".85"/>
        <g class="dolly-leap" style="transform-origin:60px 150px">
          <g class="dolly-flip dolly-flip-back" style="transform-origin:48px 76px">
            <path d="M50 76 C46 86 40 92 33 94 C40 86 42 80 44 74 Z" fill="${Bd}" ${O}/>
          </g>
          <g class="dolly-tail" style="transform-origin:32px 80px">
            <path d="M34 78 C26 80 18 78 10 72 C14 80 16 86 14 94 C20 92 26 88 36 84 Z" fill="${Bd}" ${O}/>
          </g>
          <path d="M52 44 C54 34 60 28 68 26 C66 34 66 40 70 46 Z" fill="${Bd}" ${O}/>
          <ellipse cx="98" cy="44" rx="11" ry="6.5" transform="rotate(-22 98 44)" fill="${B}" ${O}/>
          <ellipse cx="60" cy="62" rx="34" ry="22" transform="rotate(-22 60 62)" fill="${B}" ${O}/>
          <ellipse cx="62" cy="70" rx="24" ry="9" transform="rotate(-22 62 70)" fill="#eaf8ff"/>
          <g class="dolly-flip" style="transform-origin:66px 73px">
            <path d="M64 72 C66 84 62 92 56 98 C66 94 74 86 74 74 Z" fill="${Bd}" ${O}/>
          </g>
          ${eye(76, 52, 6, "l")}${eye(89, 47, 5.5, "r")}
          ${mouth(90, 58, 9)}
          ${cheeks([[79, 62]])}
        </g>
        ${extras(104, 24, [[20, 24, 6], [104, 90, 6]])}
      `);
    },

    // 🐡 Principal Puffer: puffs up, spikes pop out, then deflates
    "principal-puffer": () => {
      const Y = "#ffd85e", Yd = "#f2b53a";
      const pt = (r, deg) => {
        const a = deg * Math.PI / 180;
        return `${(60 + r * Math.cos(a)).toFixed(1)} ${(60 + r * Math.sin(a)).toFixed(1)}`;
      };
      let spikes = "";
      for (let k = 0; k < 14; k++) {
        const a = k * (360 / 14) + 6;
        spikes += `<path d="M${pt(28, a - 8)} L${pt(41, a)} L${pt(28, a + 8)} Z" fill="${Yd}" stroke="${LINE}" stroke-width="2.2"/>`;
      }
      return svg("principal-puffer", "Principal Puffer", `
        <g class="puff-spikes" style="transform-origin:60px 60px">${spikes}</g>
        <g class="puff-body" style="transform-origin:60px 60px">
          <g class="puff-fin" style="transform-origin:30px 64px">
            <path d="M30 60 C20 54 14 58 14 64 C14 70 20 74 30 68 Z" fill="${Yd}" ${O}/>
          </g>
          <g class="puff-fin puff-fin-r" style="transform-origin:90px 64px">
            <path d="M90 60 C100 54 106 58 106 64 C106 70 100 74 90 68 Z" fill="${Yd}" ${O}/>
          </g>
          <circle cx="60" cy="60" r="31" fill="${Y}" ${O}/>
          <ellipse cx="60" cy="75" rx="20" ry="12" fill="#fff3c4"/>
          <circle cx="46" cy="38" r="2.4" fill="#e0a23a"/><circle cx="57" cy="33" r="2" fill="#e0a23a"/>
          <circle cx="70" cy="35" r="2.4" fill="#e0a23a"/><circle cx="78" cy="44" r="2" fill="#e0a23a"/>
          <path d="M55 82 L65 82 L63 88 L57 88 Z" fill="#e8453c" ${O}/>
          <path d="M57 88 L63 88 L67 102 L60 108 L53 102 Z" fill="#e8453c" ${O}/>
          <path d="M56 94 L64.5 92 M55 100 L66 98" stroke="#ffc3bd" stroke-width="2"/>
          ${eye(49, 54, 7.5, "l")}${eye(71, 54, 7.5, "r")}
          ${mouth(60, 69, 9)}
          ${cheeks([[40, 66], [80, 66]])}
        </g>
        ${extras(96, 26, [[16, 20, 6], [106, 22, 6]])}
      `);
    },

    // 🐠 Bubbles the Librarian: fins flutter, bubbles rise, page flips
    "bubbles-library": () => {
      const T = "#36c2d6", Fy = "#ffd04d";
      const page = side => {
        // right page; flip it with scaleX(-1) to get the left page
        const lines = `<path d="M65 88 Q74 87 84 86 M65 93 Q74 92 84 91 M65 98 Q74 97 84 96" fill="none" stroke="#b9c7d6" stroke-width="1.5"/>`;
        return `<g ${side === "l" ? `transform="matrix(-1 0 0 1 120 0)"` : ""}>
          <path d="M89 82 Q74 80 60 86 L60 106 Q74 101 89 102 Z" fill="#fffdf5" stroke="${LINE}" stroke-width="1.8"/>${lines}</g>`;
      };
      const bubble = (x, r, delay) =>
        `<circle class="bub-rise" style="transform-origin:${x}px 50px; animation-delay:${delay}s" cx="${x}" cy="50" r="${r}" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-width="2"/>`;
      return svg("bubbles-library", "Bubbles the Librarian", `
        ${bubble(18, 4, 0)}${bubble(24, 3, -1.1)}${bubble(14, 3.5, -2.2)}
        <g class="bub-tail" style="transform-origin:86px 54px">
          <path d="M86 52 C96 40 104 36 112 34 C108 46 108 58 112 70 C104 68 96 64 86 56 Z" fill="${Fy}" ${O}/>
        </g>
        <g class="bub-fin-top" style="transform-origin:58px 32px">
          <path d="M44 32 C48 20 60 16 72 20 C68 26 68 30 70 34 Z" fill="${Fy}" ${O}/>
        </g>
        <ellipse cx="56" cy="52" rx="34" ry="25" fill="${T}" ${O}/>
        <path d="M68 32 C73 42 73 62 68 72" fill="none" stroke="${Fy}" stroke-width="5"/>
        <path d="M80 37 C83 45 83 59 80 66" fill="none" stroke="${Fy}" stroke-width="4"/>

        <path d="M28 82 L60 87 L92 82 L92 104 L60 109 L28 104 Z" fill="#e8453c" ${O}/>
        ${page("l")}${page("r")}
        <g class="bub-page" style="transform-origin:60px 95px">${page("r")}</g>

        <g class="bub-fin" style="transform-origin:38px 72px">
          <path d="M36 70 C28 72 24 78 26 84 C32 82 36 78 40 74 Z" fill="${Fy}" ${O}/>
        </g>
        <g class="bub-fin bub-fin-r" style="transform-origin:78px 72px">
          <path d="M80 70 C88 72 92 78 90 84 C84 82 80 78 76 74 Z" fill="${Fy}" ${O}/>
        </g>
        ${eye(40, 48, 7, "l")}${eye(56, 46, 6.5, "r")}
        ${mouth(33, 61, 9)}
        ${cheeks([[46, 60]])}
        ${extras(92, 24, [[100, 16, 6], [12, 96, 5]])}
      `);
    },

    // 🐢 Coach Shelly: flippers paddle, head bobs, whistle tweets
    "coach-shelly": () => {
      const Sh = "#3fae6a", Shd = "#2b8a52", Sk = "#9fe07c";
      return svg("coach-shelly", "Coach Shelly", `
        <g class="shelly-flip" style="transform-origin:34px 70px">
          <path d="M36 66 C22 62 12 66 8 74 C16 78 26 78 38 76 Z" fill="${Sk}" ${O}/>
        </g>
        <g class="shelly-flip shelly-flip-r" style="transform-origin:86px 70px">
          <path d="M84 66 C98 62 108 66 112 74 C104 78 94 78 82 76 Z" fill="${Sk}" ${O}/>
        </g>
        <g class="shelly-foot" style="transform-origin:42px 94px">
          <path d="M38 94 C32 100 32 106 38 108 C44 106 46 100 44 94 Z" fill="${Sk}" ${O}/>
        </g>
        <g class="shelly-foot shelly-foot-r" style="transform-origin:78px 94px">
          <path d="M82 94 C88 100 88 106 82 108 C76 106 74 100 76 94 Z" fill="${Sk}" ${O}/>
        </g>
        <ellipse cx="60" cy="80" rx="34" ry="24" fill="${Sh}" ${O}/>
        <path d="M50 72 L60 65 L70 72 L67 84 L53 84 Z" fill="${Shd}"/>
        <path d="M38 70 L50 72 M70 72 L82 70 M53 84 L46 98 M67 84 L74 98 M30 84 L42 86 M90 84 L78 86" fill="none" stroke="${Shd}" stroke-width="2.6"/>

        <g class="shelly-head" style="transform-origin:60px 64px">
          <circle cx="60" cy="46" r="22" fill="${Sk}" ${O}/>
          <path d="M38 42 C38 27 49 21 60 21 C71 21 82 27 82 42 Z" fill="#e8453c" ${O}/>
          <path d="M70 41 C78 38 88 39 96 44 C88 47 78 46 70 44 Z" fill="#c72f27" ${O}/>
          <circle cx="60" cy="21" r="2.6" fill="#fff" stroke="${LINE}" stroke-width="1.4"/>
          ${eye(51, 51, 6, "l")}${eye(69, 51, 6, "r")}
          ${mouth(55, 60, 9)}
          ${cheeks([[44, 58], [76, 58]])}
          <g class="shelly-whistle" style="transform-origin:61px 61px">
            <rect x="60" y="58.5" width="5" height="4" rx="1" fill="#ffd23f" stroke="${LINE}" stroke-width="1.8"/>
            <rect x="64" y="56" width="14" height="9" rx="4.5" fill="#ffd23f" stroke="${LINE}" stroke-width="1.8"/>
            <circle cx="73" cy="60.5" r="1.8" fill="${LINE}"/>
          </g>
          <path class="shelly-tweet" style="transform-origin:82px 60px" d="M81 53 L87 49 M82 60.5 L89 60.5 M81 68 L87 72" fill="none" stroke="#ff7a1a" stroke-width="2.6"/>
        </g>
        ${extras(28, 34, [[14, 22, 6], [104, 100, 5]])}
      `);
    },

    // 🐚 Seashell mascot: shell opens and closes, pearl shines
    "seaside-games": () => {
      const Pk = "#ff9ebb", Pkd = "#ef7aa0";
      return svg("seaside-games", "Shelby the Seashell", `
        <path d="M22 72 Q60 56 98 72 Q60 86 22 72 Z" fill="#c2456e"/>
        <circle cx="60" cy="67" r="9" fill="#fff4fb" stroke="${LINE}" stroke-width="2"/>
        <circle cx="57" cy="64" r="3" fill="#fff"/>
        ${sparkle(70, 62, 5, "shell-shine")}
        <path d="M18 72 C18 96 38 108 60 108 C82 108 102 96 102 72 Z" fill="${Pk}" ${O}/>
        ${eye(48, 85, 6.5, "l")}${eye(72, 85, 6.5, "r")}
        ${mouth(60, 95, 10)}
        ${cheeks([[37, 93], [83, 93]])}
        <g class="shell-top" style="transform-origin:60px 72px">
          <path d="M18 72 Q14 56 24 46 Q24 36 36 32 Q40 22 52 24 Q60 16 68 24 Q80 22 84 32 Q96 36 96 46 Q106 56 102 72 Z" fill="${Pk}" ${O}/>
          <path d="M60 70 L30 47 M60 70 L44 32 M60 70 L60 26 M60 70 L76 32 M60 70 L90 47" fill="none" stroke="${Pkd}" stroke-width="2.4"/>
          <ellipse cx="60" cy="71" rx="8" ry="3.5" fill="${Pkd}"/>
        </g>
        ${extras(106, 86, [[14, 22, 6], [106, 22, 6]])}
      `);
    },

    // 🐳 Ms. Whale the teacher: tail flukes wave, water spout puffs
    "the-hard-one": () => {
      const B = "#5b9cf0", Bd = "#3f7fd6";
      return svg("the-hard-one", "Whale Teacher", `
        <g class="whale-spout" style="transform-origin:38px 32px">
          <path d="M38 32 C36 24 33 19 28 15 M38 32 C40 24 43 19 48 15" fill="none" stroke="#9fdcff" stroke-width="4"/>
          <circle cx="27" cy="13" r="3.5" fill="#c8eeff" stroke="${LINE}" stroke-width="1.5"/>
          <circle cx="49" cy="13" r="3.5" fill="#c8eeff" stroke="${LINE}" stroke-width="1.5"/>
          <circle cx="38" cy="9" r="4" fill="#c8eeff" stroke="${LINE}" stroke-width="1.5"/>
        </g>
        <g class="whale-tail" style="transform-origin:90px 66px">
          <path d="M86 60 C96 58 100 50 101 40 L108 40 C108 54 100 68 88 72 Z" fill="${B}" ${O}/>
          <path d="M104 42 C96 36 90 30 92 24 C98 26 102 30 104 34 C106 28 112 24 118 24 C118 32 112 38 104 42 Z" fill="${Bd}" ${O}/>
        </g>
        <path d="M8 66 C8 44 30 32 56 33 C78 34 94 48 94 64 C94 80 80 90 56 90 C30 90 8 84 8 66 Z" fill="${B}" ${O}/>
        <path d="M15 75 C28 86 64 89 82 80 C66 84 34 83 16 72 Z" fill="#e3f3ff"/>
        <path d="M30 80 L31 84 M42 82 L42.5 86 M54 83 L54 87 M66 82 L65.5 86" stroke="#b9daf5" stroke-width="2"/>
        <g class="whale-fin" style="transform-origin:54px 80px">
          <path d="M50 78 C46 88 38 94 30 96 C40 98 52 92 58 82 Z" fill="${Bd}" ${O}/>
        </g>
        <circle cx="65" cy="30" r="6" fill="#ff5a5a" ${O}/>
        <path d="M65 24 L66 19" stroke="#6b3e1e" stroke-width="2"/>
        <path d="M66 20 Q71 16 73 20 Q69 23 66 20 Z" fill="#4cc36b" stroke="${LINE}" stroke-width="1.2"/>
        ${eye(26, 56, 7, "l")}${eye(42, 54, 6.5, "r")}
        ${mouth(25, 69, 13)}
        ${cheeks([[15, 64], [42, 67]])}
        ${extras(84, 40, [[14, 24, 6], [106, 102, 6]])}
      `);
    },

    // 👑 The Phish King: the villain on the teacher screen (an anglerfish)
    "phish-king": () => {
      const K = "#5e54c7", Kl = "#8f86e6";
      const grin = `
        <g class="cc-m-norm">
          <path d="M28 76 Q46 84 66 75 Q48 98 28 76 Z" fill="#3a1f4f" ${O}/>
          <path d="M33 79 L36 74 L39 81 Z M45 84 L48 77 L51 84 Z M57 81 L60 75 L63 80 Z" fill="#fff" stroke="${LINE}" stroke-width="1.2"/>
        </g>`;
      return svg("phish-king", "The Phish King", `
        <g class="king-tail" style="transform-origin:92px 66px">
          <path d="M90 60 C102 52 108 48 116 44 C112 58 112 74 116 88 C108 84 102 80 90 72 Z" fill="${K}" ${O}/>
        </g>
        <g class="king-lure" style="transform-origin:54px 38px">
          ${limb("M54 38 C50 20 36 12 24 16", "#4a3fa8", 3)}
          <circle class="king-glow" style="transform-origin:22px 18px" cx="22" cy="18" r="12" fill="#fff36b" opacity=".35"/>
          <circle cx="22" cy="18" r="6" fill="#fff36b" ${O}/>
        </g>
        <ellipse cx="58" cy="66" rx="38" ry="32" fill="${K}" ${O}/>
        <ellipse cx="62" cy="82" rx="24" ry="12" fill="${Kl}"/>
        <circle cx="76" cy="50" r="3" fill="${Kl}"/><circle cx="84" cy="62" r="2.4" fill="${Kl}"/><circle cx="70" cy="40" r="2" fill="${Kl}"/>
        <g class="king-fin" style="transform-origin:62px 92px">
          <path d="M58 92 C56 102 50 108 44 110 C54 110 64 104 68 94 Z" fill="${Kl}" ${O}/>
        </g>
        <g class="king-crown" style="transform-origin:68px 36px">
          <path d="M54 37 L56 21 L62 30 L68 16 L74 30 L80 21 L82 37 Z" fill="#ffc93c" ${O}/>
          <circle cx="68" cy="30" r="2.6" fill="#e8453c"/><circle cx="59" cy="33" r="2" fill="#36c2d6"/><circle cx="77" cy="33" r="2" fill="#36c2d6"/>
        </g>
        ${eye(44, 58, 7.5, "l")}${eye(62, 56, 7, "r")}
        <path class="king-brow" d="M35 47 L51 51 M55 49 L70 44" fill="none" stroke="${LINE}" stroke-width="3.2" stroke-linecap="round"/>
        ${mouth(46, 77, 18, grin)}
        ${cheeks([[32, 68], [74, 68]])}
        ${extras(94, 40, [[12, 40, 6], [104, 100, 6]])}
      `);
    },

    // 🦦 Ollie the Otter: the game's guide (not an email sender)
    "ollie": () => {
      const Br = "#a8714b", Brd = "#8a5636", Cr = "#f6dcbc";
      const otterMouth = `<path class="cc-m-norm" d="M54 62 Q57 66 60 62 Q63 66 66 62" fill="none" stroke="${LINE}" stroke-width="${SW}"/>`;
      return svg("ollie", "Ollie the Otter", `
        <g class="ollie-float">
          <path d="M34 106 C32 88 42 76 60 76 C78 76 88 88 86 106 C80 112 40 112 34 106 Z" fill="${Br}" ${O}/>
          <ellipse cx="60" cy="96" rx="16" ry="11" fill="${Cr}"/>
          <circle cx="37" cy="30" r="7" fill="${Br}" ${O}/><circle cx="37" cy="30" r="3.4" fill="${Brd}"/>
          <circle cx="83" cy="30" r="7" fill="${Br}" ${O}/><circle cx="83" cy="30" r="3.4" fill="${Brd}"/>
          <ellipse cx="60" cy="50" rx="30" ry="27" fill="${Br}" ${O}/>
          <ellipse cx="60" cy="60" rx="18" ry="12" fill="${Cr}"/>
          ${eye(48, 46, 6.5, "l")}${eye(72, 46, 6.5, "r")}
          <ellipse cx="60" cy="56" rx="5" ry="3.5" fill="${LINE}"/>
          <circle cx="58.5" cy="55" r="1.2" fill="#fff"/>
          <g class="ollie-whisk" style="transform-origin:60px 58px">
            <path d="M46 58 L33 55 M46 62 L33 63 M74 58 L87 55 M74 62 L87 63" fill="none" stroke="${LINE}" stroke-width="1.6"/>
          </g>
          ${mouth(60, 63, 9, otterMouth)}
          ${cheeks([[41, 58], [79, 58]])}
          <g class="ollie-glass" style="transform-origin:86px 104px">
            ${limb("M84 100 L96 113", Brd, 5)}
            <circle cx="77" cy="90" r="11" fill="#dff6ff" fill-opacity=".55" stroke="#e9a800" stroke-width="4"/>
            <circle cx="77" cy="90" r="13" fill="none" stroke="${LINE}" stroke-width="1.5"/>
            <path d="M71 86 Q73 82 77 82" fill="none" stroke="#fff" stroke-width="2.4"/>
          </g>
          <ellipse cx="68" cy="99" rx="7" ry="5.5" fill="${Br}" ${O}/>
          <ellipse cx="88" cy="106" rx="6" ry="5" fill="${Br}" ${O}/>
        </g>
        ${extras(92, 26, [[16, 22, 6], [104, 60, 6]])}
      `);
    }
  };
})();

/* =========================================================
   HELPERS for play.html
   ========================================================= */

// Build a live character. Returns an <svg> element, or null if
// there's no character for this id (play.html then uses the emoji).
function makeCharacter(id) {
  const build = characters[id];
  if (!build) return null;
  const t = document.createElement("template");
  t.innerHTML = build().trim();
  const el = t.content.firstElementChild;
  startBlinking(el);
  return el;
}

// Play a reaction: "happy" or "oops". The class stays on long enough
// for the bounce/shake and the face to be seen, then is removed.
function characterReact(el, mood) {
  if (!el) return;
  clearTimeout(el._moodTimer);
  el.classList.remove("happy", "oops");
  void el.getBoundingClientRect();        // forces the animation to restart
  el.classList.add(mood);
  el._moodTimer = setTimeout(() => el.classList.remove(mood), 1600);
}

// Blink at random times (2 to 6 seconds apart, sometimes twice).
// Stops by itself once the character is removed from the page.
function startBlinking(el) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let seen = false, tries = 0;
  const blinkOnce = () => {
    el.classList.add("blink");
    setTimeout(() => el.classList.remove("blink"), 130);
  };
  const tick = () => {
    if (el.isConnected) seen = true;
    else if (seen || ++tries > 10) return;          // gone from the page: stop
    if (seen) {
      blinkOnce();
      if (Math.random() < 0.25) setTimeout(blinkOnce, 260);   // double blink
    }
    setTimeout(tick, 2000 + Math.random() * 4000);
  };
  setTimeout(tick, 800 + Math.random() * 2000);
}

/* =========================================================
   CSS for all characters (added to the page automatically)
   ========================================================= */
(function addCharacterStyles() {
  const css = `
  .cc { width: 100%; height: 100%; display: block; overflow: visible; }
  .cc * { transform-box: view-box; }

  /* ----- faces: show the right version of eyes and mouth ----- */
  .cc .cc-m-happy, .cc .cc-m-oops, .cc .cc-happy-only, .cc .cc-oops-only,
  .cc .cc-eye-happy, .cc .cc-brow { display: none; }
  .cc.happy .cc-m-norm, .cc.oops .cc-m-norm, .cc.happy .cc-eye-open { display: none; }
  .cc.happy .cc-m-happy, .cc.happy .cc-happy-only, .cc.happy .cc-eye-happy { display: inline; }
  .cc.oops .cc-m-oops, .cc.oops .cc-oops-only, .cc.oops .cc-brow { display: inline; }

  .cc-eye-open { transition: transform .07s ease-in; }
  .cc.blink .cc-eye-open { transform: scaleY(.08); }
  .cc-pupil { transition: transform .2s ease-out; }
  .cc.oops .cc-pupil { transform: scale(.7); }

  /* ----- reactions (on the whole character) ----- */
  .cc-root { transform-origin: 60px 112px; }
  .cc.happy .cc-root { animation: cc-happy .9s cubic-bezier(.3,.8,.4,1); }
  .cc.oops  .cc-root { animation: cc-oops .6s ease-in-out; }
  .cc.happy .cc-happy-only { animation: cc-pop .5s ease-out; }
  .cc.oops  .cc-sweat { animation: cc-drip 1.4s ease-in both; }
  @keyframes cc-happy {
    0%   { transform: translateY(0) scale(1, 1); }
    18%  { transform: translateY(2px) scale(1.08, .9); }
    45%  { transform: translateY(-16px) scale(.94, 1.07); }
    68%  { transform: translateY(0) scale(1.05, .95); }
    82%  { transform: translateY(-5px) scale(1); }
    100% { transform: translateY(0) scale(1); }
  }
  @keyframes cc-oops {
    0%, 100% { transform: translateX(0) rotate(0); }
    15% { transform: translateX(-7px) rotate(-6deg); }
    32% { transform: translateX(7px) rotate(6deg); }
    50% { transform: translateX(-5px) rotate(-3deg); }
    68% { transform: translateX(4px) rotate(2deg); }
    84% { transform: translateX(-2px) rotate(0); }
  }
  @keyframes cc-pop  { from { opacity: 0; } }
  @keyframes cc-drip { 0% { opacity: 0; transform: translateY(-4px); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(8px); } }

  /* ----- Captain Krabby ----- */
  .krab-legs   { animation: krab-scuttle .5s ease-in-out infinite alternate; }
  .krab-legs-r { animation-delay: -.25s; }
  .krab-arm    { animation: sway-small 2.4s ease-in-out infinite alternate; }
  .krab-arm-r  { animation-delay: -1.2s; }
  .krab-claw-l { animation: krab-snap-l 2.2s ease-in-out infinite; }
  .krab-claw-r { animation: krab-snap-r 2.2s ease-in-out infinite .3s; }
  .krab-stalk  { animation: krab-bob 1.8s ease-in-out infinite; }
  .krab-stalk-r { animation-delay: -.9s; }
  @keyframes krab-scuttle { from { transform: rotate(-7deg); } to { transform: rotate(7deg); } }
  @keyframes krab-snap-l { 0%, 55%, 100% { transform: rotate(0); } 65% { transform: rotate(-32deg); } 73% { transform: rotate(0); } 82% { transform: rotate(-26deg); } 90% { transform: rotate(0); } }
  @keyframes krab-snap-r { 0%, 55%, 100% { transform: rotate(0); } 65% { transform: rotate(32deg); } 73% { transform: rotate(0); } 82% { transform: rotate(26deg); } 90% { transform: rotate(0); } }
  @keyframes krab-bob { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(7deg); } }
  @keyframes sway-small { from { transform: rotate(-4deg); } to { transform: rotate(4deg); } }

  /* ----- Sunny the Starfish ----- */
  .sunny-arm   { animation: sunny-wave 2.4s ease-in-out infinite; }
  .sunny-spark { animation: twinkle 1.8s ease-in-out infinite; }
  .sunny-spark-2 { animation-delay: -.6s; }
  .sunny-spark-3 { animation-delay: -1.2s; }
  @keyframes sunny-wave { 0%, 60%, 100% { transform: rotate(0); } 20% { transform: rotate(-13deg); } 40% { transform: rotate(9deg); } }
  @keyframes twinkle { 0%, 100% { transform: scale(.4) rotate(0); opacity: .35; } 50% { transform: scale(1.15) rotate(20deg); opacity: 1; } }

  /* ----- Virus Shark ----- */
  .shark-tail  { animation: swish 1.3s ease-in-out infinite alternate; }
  .shark-fin   { animation: bob 1.6s ease-in-out infinite alternate; }
  .shark-pec   { animation: paddle 1.1s ease-in-out infinite alternate; }
  .shark-mouth { animation: chomp 1.6s ease-in-out infinite; }
  .shark-germ  { animation: germ 2.6s ease-in-out infinite; }
  .shark-germ-2 { animation-delay: -1.3s; }
  @keyframes swish  { from { transform: rotate(-12deg); } to { transform: rotate(12deg); } }
  @keyframes bob    { from { transform: translateY(0); } to { transform: translateY(-3px); } }
  @keyframes paddle { from { transform: rotate(-8deg); } to { transform: rotate(14deg); } }
  @keyframes chomp  { 0%, 40%, 100% { transform: scaleY(.3); } 55% { transform: scaleY(1); } 70% { transform: scaleY(.3); } 82% { transform: scaleY(.9); } }
  @keyframes germ   { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-5px) rotate(25deg); } }

  /* ----- Zappy the Eel: each segment moves a bit later = a traveling wave ----- */
  .eel-seg   { animation: eel-wave 1.4s ease-in-out infinite alternate; animation-delay: calc(var(--i) * -0.2s); }
  .eel-spark { animation: flicker 2.2s linear infinite; opacity: 0; }
  .eel-spark-2 { animation-delay: -.8s; }
  .eel-spark-3 { animation-delay: -1.5s; }
  @keyframes eel-wave { from { transform: translateY(-9px); } to { transform: translateY(9px); } }
  @keyframes flicker { 0%, 100% { opacity: 0; } 8% { opacity: 1; } 12% { opacity: .2; } 16% { opacity: 1; } 26% { opacity: 0; } }

  /* ----- Professor Inky ----- */
  .inky-tent    { animation: curl 2.4s ease-in-out infinite; }
  .inky-glasses { animation: glasses 2.6s ease-in-out infinite; }
  .inky-tassel  { animation: sway-small 1.8s ease-in-out infinite alternate; }
  @keyframes curl { 0%, 100% { transform: rotate(0) scaleY(1); } 30% { transform: rotate(-12deg) scaleY(.92); } 60% { transform: rotate(9deg) scaleY(1.03); } }
  @keyframes glasses { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }

  /* ----- Dolly Dolphin: rotating around a point far below = an arc ----- */
  .dolly-leap  { animation: leap 1.8s ease-in-out infinite alternate; }
  .dolly-flip  { animation: flap .45s ease-in-out infinite alternate; }
  .dolly-flip-back { animation-delay: -.22s; }
  .dolly-tail  { animation: swish 1s ease-in-out infinite alternate; }
  .dolly-water { animation: water 2s ease-in-out infinite alternate; }
  @keyframes leap  { from { transform: rotate(-7deg); } to { transform: rotate(7deg); } }
  @keyframes flap  { from { transform: rotate(-10deg); } to { transform: rotate(22deg); } }
  @keyframes water { from { transform: translateX(-4px); } to { transform: translateX(4px); } }

  /* ----- Principal Puffer ----- */
  .puff-body   { animation: puff-body 3.4s ease-in-out infinite; }
  .puff-spikes { animation: puff-spikes 3.4s ease-in-out infinite; }
  .puff-fin    { animation: flap .4s ease-in-out infinite alternate; }
  .puff-fin-r  { animation-name: flap-r; }
  @keyframes flap-r { from { transform: rotate(10deg); } to { transform: rotate(-22deg); } }
  @keyframes puff-body   { 0%, 35% { transform: scale(1); } 45% { transform: scale(1.16); } 52% { transform: scale(1.1); } 70% { transform: scale(1.12); } 82% { transform: scale(.97); } 90%, 100% { transform: scale(1); } }
  @keyframes puff-spikes { 0%, 35% { transform: scale(.72); } 45% { transform: scale(1.24); } 52% { transform: scale(1.13); } 70% { transform: scale(1.16); } 84%, 100% { transform: scale(.72); } }

  /* ----- Bubbles the Librarian ----- */
  .bub-tail    { animation: swish 1.2s ease-in-out infinite alternate; }
  .bub-fin     { animation: flap .5s ease-in-out infinite alternate; }
  .bub-fin-r   { animation-name: flap-r; }
  .bub-fin-top { animation: sway-small 1.4s ease-in-out infinite alternate; }
  .bub-rise    { animation: rise-up 3.3s ease-in infinite; }
  .bub-page    { animation: page-flip 4s ease-in-out infinite; }
  @keyframes rise-up { 0% { transform: translate(0, 0) scale(.4); opacity: 0; } 15% { opacity: 1; } 100% { transform: translate(5px, -42px) scale(1); opacity: 0; } }
  @keyframes page-flip { 0%, 55% { transform: scaleX(1); } 72% { transform: scaleX(.05); } 88%, 100% { transform: scaleX(-1); } }

  /* ----- Coach Shelly ----- */
  .shelly-flip    { animation: flap .7s ease-in-out infinite alternate; }
  .shelly-flip-r  { animation-name: flap-r; }
  .shelly-foot    { animation: sway-small .7s ease-in-out infinite alternate; }
  .shelly-foot-r  { animation-delay: -.35s; }
  .shelly-head    { animation: bob 1.3s ease-in-out infinite alternate; }
  .shelly-whistle { animation: whistle 2.6s ease-in-out infinite; }
  .shelly-tweet   { animation: tweet 2.6s ease-out infinite; opacity: 0; }
  @keyframes whistle { 0%, 66%, 100% { transform: rotate(0); } 72% { transform: rotate(-10deg) translateX(1px); } 78% { transform: rotate(6deg); } 86% { transform: rotate(0); } }
  @keyframes tweet   { 0%, 68% { opacity: 0; transform: scale(.6); } 74% { opacity: 1; transform: scale(1.1); } 88% { opacity: 1; transform: scale(1); } 96%, 100% { opacity: 0; } }

  /* ----- Seashell mascot ----- */
  .shell-top   { animation: clam 3.6s ease-in-out infinite; }
  .shell-shine { animation: shine 3.6s ease-in-out infinite; opacity: 0; }
  @keyframes clam  { 0%, 25%, 92%, 100% { transform: translateY(0) scaleY(1); } 40%, 76% { transform: translateY(-14px) scaleY(.94); } }
  @keyframes shine { 0%, 42%, 80%, 100% { opacity: 0; transform: scale(.3) rotate(0); } 55% { opacity: 1; transform: scale(1.2) rotate(30deg); } 68% { opacity: 1; transform: scale(.9) rotate(60deg); } }

  /* ----- Whale teacher ----- */
  .whale-tail  { animation: fluke 2s ease-in-out infinite alternate; }
  .whale-fin   { animation: paddle 1.5s ease-in-out infinite alternate; }
  .whale-spout { animation: spout 3s ease-out infinite; }
  @keyframes fluke { from { transform: rotate(-8deg); } to { transform: rotate(10deg); } }
  @keyframes spout { 0%, 45% { opacity: 0; transform: translateY(6px) scale(.2); } 60% { opacity: 1; transform: translateY(0) scale(1.1); } 80% { opacity: .9; transform: translateY(-2px) scale(1); } 100% { opacity: 0; transform: translateY(-8px) scale(1.1); } }

  /* ----- The Phish King ----- */
  .king-tail  { animation: swish 1.4s ease-in-out infinite alternate; }
  .king-lure  { animation: sway-small 1.6s ease-in-out infinite alternate; }
  .king-glow  { animation: glow-pulse 1.2s ease-in-out infinite alternate; }
  .king-fin   { animation: paddle 1s ease-in-out infinite alternate; }
  .king-crown { animation: sway-small 2.2s ease-in-out infinite alternate; }
  .cc.oops .king-brow, .cc.happy .king-brow { display: none; }
  @keyframes glow-pulse { from { transform: scale(.7); opacity: .2; } to { transform: scale(1.25); opacity: .55; } }

  /* ----- Ollie the Otter ----- */
  .ollie-float { animation: bob 1.8s ease-in-out infinite alternate; }
  .ollie-whisk { animation: whisk 2.4s ease-in-out infinite; }
  .ollie-glass { animation: sway-small 2.2s ease-in-out infinite alternate; }
  @keyframes whisk { 0%, 80%, 100% { transform: scaleX(1); } 86% { transform: scaleX(1.12); } 92% { transform: scaleX(.95); } }

  /* ----- Reduced motion: no looping movement and no bounce/shake.
     Faces still change, so kids still see happy / oops. ----- */
  @media (prefers-reduced-motion: reduce) {
    .cc, .cc * { animation: none !important; transition: none !important; }
    .eel-spark, .shell-shine, .shelly-tweet { opacity: 0 !important; }
  }`;
  const style = document.createElement("style");
  style.id = "character-styles";
  style.textContent = css;
  document.head.append(style);
})();
