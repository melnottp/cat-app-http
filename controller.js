// controller.js
// Logic behind the functionalities

const data = require("./data");

class Controller {
    // getting all cats
    async getCats() {
        // return all cats
        return new Promise((resolve, _) => resolve(data));
    }

    // getting a single cat
    async getCat(id) {
        return new Promise((resolve, reject) => {
            // get the cat
            let cat = data.find((cat) => cat.id === parseInt(id));
            if (cat) {
                // return the cat
                resolve(cat);
            } else {
                // return an error
                reject(`Cat with id ${id} not found `);
            }
        });
    }

    // creating a cat
    async createCat(cat) {
        return new Promise((resolve, _) => {
            // create a cat, with random id and data sent
            let newCat = {
                id: Math.floor(4 + Math.random() * 10),
                ...cat,
            };

            // return the new created cat
            resolve(newCat);
        });
    }

    // updating a cat
    async updateCat(id) {
        return new Promise((resolve, reject) => {
            // get the cat.
            let cat = data.find((cat) => cat.id === parseInt(id));
            // if no cat, return an error
            if (!cat) {
                reject(`No cat with id ${id} found`);
            }
            //else, update it by setting completed to true
            cat["completed"] = true;
            // return the updated cat
            resolve(cat);
        });
    }

    // deleting a cat
    async deleteCat(id) {
        return new Promise((resolve, reject) => {
            // get the cat
            let cat = data.find((cat) => cat.id === parseInt(id));
            // if no cat, return an error
            if (!cat) {
                reject(`No cat with id ${id} found`);
            }
            // else, return a success message
            resolve(`Cat deleted successfully`);
        });
    }
}
module.exports = Controller;
