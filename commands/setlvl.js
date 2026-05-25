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

module.exports = {
    name: "setlvl",
    description: "Admin: nastaví level hráče",

    execute: async (client, channel, user, args) => {
        try {
            const admin = user.username.toLowerCase();

            // ⭐ Admin check
            if (admin !== "martin") {
                return client.say(channel, `@${user.username} nemáš oprávnění.`);
            }

            // Kontrola argumentů
            if (!args[0] || !args[1]) {
                return client.say(channel, `Použití: !setlvl @hrac level`);
            }

            const target = args[0].replace("@", "").toLowerCase();
            const level = parseInt(args[1]);

            if (isNaN(level) || level < 1) {
                return client.say(channel, `Level musí být číslo větší než 0.`);
            }

            // Načtení DB
            const db = loadDB();

            if (!db[target]) {
                return client.say(channel, `Hráč @${target} neexistuje.`);
            }

            // Nastavení levelu
            db[target].level = level;
            db[target].xp = 0; // reset XP při ručním nastavení levelu

            // Uložení
            saveDB(db);

            // ⭐ Jediná odpověď
            return client.say(
                channel,
                `📈 Admin nastavil @${target} level na ${level}.`
            );

        } catch (err) {
            console.error("Chyba v !setlvl:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
