const ntS = require('express').Router();
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

// GET Route for retrieving all the notes
ntS.get('/', (req, res) =>
  readFromFile('./db/db.json').then((notes) => res.json(JSON.parse(notes)))
);

// GET Route for a specific tip
ntS.get('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((notes) => JSON.parse(notes))
    .then((json) => {
      const result = json.filter((note) => note.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No tip with that ID');
    });
});

// DELETE Route for a specific note
ntS.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((notes) => JSON.parse(notes))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

// POST Route for submitting note
ntS.post('/', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text, id } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'Note Saved',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in saving Note');
  }
});

module.exports = ntS;
