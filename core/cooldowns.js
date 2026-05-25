const Database = require("better-sqlite3");
const db = new Database("./database.db");

// tabulka cooldownů
db.prepare(`
CREATE TABLE IF NOT EXISTS cooldowns (
    username TEXT,
    command TEXT,
    last_used INTEGER
)
`).run();

function checkCooldown(username, command, seconds) {
    const row = db.prepare(
        `SELECT last_used FROM cooldowns WHERE username = ? AND command = ?`
    ).get(username, command);

    const now = Date.now();

    if (!row) {
        db.prepare(
            `INSERT INTO cooldowns (username, command, last_used) VALUES (?, ?, ?)`
        ).run(username, command, now);
        return 0; // žádný cooldown
    }

    const diff = Math.floor((now - row.last_used) / 1000);

    if (diff < seconds) {
        return seconds - diff; // zbývající sekundy
    }

    // cooldown vypršel → reset
    db.prepare(
        `UPDATE cooldowns SET last_used = ? WHERE username = ? AND command = ?`
    ).run(now, username, command);

    return 0;
}

module.exports = { checkCooldown };
