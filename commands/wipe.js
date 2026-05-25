module.exports = {
    name: "wipe",
    description: "Vymaže profil hráče (ADMIN ONLY)",

    async execute(client, channel, user, args) {
        const username = user.username.toLowerCase();

        // ADMIN CHECK
        if (username !== "alfadavius1" && username !== "vexru") {
            return client.say(channel, `@${username} na tohle nemáš oprávnění.`);
        }

        // CORE MODULY
        const aiResponses = require("../core/aiResponses.js");
        const profile = require("../core/profile.js");
        const cooldowns = require("../core/cooldowns.js");
        const { addXP } = require("../core/xp.js");

        // ARGUMENT
        const target = args[0]?.toLowerCase();
        if (!target) {
            return client.say(channel, `@${username} musíš napsat jméno hráče.`);
        }

        // EXISTUJE PROFIL?
        const targetProfile = profile.getProfile(target);
        if (!targetProfile) {
            return client.say(channel, `@${username} hráč **${target}** nemá žádný profil.`);
        }

        // SMAZÁNÍ PROFILU
        profile.deleteProfile(target);

        // SMAZÁNÍ COOLDOWNŮ
        cooldowns.clearUser(target);

        // AI REAKCE
        const ai = aiResponses.getAIResponse();

        return client.say(
            channel,
            `@${username} profil hráče **${target}** byl úspěšně wipe-nut. ${ai}`
        );
    }
};
