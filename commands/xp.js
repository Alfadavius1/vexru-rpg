const { getUser, getNeededXP } = require("../core/xp");

module.exports = {
    name: "xp",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();
        const data = getUser(username);

        if (!data) {
            return client.say(channel, `@${username} zatím nemáš žádné XP.`);
        }

        const needed = getNeededXP(data.level);

        return client.say(
            channel,
            `@${username} • Level: ${data.level} • XP: ${data.xp}/${needed}`
        );
    }
};
