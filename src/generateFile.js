const fs = require("fs");
const rawData = require("./Asset/wordle_words.json");
const rawData2 = require("./Asset/words_dictionary.json");

const _data = Object.keys(rawData).filter((x) => x.length === 5);
const _data2 = Object.keys(rawData2).filter((x) => x.length === 5);

const data = [...new Set([..._data, ..._data2])];

generateList();
generateIndexedList();
console.log("finished");

function generateList() {
  var file = fs.createWriteStream("./Asset/list.js");
  file.on("error", function (err) {
    console.log(err);
  });
  file.write("const data = [ \n");
  data.forEach((x) => file.write(`'${x}', \n`));
  file.write("]; \n");

  file.write("export default data;");
  file.end();
}

function generateIndexedList() {
  const newData = Object.values(
    data.reduce((acc, word) => {
      const firstLetter = word[0];
      if (!acc[firstLetter]) {
        acc[firstLetter] = [word];
      } else {
        acc[firstLetter].push(word);
      }
      return acc;
    }, {})
  )
    .sort((a, b) => a[0][0].localeCompare(b[0][0]))
    .map((x) => x.sort((a, b) => a.localeCompare(b)));

  var file = fs.createWriteStream("./Asset/indexedList.js");
  file.on("error", function (err) {
    console.log(err);
  });
  file.write("const data = ");
  file.write(JSON.stringify(newData, null, 2));
  file.write("; \n");
  file.write("export default data;");
  file.end();
}
