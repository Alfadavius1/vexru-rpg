const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

// Vytvoření tabulky pro XP
db.run(`
CREATE TABLE IF NOT EXISTS xp (
    username TEXT PRIMARY KEY,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1
)
`);

// Exponenciální XP křivka
// neededXP = floor(100 * 1.25^(level - 1))
function getNeededXP(level) {
    return Math.floor(100 * Math.pow(1.25, level - 1));
}

// Získání uživatele
function getUser(username) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM xp WHERE username = ?`,
            [username],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
    });
}

// Přidání XP + levelování
async function addXP(username, amount) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await getUser(username);

            // Pokud neexistuje, vytvoříme
            if (!user) {
                const startXP = amount;
                const startLevel = 1;

                db.run(
                    `INSERT INTO xp (username, xp, level) VALUES (?, ?, ?)`,
                    [username, startXP, startLevel],
                    err => {
                        if (err) return reject(err);
                        return resolve({
                            username,
                            xp: startXP,
                            level: startLevel,
                            needed: getNeededXP(startLevel)
                        });
                    }
                );
                return;
            }

            let newXP = user.xp + amount;
            let newLevel = user.level;
            let leveledUp = false;

            // Levelování – může proběhnout víckrát, když dostane hodně XP najednou
            while (true) {
                const needed = getNeededXP(newLevel);
                if (newXP >= needed) {
                    newXP -= needed;
                    newLevel++;
                    leveledUp = true;
                } else {
                    break;
                }
            }

            db.run(
                `UPDATE xp SET xp = ?, level = ? WHERE username = ?`,
                [newXP, newLevel, username],
                err => {
                    if (err) return reject(err);
                    return resolve({
                        username,
                        xp: newXP,
                        level: newLevel,
                        needed: getNeededXP(newLevel),
                        leveledUp
                    });
                }
            );
        } catch (err) {
            reject(err);
        }
    });
}

// Volitelné: top XP žebříček
function getTop(limit = 10) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT username, xp, level FROM xp ORDER BY level DESC, xp DESC LIMIT ?`,
            [limit],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

module.exports = {
    getUser,
    addXP,
    getTop,
    getNeededXP
};
