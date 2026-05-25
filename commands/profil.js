// commands/profil.js
const { getProfile } = require("../../core/profile");

module.exports = {
    name: "profil",
    description: "Zobrazí profil hráče",
    execute: async (client, channel, user) => {

        const profile = getProfile(user.username.toLowerCase());

        if (!profile) {
            return client.say(
                channel,
                `@${user.username} ještě nemáš profil. Zkus třeba !lov.`
            );
        }

        const { level, xp, gold, rank, stats, gear, buffs, inventoryCount } = profile;

        const weapon = gear.weapon ? gear.weapon.name : "nic";
        const armor = gear.armor ? gear.armor.name : "nic";
        const trinket = gear.trinket ? gear.trinket.name : "nic";

        client.say(
            channel,
            `📜 Profil @${user.username} | Rank: ${rank} | Lvl: ${level}
XP: ${xp} | Gold: ${gold}
DMG: ${stats.dmg} (+${buffs.dmg}%) | Luck: ${stats.luck} (+${buffs.luck}%) | HP: ${stats.hp}
Gear → Weapon: ${weapon}, Armor: ${armor}, Trinket: ${trinket}
Inventář: ${inventoryCount} itemů`
        );
    }
};
