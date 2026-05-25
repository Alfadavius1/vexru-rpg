// commands/lvl.js
const { getProfile } = require("../../core/profile");

module.exports = {
    name: "lvl",
    description: "Ukáže level hráče",
    execute: async (client, channel, user) => {

        const profile = getProfile(user.username.toLowerCase());

        if (!profile) {
            return client.say(channel, `@${user.username} ještě nemáš profil.`);
        }

        client.say(
            channel,
            `📈 @${user.username} má level ${profile.level} a ${profile.xp} XP.`
        );
    }
};
