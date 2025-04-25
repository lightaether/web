const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');

// Replace this string with your full name
const name = "Alex"

console.log(`My name is ${name}`)

// Use this list as your temporary database!
// Note that it will reset every time you restart your server
const myPokemon = [{
    id: "fc10b559-872c-43cd-bad2-f02e2e0a2d58", name: "Pikachu", health: 10, level: 1
}];

router.get('/', function (req, res) {
    // Return all pokemon
    res.status(200).json(myPokemon);
});

router.post('/', (req, res) => {
    // To prevent empty or whitespace names
    if (!req.body.name || req.body.name.trim() === "") {
        return res.status(400).json({ error: "Name cannot be empty." });
    }
    // If the pokemon name already exists in the list, return an error
    if (myPokemon.some(p => p.name === req.body.name)) {
        return res.status(400).json({ error: "Pokemon with this name already exists." });
    }
    // Randomly generate an id using UUID ["uuid()"]
    const id = uuid();
    // Randomly generate a level between 1 and 10, inclusive, if none is given
    const level = req.body.level || Math.floor(Math.random() * 10) + 1;
    // Randomly generate a health between 10 and 100, inclusive, if none is given
    const health = req.body.health || Math.floor(Math.random() * 91) + 10;
    // Insert your pokemon into the myPokemon list
    const newPokemon = {
        id,
        name: req.body.name,
        health,
        level
    };
    myPokemon.push(newPokemon);
    // Return a 200
    res.status(200).json(newPokemon);

});

router.get('/:pokemonId', function (req, res) {
    // Return pokemon if one is found matching the pokemonId
    const pokemon = myPokemon.find(p => p.id === req.params.pokemonId);

    // Return a 404 if no pokemon matches that pokemonId
    if (!pokemon) {
        return res.status(404).json({ error: "no pokemon matches that pokemonId!" });
    }

    res.json(pokemon);
});

router.put('/:pokemonId', function (req, res) {
    // Update the pokemon matching the pokemonId
    const pokemonIndex = myPokemon.findIndex(p => p.id === req.params.pokemonId);

    // Based on the req body
    if (pokemonIndex !== -1) {
        // Update pokemon properties from request body
        const currentPokemon = myPokemon[pokemonIndex];

        // Create a new Pokemon object
        const updatedPokemon = {
            id: req.params.pokemonId,  // Make sure ID doesn't change
            name: req.body.name !== undefined ? req.body.name : currentPokemon.name,
            health: req.body.health !== undefined ? req.body.health : currentPokemon.health,
            level: req.body.level !== undefined ? req.body.level : currentPokemon.level
        };

        myPokemon[pokemonIndex] = updatedPokemon;

        res.json(updatedPokemon);
    } else {
        // Return a 404 if no pokemon matches that pokemonId
        res.status(404).json({ error: "Pokemon not found" });
    }
})

router.delete('/:pokemonId', function (req, res) {
    // Delete pokemon if pokemonId matches the id of one
    const pokemonIndex = myPokemon.findIndex(p => p.id === req.params.pokemonId);
    if (pokemonIndex !== -1) {
        // Remove the pokemon from the array
        myPokemon.splice(pokemonIndex, 1);
    }
    // Return 200 even if no pokemon matches that Id
    res.status(200).json({ message: "Delete request is complete." });
})

module.exports = router;