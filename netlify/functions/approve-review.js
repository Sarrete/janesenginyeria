const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  const { index } = JSON.parse(event.body);
  const filePath = path.resolve(__dirname, "../reviews.json");

  const reviews = JSON.parse(fs.readFileSync(filePath, "utf8"));
  reviews[index].approved = true;

  fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Review approved!" }),
  };
};