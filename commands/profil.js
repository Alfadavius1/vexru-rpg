// commands/profil.js
const { getProfile } = require("../core/profile");
const { getStats } = require("../core/stats");

module.exports = {
    name: "profil",
    description: "Zobrazí profil hráče",

    async execute(client, channel, user) {
        try {
            const username = user.username.toLowerCase();
            const profile = getProfile(username);
            const stats = getStats(username, profile.level);

            const weapon = profile.gear.weapon ? `${profile.gear.weapon.name} [${profile.gear.weapon.rarity}]` : "nic";
            const armor = profile.gear.armor ? `${profile.gear.armor.name} [${profile.gear.armor.rarity}]` : "nic";
            const trinket = profile.gear.trinket ? `${profile.gear.trinket.name} [${profile.gear.trinket.rarity}]` : "nic";

            return client.say(
                channel,
                `📜 Profil @${user.username} | Rank: ${profile.rank} | Lvl: ${profile.level}\n` +
                `XP: ${profile.xp} | Gold: ${profile.gold}\n` +
                `DMG: ${stats.strength} | Obratnost: ${stats.agility} | Luck: ${stats.luck} | HP: ${stats.currentHP}/${stats.hp}\n` +
                `Gear → Weapon: ${weapon}, Armor: ${armor}, Trinket: ${trinket}\n` +
                `Inventář: ${profile.inventoryCount} itemů`
            );
        } catch (err) {
            console.error("Chyba v !profil:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
