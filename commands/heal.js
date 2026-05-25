const { loadStats, saveStats } = require("../core/stats");
const { getGold, removeGold } = require("../core/gold");

module.exports = {
    name: "heal",
    description: "Vyléčí hráče za 50 goldů",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const stats = loadStats();
        const s = stats[username];

        if (!s) {
            return client.say(channel, `@${username} ještě nemáš žádné statistiky.`);
        }

        // Má hráč plné HP?
        if (s.currentHP >= s.hp) {
            return client.say(channel, `@${username} máš plné HP, není co léčit.`);
        }

        // Má hráč 50 goldů?
        const gold = getGold(username);
        if (gold < 50) {
            return client.say(channel, `@${username} nemáš dost goldů. Potřebuješ 50.`);
        }

        // Odečteme goldy
        removeGold(username, 50);

        // Doplníme HP
        s.currentHP = s.hp;
        saveStats(stats);

        return client.say(channel, `@${username} byl jsi vyléčen na plné HP za 50 goldů.`);
    }
};
