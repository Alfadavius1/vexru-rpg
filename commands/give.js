const fs = require("fs");
const path = require("path");
const { addItem } = require("../core/inventory.js");

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
    name: "give",
    description: "Dá item jinému hráči",

    execute: async (client, channel, user, args) => {
        try {
            const sender = user.username.toLowerCase();
            const receiver = args[0]?.toLowerCase();
            const itemName = args.slice(1).join(" ");

            // Špatné použití
            if (!receiver || !itemName) {
                return client.say(channel, `@${user.username} použití: !give <hráč> <item>`);
            }

            const db = loadDB();

            // Ověření profilů
            if (!db[sender]) {
                return client.say(channel, `@${user.username} nemáš profil.`);
            }

            if (!db[receiver]) {
                return client.say(channel, `@${user.username} hráč @${receiver} neexistuje.`);
            }

            const inv = db[sender].inventory || [];

            // Najdeme item
            const item = inv.find(i => i.name.toLowerCase() === itemName.toLowerCase());

            if (!item) {
                return client.say(channel, `@${user.username} tento item nemáš.`);
            }

            // Odebrat item od odesílatele
            db[sender].inventory = inv.filter(i => i !== item);

            // Přidat item příjemci
            addItem(receiver, item);

            // Uložit DB
            saveDB(db);

            // Jediná odpověď
            return client.say(
                channel,
                `🎁 @${user.username} dal item **${item.name}** hráči @${receiver}`
            );

        } catch (err) {
            console.error("Chyba v !give:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
