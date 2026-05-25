const Database = require("better-sqlite3");
const db = new Database("./database.db");

// vytvoření tabulky
db.prepare(`
CREATE TABLE IF NOT EXISTS xp (
    username TEXT PRIMARY KEY,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1
)
`).run();

// Exponenciální XP křivka
function getNeededXP(level) {
    return Math.floor(100 * Math.pow(1.25, level - 1));
}

function getUser(username) {
    return db.prepare(`SELECT * FROM xp WHERE username = ?`).get(username);
}

function addXP(username, amount) {
    let user = getUser(username);

    if (!user) {
        db.prepare(
            `INSERT INTO xp (username, xp, level) VALUES (?, ?, ?)`
        ).run(username, amount, 1);

        return {
            username,
            xp: amount,
            level: 1,
            needed: getNeededXP(1),
            leveledUp: false
        };
    }

    let newXP = user.xp + amount;
    let newLevel = user.level;
    let leveledUp = false;

    while (newXP >= getNeededXP(newLevel)) {
        newXP -= getNeededXP(newLevel);
        newLevel++;
        leveledUp = true;
    }

    db.prepare(
        `UPDATE xp SET xp = ?, level = ? WHERE username = ?`
    ).run(newXP, newLevel, username);

    return {
        username,
        xp: newXP,
        level: newLevel,
        needed: getNeededXP(newLevel),
        leveledUp
    };
}

function getTop(limit = 10) {
    return db.prepare(
        `SELECT username, xp, level FROM xp ORDER BY level DESC, xp DESC LIMIT ?`
    ).all(limit);
}

module.exports = {
    getUser,
    addXP,
    getTop,
    getNeededXP
};
