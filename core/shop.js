// core/shop.js

const fs = require("fs");
const path = require("path");
const { getGold, addGold, removeGold } = require("./gold");
const { colorizeRarity } = require("./rarity");

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
        stats: { dmg: 2, defense: 0, hp: 0 }
    },
    {
        name: "Kožená zbroj",
        rarity: "common",
        type: "armor",
        value: 12,
        stats: { dmg: 0, defense: 2, hp: 0 }
    },
    {
        name: "Stříbrný prsten",
        rarity: "rare",
        type: "trinket",
        value: 25,
        stats: { dmg: 1, defense: 1, hp: 5 }
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
        stats: { dmg: 5, defense: 0, hp: 0 }
    },
    {
        name: "Ocelová zbroj",
        rarity: "epic",
        type: "armor",
        value: 80,
        stats: { dmg: 0, defense: 8, hp: 10 }
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

    // načíst users.json
    const users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));

    // přidat item do inventáře
    users[username].inventory.push({
        name: item.name,
        rarity: item.rarity,
        type: item.type,
        stats: item.stats,
        value: item.value
    });

    fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));

    return { ok: true, msg: `Koupil jsi ${item.name} (${colorizeRarity(item.rarity)}) za ${item.value} goldů.` };
}

// ===============================
// 5) PRODEJ
// ===============================
function sellItem(username, itemName) {
    const users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));
    const inv = users[username].inventory;

    const index = inv.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
    if (index === -1) return { ok: false, msg: "Tento item nemáš." };

    const item = inv[index];
    const sellValue = Math.floor(item.value / 2) || 1;

    inv.splice(index, 1);
    users[username].gold += sellValue;

    fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));

    return { ok: true, msg: `Prodáno: ${item.name} (${colorizeRarity(item.rarity)}) za ${sellValue} goldů.` };
}

// ===============================
// 6) AUTOMATICKÁ ROTACE KAŽDÉ 2 HODINY
// ===============================
setInterval(() => {
    generateRotation();
    console.log("SHOP: Nová rotace vygenerována.");
}, 2 * 60 * 60 * 1000);

module.exports = {
    loadShop,
    buyItem,
    sellItem
};
