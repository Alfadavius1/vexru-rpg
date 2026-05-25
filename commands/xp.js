const { getUser, getNeededXP } = require("../core/xp");

module.exports = {
    name: "xp",
    description: "Zobrazí XP a level hráče",

    execute: async (client, channel, user) => {
        try {
            const username = user.username.toLowerCase();
            const data = getUser(username);

            if (!data) {
                return client.say(
                    channel,
                    `@${username} zatím nemáš žádné XP. Napiš něco do chatu a začneš je získávat!`
                );
            }

            const needed = getNeededXP(data.level);

            return client.say(
                channel,
                `@${username} • Level: ${data.level} • XP: ${data.xp}/${needed}`
            );
        } catch (err) {
            console.error("Chyba v !xp:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
