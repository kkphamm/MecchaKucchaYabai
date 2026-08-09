import type { KanaCategory, KanaCharacter, Vowel } from "@/types/kana";

// Canonical dataset, Section 11 of design.md. Table-driven rather than
// hand-typed per entry, so totals/collisions are correct by construction.

type Cell = { vowel: Vowel; hira: string; kata: string; romaji: string };

type RowDef = { row: string; category: KanaCategory; cells: (Cell | null)[] };

const GOJUON: RowDef[] = [
  { row: "vowel", category: "basic", cells: [
    { vowel: "a", hira: "あ", kata: "ア", romaji: "a" },
    { vowel: "i", hira: "い", kata: "イ", romaji: "i" },
    { vowel: "u", hira: "う", kata: "ウ", romaji: "u" },
    { vowel: "e", hira: "え", kata: "エ", romaji: "e" },
    { vowel: "o", hira: "お", kata: "オ", romaji: "o" },
  ] },
  { row: "k", category: "basic", cells: [
    { vowel: "a", hira: "か", kata: "カ", romaji: "ka" },
    { vowel: "i", hira: "き", kata: "キ", romaji: "ki" },
    { vowel: "u", hira: "く", kata: "ク", romaji: "ku" },
    { vowel: "e", hira: "け", kata: "ケ", romaji: "ke" },
    { vowel: "o", hira: "こ", kata: "コ", romaji: "ko" },
  ] },
  { row: "s", category: "basic", cells: [
    { vowel: "a", hira: "さ", kata: "サ", romaji: "sa" },
    { vowel: "i", hira: "し", kata: "シ", romaji: "shi" },
    { vowel: "u", hira: "す", kata: "ス", romaji: "su" },
    { vowel: "e", hira: "せ", kata: "セ", romaji: "se" },
    { vowel: "o", hira: "そ", kata: "ソ", romaji: "so" },
  ] },
  { row: "t", category: "basic", cells: [
    { vowel: "a", hira: "た", kata: "タ", romaji: "ta" },
    { vowel: "i", hira: "ち", kata: "チ", romaji: "chi" },
    { vowel: "u", hira: "つ", kata: "ツ", romaji: "tsu" },
    { vowel: "e", hira: "て", kata: "テ", romaji: "te" },
    { vowel: "o", hira: "と", kata: "ト", romaji: "to" },
  ] },
  { row: "n", category: "basic", cells: [
    { vowel: "a", hira: "な", kata: "ナ", romaji: "na" },
    { vowel: "i", hira: "に", kata: "ニ", romaji: "ni" },
    { vowel: "u", hira: "ぬ", kata: "ヌ", romaji: "nu" },
    { vowel: "e", hira: "ね", kata: "ネ", romaji: "ne" },
    { vowel: "o", hira: "の", kata: "ノ", romaji: "no" },
  ] },
  { row: "h", category: "basic", cells: [
    { vowel: "a", hira: "は", kata: "ハ", romaji: "ha" },
    { vowel: "i", hira: "ひ", kata: "ヒ", romaji: "hi" },
    { vowel: "u", hira: "ふ", kata: "フ", romaji: "fu" },
    { vowel: "e", hira: "へ", kata: "ヘ", romaji: "he" },
    { vowel: "o", hira: "ほ", kata: "ホ", romaji: "ho" },
  ] },
  { row: "m", category: "basic", cells: [
    { vowel: "a", hira: "ま", kata: "マ", romaji: "ma" },
    { vowel: "i", hira: "み", kata: "ミ", romaji: "mi" },
    { vowel: "u", hira: "む", kata: "ム", romaji: "mu" },
    { vowel: "e", hira: "め", kata: "メ", romaji: "me" },
    { vowel: "o", hira: "も", kata: "モ", romaji: "mo" },
  ] },
  { row: "y", category: "basic", cells: [
    { vowel: "a", hira: "や", kata: "ヤ", romaji: "ya" },
    null,
    { vowel: "u", hira: "ゆ", kata: "ユ", romaji: "yu" },
    null,
    { vowel: "o", hira: "よ", kata: "ヨ", romaji: "yo" },
  ] },
  { row: "r", category: "basic", cells: [
    { vowel: "a", hira: "ら", kata: "ラ", romaji: "ra" },
    { vowel: "i", hira: "り", kata: "リ", romaji: "ri" },
    { vowel: "u", hira: "る", kata: "ル", romaji: "ru" },
    { vowel: "e", hira: "れ", kata: "レ", romaji: "re" },
    { vowel: "o", hira: "ろ", kata: "ロ", romaji: "ro" },
  ] },
  { row: "w", category: "basic", cells: [
    { vowel: "a", hira: "わ", kata: "ワ", romaji: "wa" },
    null,
    null,
    null,
    { vowel: "o", hira: "を", kata: "ヲ", romaji: "wo" },
  ] },
];

const DAKUTEN: RowDef[] = [
  { row: "g", category: "dakuten", cells: [
    { vowel: "a", hira: "が", kata: "ガ", romaji: "ga" },
    { vowel: "i", hira: "ぎ", kata: "ギ", romaji: "gi" },
    { vowel: "u", hira: "ぐ", kata: "グ", romaji: "gu" },
    { vowel: "e", hira: "げ", kata: "ゲ", romaji: "ge" },
    { vowel: "o", hira: "ご", kata: "ゴ", romaji: "go" },
  ] },
  { row: "z", category: "dakuten", cells: [
    { vowel: "a", hira: "ざ", kata: "ザ", romaji: "za" },
    { vowel: "i", hira: "じ", kata: "ジ", romaji: "ji" },
    { vowel: "u", hira: "ず", kata: "ズ", romaji: "zu" },
    { vowel: "e", hira: "ぜ", kata: "ゼ", romaji: "ze" },
    { vowel: "o", hira: "ぞ", kata: "ゾ", romaji: "zo" },
  ] },
  { row: "d", category: "dakuten", cells: [
    { vowel: "a", hira: "だ", kata: "ダ", romaji: "da" },
    { vowel: "i", hira: "ぢ", kata: "ヂ", romaji: "ji" },
    { vowel: "u", hira: "づ", kata: "ヅ", romaji: "zu" },
    { vowel: "e", hira: "で", kata: "デ", romaji: "de" },
    { vowel: "o", hira: "ど", kata: "ド", romaji: "do" },
  ] },
  { row: "b", category: "dakuten", cells: [
    { vowel: "a", hira: "ば", kata: "バ", romaji: "ba" },
    { vowel: "i", hira: "び", kata: "ビ", romaji: "bi" },
    { vowel: "u", hira: "ぶ", kata: "ブ", romaji: "bu" },
    { vowel: "e", hira: "べ", kata: "ベ", romaji: "be" },
    { vowel: "o", hira: "ぼ", kata: "ボ", romaji: "bo" },
  ] },
];

const HANDAKUTEN: RowDef[] = [
  { row: "p", category: "handakuten", cells: [
    { vowel: "a", hira: "ぱ", kata: "パ", romaji: "pa" },
    { vowel: "i", hira: "ぴ", kata: "ピ", romaji: "pi" },
    { vowel: "u", hira: "ぷ", kata: "プ", romaji: "pu" },
    { vowel: "e", hira: "ぺ", kata: "ペ", romaji: "pe" },
    { vowel: "o", hira: "ぽ", kata: "ポ", romaji: "po" },
  ] },
];

// Yoon rows: consonant row -> [ya, yu, yo] triplet
type YoonRow = { row: string; ya: [string, string, string]; yu: [string, string, string]; yo: [string, string, string] };

const YOON: YoonRow[] = [
  { row: "k", ya: ["きゃ", "キャ", "kya"], yu: ["きゅ", "キュ", "kyu"], yo: ["きょ", "キョ", "kyo"] },
  { row: "s", ya: ["しゃ", "シャ", "sha"], yu: ["しゅ", "シュ", "shu"], yo: ["しょ", "ショ", "sho"] },
  { row: "t", ya: ["ちゃ", "チャ", "cha"], yu: ["ちゅ", "チュ", "chu"], yo: ["ちょ", "チョ", "cho"] },
  { row: "n", ya: ["にゃ", "ニャ", "nya"], yu: ["にゅ", "ニュ", "nyu"], yo: ["にょ", "ニョ", "nyo"] },
  { row: "h", ya: ["ひゃ", "ヒャ", "hya"], yu: ["ひゅ", "ヒュ", "hyu"], yo: ["ひょ", "ヒョ", "hyo"] },
  { row: "m", ya: ["みゃ", "ミャ", "mya"], yu: ["みゅ", "ミュ", "myu"], yo: ["みょ", "ミョ", "myo"] },
  { row: "r", ya: ["りゃ", "リャ", "rya"], yu: ["りゅ", "リュ", "ryu"], yo: ["りょ", "リョ", "ryo"] },
  { row: "g", ya: ["ぎゃ", "ギャ", "gya"], yu: ["ぎゅ", "ギュ", "gyu"], yo: ["ぎょ", "ギョ", "gyo"] },
  { row: "j", ya: ["じゃ", "ジャ", "ja"], yu: ["じゅ", "ジュ", "ju"], yo: ["じょ", "ジョ", "jo"] },
  { row: "b", ya: ["びゃ", "ビャ", "bya"], yu: ["びゅ", "ビュ", "byu"], yo: ["びょ", "ビョ", "byo"] },
  { row: "p", ya: ["ぴゃ", "ピャ", "pya"], yu: ["ぴゅ", "ピュ", "pyu"], yo: ["ぴょ", "ピョ", "pyo"] },
];

function fromRows(rows: RowDef[], script: "hiragana" | "katakana"): KanaCharacter[] {
  const out: KanaCharacter[] = [];
  for (const { row, category, cells } of rows) {
    for (const cell of cells) {
      if (!cell) continue;
      const kana = script === "hiragana" ? cell.hira : cell.kata;
      out.push({
        id: `${script === "hiragana" ? "hira" : "kata"}-${row === "vowel" ? "" : row}${cell.vowel}`,
        script,
        kana,
        romaji: cell.romaji,
        category,
        row,
        vowel: cell.vowel,
      });
    }
  }
  return out;
}

function yoonFor(script: "hiragana" | "katakana"): KanaCharacter[] {
  const prefix = script === "hiragana" ? "hira" : "kata";
  const glyphIndex = script === "hiragana" ? 0 : 1;
  const out: KanaCharacter[] = [];
  for (const { row, ya, yu, yo } of YOON) {
    const triplet: [Vowel, [string, string, string]][] = [
      ["a", ya],
      ["u", yu],
      ["o", yo],
    ];
    for (const [vowel, glyphs] of triplet) {
      out.push({
        id: `${prefix}-${row}y${vowel}`,
        script,
        kana: glyphs[glyphIndex],
        romaji: glyphs[2],
        category: "yoon",
        row: `yoon-${row}`,
        vowel,
      });
    }
  }
  return out;
}

function buildScript(script: "hiragana" | "katakana"): KanaCharacter[] {
  const prefix = script === "hiragana" ? "hira" : "kata";
  const chars: KanaCharacter[] = [
    ...fromRows(GOJUON, script),
    ...fromRows(DAKUTEN, script),
    ...fromRows(HANDAKUTEN, script),
    ...yoonFor(script),
  ];

  // syllabic ん/ン — its own consonant class, not grouped with な行
  chars.push({
    id: `${prefix}-n`,
    script,
    kana: script === "hiragana" ? "ん" : "ン",
    romaji: "n",
    category: "basic",
    row: "syllabic-n",
    vowel: null,
  });

  // small kana (9): small vowels, small ya/yu/yo, sokuon
  const smallVowels: [Vowel, string, string][] = [
    ["a", "ぁ", "ァ"],
    ["i", "ぃ", "ィ"],
    ["u", "ぅ", "ゥ"],
    ["e", "ぇ", "ェ"],
    ["o", "ぉ", "ォ"],
  ];
  for (const [vowel, hira, kata] of smallVowels) {
    chars.push({
      id: `${prefix}-small-${vowel}`,
      script,
      kana: script === "hiragana" ? hira : kata,
      romaji: vowel,
      category: "small",
      row: "small-vowel",
      vowel,
    });
  }
  const smallYoon: [Vowel, string, string, string][] = [
    ["a", "ゃ", "ャ", "ya"],
    ["u", "ゅ", "ュ", "yu"],
    ["o", "ょ", "ョ", "yo"],
  ];
  for (const [vowel, hira, kata, romaji] of smallYoon) {
    chars.push({
      id: `${prefix}-small-${romaji}`,
      script,
      kana: script === "hiragana" ? hira : kata,
      romaji,
      category: "small",
      row: "small-y",
      vowel,
    });
  }
  chars.push({
    id: `${prefix}-small-tsu`,
    script,
    kana: script === "hiragana" ? "っ" : "ッ",
    romaji: "(sokuon / small tsu)",
    category: "small",
    row: "small-tsu",
    vowel: null,
  });

  // archaic (2): wi, we
  chars.push({
    id: `${prefix}-archaic-wi`,
    script,
    kana: script === "hiragana" ? "ゐ" : "ヰ",
    romaji: "wi",
    category: "archaic",
    row: "w",
    vowel: "i",
  });
  chars.push({
    id: `${prefix}-archaic-we`,
    script,
    kana: script === "hiragana" ? "ゑ" : "ヱ",
    romaji: "we",
    category: "archaic",
    row: "w",
    vowel: "e",
  });

  // katakana-only additions
  if (script === "katakana") {
    chars.push({
      id: "kata-special-vu",
      script,
      kana: "ヴ",
      romaji: "vu",
      category: "special",
      row: "v",
      vowel: "u",
    });
    chars.push({
      id: "kata-special-choonpu",
      script,
      kana: "ー",
      romaji: "ー (chōon / long vowel mark)",
      category: "special",
      row: "special",
      vowel: null,
    });
  }

  return chars;
}

export const HIRAGANA: KanaCharacter[] = buildScript("hiragana");
export const KATAKANA: KanaCharacter[] = buildScript("katakana");
export const ALL_KANA: KanaCharacter[] = [...HIRAGANA, ...KATAKANA];

export function kanaForScript(script: "hiragana" | "katakana"): KanaCharacter[] {
  return script === "hiragana" ? HIRAGANA : KATAKANA;
}

// Runnable sanity check (ponytail: non-trivial generation logic gets one check).
function assertDataset() {
  if (HIRAGANA.length !== 115) {
    throw new Error(`Expected 115 hiragana entries, got ${HIRAGANA.length}`);
  }
  if (KATAKANA.length !== 117) {
    throw new Error(`Expected 117 katakana entries, got ${KATAKANA.length}`);
  }
  const ids = new Set(ALL_KANA.map((k) => k.id));
  if (ids.size !== ALL_KANA.length) {
    throw new Error("Duplicate kana ids detected in dataset");
  }
}
assertDataset();
