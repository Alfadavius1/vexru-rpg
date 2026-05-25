const { getUser, getNeededXP } = require("../core/xp");

module.exports = {
    name: "xp",

    async execute(client, channel, user) {
        const username = user.username.toLowerCase();

        // Získání dat uživatele
        const data = await getUser(username);

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
    }
};
