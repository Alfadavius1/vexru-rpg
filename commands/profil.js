const { getProfile } = require("../core/profile");

module.exports = {
    name: "profil",
    description: "Zobrazí profil hráče",
    execute: async (client, channel, user) => {
        const profile = getProfile(user.username);

        if (!profile) {
            return client.say(channel, `@${user.username} ještě nemáš profil. Zkus třeba !lov.`);
        }

        const { level, xp, gold, rank, stats, gear, buffs, inventoryCount } = profile;

        client.say(
            channel,
            `📜 Profil @${user.username} | Rank: ${rank}
Lvl: ${level} | XP: ${xp} | Gold: ${gold}
DMG: ${stats.dmg} (+${buffs.dmg} %) | Luck: ${stats.luck} (+${buffs.luck} %) | HP: ${stats.hp}
Gear → Weapon: ${gear.weapon ? gear.weapon.name : "nic"}, Armor: ${gear.armor ? gear.armor.name : "nic"}, Trinket: ${gear.trinket ? gear.trinket.name : "nic"}
Inventář: ${inventoryCount} itemů`
        );
    }
};
