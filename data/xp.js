// core/xp.js
const fs = require("fs");
const path = "./data/users.json";

function loadDB() {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path));
}

function saveDB(db) {
    fs.writeFileSync(path, JSON.stringify(db, null, 2));
}

function addXP(username, amount) {
    const db = loadDB();
    const key = username.toLowerCase();

    if (!db[key]) return;

    db[key].xp = (db[key].xp || 0) + amount;

    saveDB(db);
}

module.exports = { addXP };
