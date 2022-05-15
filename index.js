const fs = require("fs");
const http = require("http");
const url = require("url");

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// console.log(textIn);

// const textOut = `This is what we know about the avacado: ${textIn}.\nCreated on ${Date(
//   Date.now()
// )}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File has been updated.");

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf8", (err, data2) => {
//     fs.readFile(`./txt/append.txt`, "utf8", (err, data3) => {
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, (err) => {
//         const textIn = fs.readFileSync("./txt/final.txt", "utf-8");
//         console.log(textIn);
//       });
//     });
//   });
// });
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf8"
);
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf8");

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%AMOUNT%}/g, product.price);
  output = output.replace(/{%PRODUCT_IMAGE%}/g, product.image);
  output = output.replace(/{%ORIGIN%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};
// SERVER

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  const pathId = query.id;
  // console.log(query.id, pathname, pathId);
  // console.log(url.parse(req.url, true));

  //PRODUCT
  if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    const prod = dataObj[pathId];
    const output = replaceTemplate(tempProduct, prod);
    res.end(output);
  }
  // OVERVIEW
  else if (pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });
    const cardsHTML = dataObj
      .map((el) => {
        return replaceTemplate(tempCard, el);
      })
      .join("");
    const output = tempOverview.replace(/{%CARD%}/g, cardsHTML);
    res.end(output);
  }
  // API
  else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  }
  //NOT FOUND
  else {
    res.writeHead(404, { "content-type": "text/html" });
    res.end("<h1>Page not found.</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
