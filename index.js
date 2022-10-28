const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

app.use(morgan('common', {stream: accessLogStream}));
app.use(express.static('public'));

let topTenMovies = [
    {
        title: 'The Shawshank Redemption',
        author: 'Frank Darabont'
    },
    {
        title: 'The Godfather',
        author: 'Francis Ford Coppola'
    },
    {
        title: 'The Dark Knight',
        author: 'Christopher Nolan'
    },
    {
          title: 'The Godfather: Part II',
          author: 'Francis Ford Coppola'
    },
    {
          title: '12 Angry Men',
          author: 'Sidney Lumet'
    },
    {
        title: 'Schindler\'s List',
        author: 'Steven Spielberg'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        author: 'Peter Jackson'
    },
    {
        title: 'Pulp Fiction',
        author: 'Quentin Tarantino'
    },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        author: 'Peter Jackson'
    },
    {
        title: 'The Good, the Bad and the Ugly',
        author: 'Sergio Leone'
    }
];

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topTenMovies);
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
  
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
})