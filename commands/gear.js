// commands/gear.js

const fs = require("fs");
const { colorizeRarity } = require("../core/rarity");

module.exports = {
    name: "gear",
    description: "Zobrazí vybavení hráče",

    async execute(client, channel, user) {
        const username = user.username.toLowerCase();
        const db = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));

        if (!db[username]) {
            return client.say(channel, `@${user.username} nemáš profil.`);
        }

        const gear = db[username].gear;

        const weapon = gear.weapon
            ? `${gear.weapon.name} (${colorizeRarity(gear.weapon.rarity)})`
            : "nic";

        const armor = gear.armor
            ? `${gear.armor.name} (${colorizeRarity(gear.armor.rarity)})`
            : "nic";

        const trinket = gear.trinket
            ? `${gear.trinket.name} (${colorizeRarity(gear.trinket.rarity)})`
            : "nic";

        return client.say(
            channel,
            `@${user.username} Gear → Weapon: ${weapon} | Armor: ${armor} | Trinket: ${trinket}`
        );
    }
};
