const fs = require("fs");
const rawData = require("./Asset/dictionary.json");

const data = Object.keys(rawData).filter((x) => x.length === 5);

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
);

var file = fs.createWriteStream("array.txt");
file.on("error", function (err) {
  console.log(err);
});
file.write("const data = ");
file.write(JSON.stringify(newData, null, 2));
file.write("; \n");
file.write("export default data;");
file.end();

console.log("finished");
