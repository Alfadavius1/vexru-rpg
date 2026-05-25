const { addXP, getUser } = require("../core/xp");

module.exports = {
    name: "daily",
    description: "Denní odměna XP",

    execute: async (client, channel, user) => {
        try {
            const username = user.username.toLowerCase();

            // Tady můžeš později přidat cooldown systém
            const reward = 50;
            addXP(username, reward);

            const data = getUser(username);

            return client.say(
                channel,
                `@${username} získal ${reward} XP! Máš nyní level ${data.level}.`
            );
        } catch (err) {
            console.error("Chyba v !daily:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
