// commands/equip.js
const fs = require("fs");
const path = require("path");
const { getRarityInfo } = require("../data/rarity.js");
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
    name: "equip",
    description: "Nasadí item z inventáře",
    execute: async (client, channel, user, args) => {
        const username = user.username.toLowerCase();
        const db = loadDB();

        if (!db[username]) {
            return client.say(channel, `@${user.username} nemáš profil. Použij !profil.`);
        }

        const slot = args[0]?.toLowerCase();
        const itemName = args.slice(1).join(" ");

        if (!slot || !itemName) {
            return client.say(channel, `@${user.username} použití: !equip <weapon|armor|trinket> <název itemu>`);
        }

        if (!["weapon", "armor", "trinket"].includes(slot)) {
            return client.say(channel, `@${user.username} neplatný slot. Použij weapon / armor / trinket.`);
        }

        const inv = db[username].inventory || [];

        // Najdeme item v inventáři
        const item = inv.find(i => i.name.toLowerCase() === itemName.toLowerCase());

        if (!item) {
            return client.say(channel, `@${user.username} tento item nemáš v inventáři.`);
        }

        // Nasadíme item
        db[username].gear ??= { weapon: null, armor: null, trinket: null };

        const previous = db[username].gear[slot];
        db[username].gear[slot] = item;

        // Odebereme item z inventáře
        db[username].inventory = inv.filter(i => i !== item);

        // Pokud tam byl starý item → vrátíme ho do inventáře
        if (previous) {
            db[username].inventory.push(previous);
        }

        saveDB(db);

        const info = getRarityInfo(item.rarity);

        client.say(
            channel,
            `🛡️ @${user.username} nasadil **${item.rarity}** ${item.name} (${slot}) | DMG +${info.buffs.dmg}, XP +${info.buffs.xp}, LUCK +${info.buffs.luck}`
        );
    }
};
