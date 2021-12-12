const fs = require('fs');
const util = require('util');
const notes = require("../db/db.json")

const readFromFile = util.promisify(fs.readFile);
/** 
 *  @param {string} notes The db containing the notes
 *  @param {object} note The note you are writing to the file
 *  @returns {void} Nothing
*/

const writeToFile = (notes, note) =>
    fs.writeFile(notes, JSON.stringify(note, null, 4), (err) =>
        err ? console.error(err) : console.info(`\nData written to ${notes}`)
    );
/**
 * @param {object} note
 * @param {string} file
 * @returns {void}
 */

const readAndAppend = (note, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(note);
            writeToFile(file,parsedData);
        }
    });
};

module.exports = { readFromFile, writeToFile, readAndAppend };