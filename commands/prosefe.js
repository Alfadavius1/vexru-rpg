// commands/profese.js
const fs = require("fs");
const { getProfile } = require("../core/profile");
const { updateStats } = require("../core/stats");
const { PROFESSIONS, getProfession } = require("../core/profese");

module.exports = {
    name: "profese",
    description: "Nastaví profesi hráče",

    async execute(client, channel, user, args) {
        const username = user.username.toLowerCase();
        const profile = getProfile(username);

        const choice = (args[0] || "").toLowerCase();

        if (!PROFESSIONS[choice]) {
            const list = Object.keys(PROFESSIONS).join(", ");
            return client.say(channel, `@${user.username} dostupné profese: ${list}`);
        }

        // uložíme profesi
        const db = JSON.parse(fs.readFileSync("./data/users.json"));
        db[username].profession = choice;
        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        // přepočítáme staty
        updateStats(username, profile.level);

        return client.say(
            channel,
            `@${user.username} tvoje profese je nyní **${PROFESSIONS[choice].name}**!`
        );
    }
};
