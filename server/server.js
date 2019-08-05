const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

class Message extends Sequelize.Model {}
Message.init({
  content: Sequelize.STRING,
  displayName: Sequelize.STRING,
  clicked: Sequelize.STRING,
  countMetal: Sequelize.INTEGER
}, { sequelize, modelName: 'message' });

app.post('/api', function (req, res) {
  console.log(req.body.displayName);
  sequelize.sync()
    .then(() => Message.create({
      content: req.body.content,
      displayName: req.body.displayName,
      clicked: "",
      countMetal: 0
    }))
    .then(mes => {
      console.log(mes.toJSON());
  });
});

app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});


if (process.env.NODE_ENV === 'production') {
  console.log(`Production mode detected: Serving yusaku-app`);
  const path = require('path');

  const buildDir = path.join(__dirname, '../yusaku-app/build');

  app.use(express.static(buildDir));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`);
});

