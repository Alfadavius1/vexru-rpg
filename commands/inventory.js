const fs = require("fs");
const path = require("path");

const usersPath = path.join(__dirname, "..", "data", "users.json");

function loadDB() {
    if (!fs.existsSync(usersPath)) return {};
    const raw = fs.readFileSync(usersPath, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
}

module.exports = {
    name: "inventory",
    description: "Zobrazí inventář hráče",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();
        const db = loadDB();

        if (!db[username]) {
            return client.say(channel, `@${user.username} nemáš profil.`);
        }

        const inv = db[username].inventory || [];

        if (inv.length === 0) {
            return client.say(channel, `@${user.username} inventář je prázdný.`);
        }

        // Emoji podle rarity
        const rarityEmoji = {
            legendary: "🟣",
            epic: "🔵",
            rare: "🟢",
            common: "⚪",
            mythical: "🟠"
        };

        // Seřadíme rarity
        const order = ["mythical", "legendary", "epic", "rare", "common"];
        const sorted = inv.sort((a, b) => order.indexOf(a.rarity) - order.indexOf(b.rarity));

        const text = sorted
            .map(i => `${rarityEmoji[i.rarity] || "⚪"} ${i.name}`)
            .join(" | ");

        return client.say(channel, `🎒 @${user.username} inventář: ${text}`);
    }
};
