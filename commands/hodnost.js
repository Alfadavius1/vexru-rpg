const { getProfile } = require("../core/profile");

module.exports = {
    name: "hodnost",
    description: "Ukáže rank hráče",
    execute: async (client, channel, user) => {
        const profile = getProfile(user.username);

        if (!profile) {
            return client.say(channel, `@${user.username} nemáš profil.`);
        }

        client.say(channel, `🏆 @${user.username} má hodnost: ${profile.rank}`);
    }
};
