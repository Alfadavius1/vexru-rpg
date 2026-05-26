const { getStats } = require("../core/stats");
const { getProfile } = require("../core/profile");

module.exports = {
    name: "stats",

    async execute(client, channel, user, args) {
        const username = user.username.toLowerCase();

        // Načteme profil hráče (pokud neexistuje, vytvoří se v getProfile)
        const profile = getProfile(username);

        // Načteme statistiky (pokud neexistují, vytvoří se v getStats)
        const stats = getStats(username, profile.level);

        // Odpověď do chatu
        client.say(
            channel,
            `@${username}
📊 STATISTIKY:
❤️ HP: ${stats.currentHP}/${stats.hp}
💪 Síla: ${stats.strength}
🛡️ Obrana: ${stats.defense}
🍀 Štěstí: ${stats.luck}
🔼 Level: ${profile.level}`
        );
    }
};
