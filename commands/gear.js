// commands/gear.js
const { getProfile } = require("../../core/profile");

module.exports = {
    name: "gear",
    description: "Zobrazí vybavení hráče",
    execute: async (client, channel, user) => {

        const profile = getProfile(user.username);

        if (!profile) {
            return client.say(channel, `@${user.username} nemáš profil.`);
        }

        const g = profile.gear;

        client.say(
            channel,
            `🛡️ Gear @${user.username}:
Weapon: ${g.weapon ? g.weapon.name + " [" + g.weapon.rarity + "]" : "nic"}
Armor: ${g.armor ? g.armor.name + " [" + g.armor.rarity + "]" : "nic"}
Trinket: ${g.trinket ? g.trinket.name + " [" + g.trinket.rarity + "]" : "nic"}`
        );
    }
};
