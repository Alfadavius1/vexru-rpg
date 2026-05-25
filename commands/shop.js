const { loadShop } = require("../core/shop");

module.exports = {
    name: "shop",
    description: "Zobrazí aktuální nabídku obchodu",

    execute: async (client, channel, user) => {
        const shop = loadShop();

        let msg = "🛒 Aktuální nabídka obchodu:\n";

        for (const item of shop.items) {
            msg += `• ${item.name} (${item.rarity}, ${item.type}) — ${item.value} goldů`;
            if (item.stats) {
                const s = item.stats;
                const parts = [];
                if (s.attack) parts.push(`ATK +${s.attack}`);
                if (s.defense) parts.push(`DEF +${s.defense}`);
                if (s.hp) parts.push(`HP +${s.hp}`);
                if (parts.length > 0) msg += ` [${parts.join(", ")}]`;
            }
            msg += "\n";
        }

        const timeLeft = Math.floor((shop.nextRotation - Date.now()) / 60000);
        msg += `\n⏳ Nová rotace za ${timeLeft} minut.`;

        client.say(channel, msg);
    }
};
