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
    name: "unequip",
    description: "Sundá item ze slotu a vrátí ho do inventáře",

    execute: async (client, channel, user, args) => {
        try {
            const username = user.username.toLowerCase();
            const slot = args[0]?.toLowerCase();

            // Kontrola slotu
            if (!["weapon", "armor", "trinket"].includes(slot)) {
                return client.say(
                    channel,
                    `@${user.username} použití: !unequip <weapon|armor|trinket>`
                );
            }

            const db = loadDB();

            // Profil neexistuje
            if (!db[username]) {
                return client.say(channel, `@${user.username} nemáš profil.`);
            }

            db[username].inventory ??= [];
            db[username].gear ??= { weapon: null, armor: null, trinket: null };

            const item = db[username].gear[slot];

            // Slot je prázdný
            if (!item) {
                return client.say(channel, `@${user.username} tento slot je prázdný.`);
            }

            // Vrátíme item do inventáře
            db[username].inventory.push(item);

            // Vyprázdníme slot
            db[username].gear[slot] = null;

            saveDB(db);

            // Jediná odpověď
            return client.say(
                channel,
                `🧰 @${user.username} sundal item **${item.name}** ze slotu ${slot}.`
            );

        } catch (err) {
            console.error("Chyba v !unequip:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
