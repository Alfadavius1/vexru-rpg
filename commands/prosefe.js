// commands/profese.js
const { getProfile, setProfession } = require("../core/profile");
const { updateStats } = require("../core/stats");
const { getAllProfessions, getProfession } = require("../core/profese");

module.exports = {
    name: "profese",
    description: "Výběr profese podle tieru",

    async execute(client, channel, user, args) {
        const username = user.username.toLowerCase();
        const profile = getProfile(username);
        const all = getAllProfessions();

        const choice = (args[0] || "").toLowerCase();
        if (!choice) {
            return client.say(channel, `@${user.username} napiš: !profese <nazev>.`);
        }

        const prof = getProfession(choice);
        if (!prof) {
            const list = Object.values(all)
                .map(p => `${p.key} (T${p.tier})`)
                .join(", ");
            return client.say(channel, `@${user.username} neznám tuhle profesi. Dostupné: ${list}`);
        }

        // kontrola levelu podle tieru
        if (prof.tier === 1 && profile.level < 10) {
            return client.say(channel, `@${user.username} Tier 1 profese jsou od levelu 10.`);
        }
        if (prof.tier === 2 && profile.level < 25) {
            return client.say(channel, `@${user.username} Tier 2 profese jsou od levelu 25.`);
        }
        if (prof.tier === 3 && profile.level < 50) {
            return client.say(channel, `@${user.username} Tier 3 profese jsou od levelu 50.`);
        }

        // kontrola stromu
        if (prof.tier === 2 && profile.profession1 !== prof.parent) {
            return client.say(channel, `@${user.username} pro ${prof.key} musíš mít nejdřív Tier 1: ${prof.parent}.`);
        }
        if (prof.tier === 3 && profile.profession2 !== prof.parent) {
            return client.say(channel, `@${user.username} pro ${prof.key} musíš mít nejdřív Tier 2: ${prof.parent}.`);
        }

        setProfession(username, prof.tier, prof.key);
        updateStats(username, profile.level);

        client.say(channel, `@${user.username} tvoje profese T${prof.tier} je nyní **${prof.name}**.`);
    }
};
