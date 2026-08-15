/**
 * Regenerates the bundled word lists from the raw JSON sources.
 * Run with `bun run words`.
 *
 * Output is newline-delimited text rather than a JS array literal: it is about
 * half the bytes of `['cigar', \n...]` and parses with a single split().
 *
 *   answers.txt     words that can be the solution, in official Wordle order
 *   dictionary.txt  every word accepted as a guess, sorted
 */
import wordleWords from "../src/Asset/wordle_words.json";
import wordsDictionary from "../src/Asset/words_dictionary.json";

const WORD_LENGTH = 5;
const DATA_DIR = new URL("../src/data/", import.meta.url);

const fiveLetter = (source: object) =>
  Object.keys(source).filter((word) => word.length === WORD_LENGTH);

// Insertion order of wordle_words.json is the official solution order; keep it.
const answers = fiveLetter(wordleWords);
const dictionary = [
  ...new Set([...answers, ...fiveLetter(wordsDictionary)]),
].sort();

await Bun.write(new URL("answers.txt", DATA_DIR), answers.join("\n"));
await Bun.write(new URL("dictionary.txt", DATA_DIR), dictionary.join("\n"));

console.log(`answers: ${answers.length}, dictionary: ${dictionary.length}`);
