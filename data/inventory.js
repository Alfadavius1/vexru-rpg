// core/inventory.js
const fs = require("fs");
const path = require("path");

const usersPath = path.join(__dirname, "..", "data", "users.json");

function loadDB() {
    if (!fs.existsSync(usersPath)) return {};
    const raw = fs.readFileSync(usersPath, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
}

function saveDB(db) {
    fs.writeFileSync(usersPath, JSON.stringify(db, null, 2));
}

function addItem(username, item) {
    const db = loadDB();
    const key = username.toLowerCase();

    if (!db[key]) return;

    db[key].inventory ??= [];
    db[key].inventory.push(item);

    saveDB(db);
}

module.exports = { addItem };
