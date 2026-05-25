const { getAIResponse } = require("../core/aiResponses.js");
const profile = require("../core/profile.js");
const cooldowns = require("../core/cooldowns.js");

module.exports = {
    name: "wipe",
    description: "Vymaže profil hráče (ADMIN ONLY)",

    execute: async (client, channel, user, args) => {
        try {
            const username = user.username.toLowerCase();

            // ⭐ ADMIN CHECK
            if (username !== "alfadavius1" && username !== "vexru") {
                return client.say(channel, `@${username} na tohle nemáš oprávnění.`);
            }

            // ⭐ ARGUMENT
            const target = args[0]?.toLowerCase();
            if (!target) {
                return client.say(channel, `@${username} musíš napsat jméno hráče.`);
            }

            // ⭐ EXISTUJE PROFIL?
            const targetProfile = profile.getProfile(target);
            if (!targetProfile) {
                return client.say(channel, `@${username} hráč **${target}** nemá žádný profil.`);
            }

            // ⭐ SMAZÁNÍ PROFILU
            profile.deleteProfile(target);

            // ⭐ SMAZÁNÍ COOLDOWNŮ
            cooldowns.clearUser(target);

            // ⭐ AI REAKCE
            const ai = getAIResponse(username);

            // ⭐ JEDINÁ ODPOVĚĎ
            return client.say(
                channel,
                `🗑️ @${username} profil hráče **${target}** byl úspěšně wipe-nut. ${ai}`
            );

        } catch (err) {
            console.error("Chyba v !wipe:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
