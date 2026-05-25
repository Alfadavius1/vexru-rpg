const { getProfile } = require("../core/profile");

module.exports = {
    name: "gear",
    description: "Zobrazí vybavení hráče",

    execute: async (client, channel, user) => {
        try {
            const username = user.username.toLowerCase();
            const profile = getProfile(username);

            // Profil neexistuje
            if (!profile) {
                return client.say(channel, `@${user.username} nemáš profil.`);
            }

            const g = profile.gear || {
                weapon: null,
                armor: null,
                trinket: null
            };

            // Jediná odpověď
            return client.say(
                channel,
                `🛡️ Gear @${user.username}:\n` +
                `Weapon: ${g.weapon ? `${g.weapon.name} [${g.weapon.rarity}]` : "nic"}\n` +
                `Armor: ${g.armor ? `${g.armor.name} [${g.armor.rarity}]` : "nic"}\n` +
                `Trinket: ${g.trinket ? `${g.trinket.name} [${g.trinket.rarity}]` : "nic"}`
            );

        } catch (err) {
            console.error("Chyba v !gear:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
