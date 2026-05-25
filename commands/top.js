const { getTop, getNeededXP } = require("../core/xp");

module.exports = {
    name: "top",
    description: "Zobrazí TOP XP žebříček",

    execute: async (client, channel, user) => {
        try {
            const top = getTop(10);

            if (!top || top.length === 0) {
                return client.say(channel, "XP žebříček je prázdný.");
            }

            let msg = "🏆 TOP 10 hráčů:\n";

            top.forEach((u, i) => {
                const needed = getNeededXP(u.level);
                msg += `${i + 1}. ${u.username} — Level ${u.level} (${u.xp}/${needed} XP)\n`;
            });

            const finalMsg = msg.replace(/\n/g, " | ");
            return client.say(channel, finalMsg);
        } catch (err) {
            console.error("Chyba v !top:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
