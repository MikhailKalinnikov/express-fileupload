require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');

const app = express();

hbs.registerPartials(__dirname + '/views/partials', function (err) {/*console.error(err)*/});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'hbs');

app.use(express.static(`${__dirname}/public`));

app.use(fileUpload());

const uploadsDir = process.env.FILE_DIRECTORY || __dirname + '/public/uploads';

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('Ни один файл не был загружен.');
  }
  const sampleFile = req.files.file;
  const filename = new Date().getTime() + '_' + sampleFile.name;

  sampleFile.mv(uploadsDir + '/' + filename, function(err) {
    if (err)
      return res.status(500).send(err);

    res.json('Файл загружен!');
  });
});

app.listen(process.env.PORT || 3333);