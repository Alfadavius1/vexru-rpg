const { getTop, getNeededXP } = require("../core/xp");

module.exports = {
    name: "top",

    async execute(client, channel, user) {
        const top = await getTop(10);

        if (!top || top.length === 0) {
            return client.say(channel, "XP žebříček je prázdný.");
        }

        let msg = "🏆 TOP 10 hráčů:\n";

        top.forEach((u, i) => {
            const needed = getNeededXP(u.level);
            msg += `${i + 1}. ${u.username} — Level ${u.level} (${u.xp}/${needed} XP)\n`;
        });

        // Twitch neumí multiline → pošleme to jako jeden řádek
        return client.say(channel, msg.replace(/\n/g, " | "));
    }
};
