const fs = require("fs");
const path = require("path");
const { addItem, removeItem, getInventory } = require("./inventory");
const { getGold, addGold, removeGold } = require("./gold");

const shopPath = path.join(__dirname, "..", "data", "shop.json");

// ===============================
// 1) POOL VŠECH ITEMŮ DO SHOPU
// ===============================
const shopPool = [
    {
        name: "Dřevěný meč",
        rarity: "common",
        type: "weapon",
        value: 10,
        stats: { attack: 2, defense: 0, hp: 0 }
    },
    {
        name: "Kožená zbroj",
        rarity: "common",
        type: "armor",
        value: 12,
        stats: { attack: 0, defense: 2, hp: 0 }
    },
    {
        name: "Stříbrný prsten",
        rarity: "rare",
        type: "ring",
        value: 25,
        stats: { attack: 1, defense: 1, hp: 5 }
    },
    {
        name: "Léčivá bylina",
        rarity: "common",
        type: "material",
        value: 3,
        stats: null
    },
    {
        name: "Zlomená kost",
        rarity: "junk",
        type: "junk",
        value: 1,
        stats: null
    },
    {
        name: "Železný meč",
        rarity: "rare",
        type: "weapon",
        value: 40,
        stats: { attack: 5, defense: 0, hp: 0 }
    },
    {
        name: "Ocelová zbroj",
        rarity: "epic",
        type: "armor",
        value: 80,
        stats: { attack: 0, defense: 8, hp: 10 }
    }
];

// ===============================
// 2) GENEROVÁNÍ ROTACE
// ===============================
function generateRotation() {
    const count = Math.floor(Math.random() * 3) + 4; // 4–6 itemů
    const poolCopy = [...shopPool];
    const rotation = [];

    for (let i = 0; i < count; i++) {
        if (poolCopy.length === 0) break;
        const index = Math.floor(Math.random() * poolCopy.length);
        rotation.push(poolCopy[index]);
        poolCopy.splice(index, 1);
    }

    const data = {
        items: rotation,
        nextRotation: Date.now() + 2 * 60 * 60 * 1000 // 2 hodiny
    };

    fs.writeFileSync(shopPath, JSON.stringify(data, null, 2));
    return data;
}

// ===============================
// 3) NAČTENÍ SHOPU
// ===============================
function loadShop() {
    if (!fs.existsSync(shopPath)) {
        return generateRotation();
    }

    const raw = fs.readFileSync(shopPath, "utf8").trim();
    if (!raw) return generateRotation();

    const data = JSON.parse(raw);

    // Pokud vypršela rotace → nová
    if (Date.now() > data.nextRotation) {
        return generateRotation();
    }

    return data;
}

// ===============================
// 4) NÁKUP
// ===============================
function buyItem(username, itemName) {
    const shop = loadShop();
    const item = shop.items.find(i => i.name.toLowerCase() === itemName.toLowerCase());

    if (!item) return { ok: false, msg: "Tento item není v aktuální nabídce." };

    const gold = getGold(username);
    if (gold < item.value) {
        return { ok: false, msg: `Nemáš dost goldů. Cena: ${item.value}` };
    }

    removeGold(username, item.value);

    addItem(username, {
        name: item.name,
        rarity: item.rarity,
        type: item.type,
        amount: 1,
        value: item.value,
        stats: item.stats
    });

    return { ok: true, msg: `Koupil jsi ${item.name} za ${item.value} goldů.` };
}

// ===============================
// 5) PRODEJ
// ===============================
function sellItem(username, itemName) {
    const inv = getInventory(username);
    const item = inv.find(i => i.name.toLowerCase() === itemName.toLowerCase());

    if (!item) return { ok: false, msg: "Tento item nemáš." };

    const sellValue = Math.floor(item.value / 2) || 1;

    removeItem(username, item.name, 1);
    addGold(username, sellValue);

    return { ok: true, msg: `Prodáno: ${item.name} za ${sellValue} goldů.` };
}

// ===============================
// 6) AUTOMATICKÁ ROTACE KAŽDÉ 2 HODINY
// ===============================
setInterval(() => {
    generateRotation();
    console.log("SHOP: Nová rotace vygenerována.");
}, 2 * 60 * 60 * 1000); // 2 hodiny

module.exports = {
    loadShop,
    buyItem,
    sellItem
};
