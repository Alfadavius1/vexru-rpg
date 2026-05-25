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
        try {
            const username = user.username.toLowerCase();
            const db = loadDB();

            // Profil neexistuje
            if (!db[username]) {
                return client.say(channel, `@${user.username} nemáš profil.`);
            }

            const inv = db[username].inventory || [];

            // Prázdný inventář
            if (inv.length === 0) {
                return client.say(channel, `@${user.username} inventář je prázdný.`);
            }

            // Emoji podle rarity
            const rarityEmoji = {
                mythical: "🟠",
                legendary: "🟣",
                epic: "🔵",
                rare: "🟢",
                common: "⚪"
            };

            // Seřadíme rarity
            const order = ["mythical", "legendary", "epic", "rare", "common"];
            const sorted = inv.sort(
                (a, b) => order.indexOf(a.rarity) - order.indexOf(b.rarity)
            );

            // Výpis
            const text = sorted
                .map(i => `${rarityEmoji[i.rarity] || "⚪"} ${i.name}`)
                .join(" | ");

            // Jediná odpověď
            return client.say(channel, `🎒 @${user.username} inventář: ${text}`);

        } catch (err) {
            console.error("Chyba v !inventory:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
