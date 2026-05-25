const fs = require("fs");
const path = require("path");
const { getUser, getNeededXP } = require("../core/xp.js");

const usersPath = path.join(__dirname, "..", "data", "users.json");

function loadDB() {
    if (!fs.existsSync(usersPath)) return {};
    const raw = fs.readFileSync(usersPath, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
}

module.exports = {
    name: "profese",
    description: "Zobrazí informace o tvé profesi",

    execute: async (client, channel, user) => {
        try {
            const username = user.username.toLowerCase();

            // Načtení databáze
            const db = loadDB();

            if (!db[username]) {
                return client.say(channel, `@${username} ještě nemáš profil.`);
            }

            const gold = db[username].gold || 0;
            const profese = db[username].profese || "Žádná";

            // XP systém
            const xpData = getUser(username);
            if (!xpData) {
                return client.say(channel, `@${username} ještě nemáš žádnou profesi ani XP.`);
            }

            const needed = getNeededXP(xpData.level);

            // ⭐ Jediná odpověď
            return client.say(
                channel,
                `🧰 @${username} | Profese: ${profese} | Level: ${xpData.level} | XP: ${xpData.xp}/${needed} | Gold: ${gold}`
            );

        } catch (err) {
            console.error("Chyba v !profese:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
