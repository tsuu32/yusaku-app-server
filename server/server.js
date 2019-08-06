const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

class Episode extends Sequelize.Model {}
Episode.init({
  year: Sequelize.INTEGER,
  prefecture: Sequelize.STRING,
  content: Sequelize.TEXT,
  name: Sequelize.STRING,
  reactionMe: Sequelize.JSON,
  reactionFriend: Sequelize.JSON,
  reactionLike: Sequelize.INTEGER
}, {
  sequelize,
  modelName: 'episode'
});

const defaultPrefecture = [["hokkaido", 0],
                           ["aomori", 0],
                           ["iwate", 0],
                           ["miyagi", 0],
                           ["fukushima", 0],
                           ["akita", 0],
                           ["yamagata", 0],
                           ["nigata", 0],
                           ["tochigi", 0],
                           ["ibaraki", 0],
                           ["chiba", 0],
                           ["kanagawa", 0],
                           ["gunma", 0],
                           ["saitama", 0],
                           ["tokyo", 0],
                           ["shizuoka", 0],
                           ["toyama", 0],
                           ["yamanashi", 0],
                           ["nagano", 0],
                           ["fukui", 0],
                           ["shiga", 0],
                           ["mie", 0],
                           ["kyoto", 0],
                           ["nara", 0],
                           ["wakayama", 0],
                           ["osaka", 0],
                           ["hyogo", 0],
                           ["okayama", 0],
                           ["tottori", 0],
                           ["shimane", 0],
                           ["hiroshima", 0],
                           ["yamaguchi", 0],
                           ["tokushima", 0],
                           ["kagawa", 0],
                           ["kochi", 0],
                           ["ehime", 0],
                           ["miyazaki", 0],
                           ["oita", 0],
                           ["kumamoto", 0],
                           ["saga", 0],
                           ["fukuoka", 0],
                           ["nagasaki", 0],
                           ["kagoshima", 0],
                           ["okinawa", 0]
                          ];

app.post('/api/episode', function (req, res) {
  console.log(req.body);
  sequelize.sync()
    .then(() => Episode.create({
      year: req.body.year,
      prefecture: req.body.prefecture,
      content: req.body.content,
      name: req.body.name,
      reactionMe: JSON.stringify(defaultPrefecture),
      reactionFriend: JSON.stringify(defaultPrefecture),
      reactionLike: 0
    }))
    .then(epi => {
      console.log(epi.toJSON());
      res.send(epi.toJSON());
  });
});

app.get('/api/episodes', function (req, res) {
  res.set('Content-Type', 'application/json');
  Episode.findAll().then(epi => {
    // console.log("All users:", JSON.stringify(epi, null, 2));
    res.send(epi);
  }).catch(err => {
    res.status(400).json({
      error: 'episode not found.'
    });
  });
});

app.get('/api/episode/:id', function (req, res) {
  const id = req.params.id;
  res.set('Content-Type', 'application/json');
  Episode.findByPk(id).then(epi => {
    res.send(epi);
    console.log(epi.reactionMe);
  });
});

app.post('/api/reaction/me', function (req, res) {
  console.log(req.body);
  const id = req.body.id;
  Episode.findByPk(id).then(epi => {
    let reactionMe = JSON.parse(epi.reactionMe);

    console.log(reactionMe.length);
    for (let i = 0; i < reactionMe.length; i++) {
      if (reactionMe[i][0] === req.body.prefecture) {
        console.log(reactionMe[i]);
        reactionMe[i][1] += 1;
      }
    }
    console.log(reactionMe);

    Episode.update({
      reactionMe: JSON.stringify(reactionMe)
    }, {
      where: {
        id: id
      }
    }).then(epi => {
      console.log(epi);
      res.json({
        id: id,
        result: 'success'
      });
    });
  });
});

app.post('/api/reaction/friend', function (req, res) {
  console.log(req.body);
  const id = req.body.id;
  Episode.findByPk(id).then(epi => {
    let reactionFriend = JSON.parse(epi.reactionFriend);

    console.log(reactionFriend.length);
    for (let i = 0; i < reactionFriend.length; i++) {
      if (reactionFriend[i][0] === req.body.prefecture) {
        console.log("this will update", reactionFriend[i]);
        reactionFriend[i][1] += 1;
      }
    }
    console.log("updated :",reactionFriend);

    Episode.update({
      reactionFriend: JSON.stringify(reactionFriend)
    }, {
      where: {
        id: id
      }
    }).then(epi => {
      console.log(epi);
      res.json({
        id : id,
        result: 'success'
      });
    });
  });
});

app.post('/api/reaction/like', function (req, res) {
  console.log(req.body);
  const id = req.body.id;
  Episode.findByPk(id).then(epi => {
    let reactionLike = JSON.parse(epi.reactionLike);

    console.log(reactionLike++);

    Episode.update({
      reactionLike: reactionLike++
    }, {
      where: {
        id: id
      }
    }).then(epi => {
      // console.log(epi);
      res.json({
        id : id,
        result: 'success'
      });
    });
  });
});


app.post('/api/reaction/like', function (req, res) {
  console.log(req.body);
  sequelize.sync()
    .then(() => Episode.create({
      year: req.body.year,
      prefecture: req.body.prefecture,
      content: req.body.content,
      name: req.body.name,
      reactionMe: "",
      reactionFriend: "",
      reactionLike: 0
    }))
    .then(epi => {
      console.log(epi.toJSON());
      res.send(epi.toJSON());
  });
});

if (process.env.NODE_ENV === 'production') {
  console.log(`Production mode detected: Serving client`);
  const path = require('path');

  const buildDir = path.join(__dirname, '../client/build');

  app.use(express.static(buildDir));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`);
});

