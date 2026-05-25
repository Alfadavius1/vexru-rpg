const { getProfile } = require("../core/profile");

module.exports = {
    name: "hodnost",
    description: "Ukáže rank hráče",

    execute: async (client, channel, user) => {
        try {
            const username = user.username.toLowerCase();
            const profile = getProfile(username);

            // Profil neexistuje
            if (!profile) {
                return client.say(channel, `@${user.username} nemáš profil.`);
            }

            // Jediná odpověď
            return client.say(
                channel,
                `🏆 @${user.username} má hodnost: **${profile.rank}**`
            );

        } catch (err) {
            console.error("Chyba v !hodnost:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
