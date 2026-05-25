const fs = require("fs");

const file = "./data/cooldowns.json";

// vytvoření souboru pokud neexistuje
if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({}, null, 2));
}

function checkCooldown(username, command, seconds) {
    const db = JSON.parse(fs.readFileSync(file));

    if (!db[username]) db[username] = {};
    if (!db[username][command]) {
        db[username][command] = Date.now();
        fs.writeFileSync(file, JSON.stringify(db, null, 2));
        return 0;
    }

    const last = db[username][command];
    const now = Date.now();
    const diff = Math.floor((now - last) / 1000);

    if (diff < seconds) {
        return seconds - diff;
    }

    db[username][command] = now;
    fs.writeFileSync(file, JSON.stringify(db, null, 2));
    return 0;
}

module.exports = { checkCooldown };
