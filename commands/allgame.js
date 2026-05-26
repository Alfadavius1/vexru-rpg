module.exports = {
    name: "allgame",
    description: "Zobrazí všechny RPG příkazy",

    async execute(client, channel, user) {
        const username = user.username.toLowerCase();

        const msg = `
@${username} RPG příkazy:

⚔️ BOJ
• !fight — souboj 1v1 proti nepříteli
• !lov [easy/medium/hard] — lov nepřátel
• !dungeon [easy/medium/hard] — dungeon (3 mobové + boss)

🛡️ GEAR
• !equip <item> — nasadí vybavení
• !unequip <slot> — sundá vybavení
• !gear — zobrazí aktuální gear

📦 INVENTÁŘ & STATY
• !inventory — inventář
• !stats — statistiky
• !gold — goldy

🛒 SHOP
• !shop — aktuální rotace obchodu
• !buy <item> — koupě itemu
• !sell <item> — prodej itemu
`;

        client.say(channel, msg);
    }
};
