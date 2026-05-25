const { getProfile } = require("../core/profile");

module.exports = {
    name: "profil",
    description: "Zobrazí profil hráče",

    execute: async (client, channel, user) => {
        try {
            const username = user.username.toLowerCase();
            const profile = getProfile(username);

            // Profil neexistuje
            if (!profile) {
                return client.say(
                    channel,
                    `@${user.username} ještě nemáš profil. Zkus třeba !lov.`
                );
            }

            const { level, xp, gold, rank, stats, gear, buffs, inventoryCount } = profile;

            const weapon = gear.weapon ? gear.weapon.name + ` [${gear.weapon.rarity}]` : "nic";
            const armor = gear.armor ? gear.armor.name + ` [${gear.armor.rarity}]` : "nic";
            const trinket = gear.trinket ? gear.trinket.name + ` [${gear.trinket.rarity}]` : "nic";

            // ⭐ Jediná odpověď
            return client.say(
                channel,
                `📜 Profil @${user.username} | Rank: ${rank} | Lvl: ${level}\n` +
                `XP: ${xp} | Gold: ${gold}\n` +
                `DMG: ${stats.dmg} (+${buffs.dmg}%) | Luck: ${stats.luck} (+${buffs.luck}%) | HP: ${stats.hp}\n` +
                `Gear → Weapon: ${weapon}, Armor: ${armor}, Trinket: ${trinket}\n` +
                `Inventář: ${inventoryCount} itemů`
            );

        } catch (err) {
            console.error("Chyba v !profil:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
