const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const uuid = require("uuid");

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('common'));

let users = [
  {
    id: 1,
    name: "Max",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Jane",
    favoriteMovies: ["The Dark Knight"]
  },
];

let movies = [
  {
    "Title": "xxx",
    "Description": "",
    "Genre": {
      "Name": "Drama",
      "Description":"."
    },
    "Director":{
      "Name":"",
      "Bio":"",
      "Birth":1970,
    },
    "ImageURL":"",
    "Featured": false
  },
  {
    "Title": "yyy",
    "Description": "",
    "Genre": {
      "Name": "",
      "Description":""
    },
    "Director":{
      "Name":"",
      "Bio":"",
      "Birth":1970,
    },
    "ImageURL":"",
    "Featured": false
  },
  {
      "Title": "The Dark Knight",
      "Description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      "Genre": {
        "Name": "Action",
        "Description":"Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats. The genre tends to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero."
      },
      "Director":{
        "Name":"Christopher Nolan",
        "Bio":"Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made",
        "Birth":1970,
      },
      "ImageURL":"https://upload.wikimedia.org/wikipedia/commons/9/95/Christopher_Nolan_Cannes_2018.jpg",
      "Featured": false
    },
];

app.get('/', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

//CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else{
    res.status(400).send('users need names')
  }
});

// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
  res.status(400).send('no such user')
  }
});

// UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
  res.status(400).send('no such user')
  }
});

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
  res.status(400).send('no such user')
  }
});

// DELETE 
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
  res.status(400).send('no such user')
  }
});

// READ get movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ movies by title
app.get('/movies/:title', (req, res) => {
  //const title = req.params.title;
  const { title } = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }
});

// READ GENRE
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }
});

// READ Director
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }
});

// Error Handling
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
 
// App Listening
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
})