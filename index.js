const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const fs = require("fs");
const path = require("path");
const { schema } = require("./graphql");
const app = express();
const PORT = 3000;

let page = fs.readFileSync(path.join(__dirname, '/graphiql.html'), 'utf-8')

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)

  console.log('------ params ------')
  for (let key in req.params) {
    console.log(`${key}: ${req.params[key]}`)
  }
  console.log('------ params ------\n')

  console.log('------ body ------')
  for (let key in req.body) {
    console.log(`${key}: ${req.body[key]}`)
  }
  console.log('------ body ------')

  next()
}); */

app.get('/graphiql', (req, res) => {
  res.status(200).write(page)
  res.end()
})

app.use(
  "/graphql",
  (req, res, next) => {
    if (req.method === 'GET' && Object.keys(req.query).length === 0) {
      res.status(200).write(page)
      res.end()
    } else next()
  },
  createHandler({ schema })
);

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
