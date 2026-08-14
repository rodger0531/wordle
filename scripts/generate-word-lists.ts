/**
 * Regenerates src/Asset/list.js and src/Asset/indexedList.js from the raw word
 * sources. Run with `bun run words`.
 */
import wordleWords from "../src/Asset/wordle_words.json";
import wordsDictionary from "../src/Asset/words_dictionary.json";

const ASSET_DIR = new URL("../src/Asset/", import.meta.url);

const isFiveLetters = (word: string) => word.length === 5;

const data = [
  ...new Set([
    ...Object.keys(wordleWords).filter(isFiveLetters),
    ...Object.keys(wordsDictionary).filter(isFiveLetters),
  ]),
];

async function generateList() {
  const body = data.map((word) => `'${word}', \n`).join("");
  await Bun.write(
    new URL("list.js", ASSET_DIR),
    `const data = [ \n${body}]; \nexport default data;`
  );
}

async function generateIndexedList() {
  const byFirstLetter = data.reduce<Record<string, string[]>>((acc, word) => {
    const firstLetter = word[0]!;
    (acc[firstLetter] ??= []).push(word);
    return acc;
  }, {});

  const newData = Object.values(byFirstLetter)
    .sort((a, b) => a[0]!.localeCompare(b[0]!))
    .map((words) => words.sort((a, b) => a.localeCompare(b)));

  await Bun.write(
    new URL("indexedList.js", ASSET_DIR),
    `const data = ${JSON.stringify(newData, null, 2)}; \nexport default data;`
  );
}

await Promise.all([generateList(), generateIndexedList()]);
console.log(`finished: ${data.length} words`);
