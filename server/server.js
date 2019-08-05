const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());




if (process.env.NODE_ENV === 'production') {
  console.log(`Production mode detected: Serving react-ui`);
  const path = require('path');

  const buildDir = path.join(__dirname, '../react-ui/build');

  app.use(express.static(buildDir));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`);
});

