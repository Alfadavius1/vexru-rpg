// core/dungeon.js

const fs = require("fs");
const bestiary = require("./bestiary");
const { scaleMobDifficulty, colorizeRarity } = require("./bestiary");
const { getProfile } = require("./profile");
const { getStats, changeHP, applyDeath } = require("./stats");
const { getAllEffects, roll } = require("../utils/_utilProfese");
const { getGearByRarity } = require("./gear");

// ===============================
// GENERACE MOBŮ PRO DUNGEON
// ===============================
function getRandomMob() {
    return bestiary[Math.floor(Math.random() * bestiary.length)];
}

function getRandomBoss() {
    const bosses = bestiary.filter(m => ["rare", "epic", "legendary"].includes(m.rarity));
    return bosses[Math.floor(Math.random() * bosses.length)];
}

// ===============================
// BOJ HRÁČE S MOMEM
// ===============================
function fightMob(username, mob, difficulty) {
    const profile = getProfile(username);
    let stats = getStats(username, profile.level);
    const eff = getAllEffects(username);

    const scaled = scaleMobDifficulty(mob, profile.level, difficulty);

    let dmgTaken = scaled.damage - stats.defense;
    if (dmgTaken < 1) dmgTaken = 1;

    if (roll(eff.dodgeChance)) dmgTaken = 0;
    else if (roll(eff.blockChance)) dmgTaken = 0;
    else if (roll(eff.dmgReduceChance)) {
        dmgTaken = Math.floor(dmgTaken * (1 - eff.dmgReducePercent / 100));
    }

    const after = changeHP(username, -dmgTaken);

    return {
        dmgTaken,
        mobName: scaled.name,
        mobRarity: scaled.rarity,
        hpLeft: after.currentHP,
        isDead: after.currentHP <= 0
    };
}

// ===============================
// DUNGEON LOGIKA
// ===============================
function runDungeon(username, difficulty) {
    const profile = getProfile(username);
    let stats = getStats(username, profile.level);

    if (stats.currentHP <= 0) {
        applyDeath(username);
        return { ok: false, msg: "Byl jsi KO. Oživuji tě na 25 % HP." };
    }

    const log = [];
    const loot = [];

    // 3 mobové
    for (let i = 1; i <= 3; i++) {
        const mob = getRandomMob();
        const result = fightMob(username, mob, difficulty);

        log.push(
            `Mob ${i}: ${mob.name} (${colorizeRarity(mob.rarity)}) → ` +
            `dostal jsi ${result.dmgTaken} dmg (HP: ${result.hpLeft})`
        );

        if (result.isDead) {
            return { ok: false, msg: `Zemřel jsi u ${mob.name}.`, log, loot: [] };
        }

        // běžné dropy
        for (const item of mob.drops) {
            if (Math.random() < item.chance) {
                loot.push(`${item.name} (${colorizeRarity(item.rarity)})`);
            }
        }
    }

    // BOSS
    const boss = getRandomBoss();
    const bossResult = fightMob(username, boss, difficulty);

    log.push(
        `BOSS: ${boss.name} (${colorizeRarity(boss.rarity)}) → ` +
        `dostal jsi ${bossResult.dmgTaken} dmg (HP: ${bossResult.hpLeft})`
    );

    if (bossResult.isDead) {
        return { ok: false, msg: `Boss ${boss.name} tě zabil.`, log, loot: [] };
    }

    // boss dropy
    for (const item of boss.drops) {
        if (Math.random() < item.chance) {
            loot.push(`${item.name} (${colorizeRarity(item.rarity)})`);
        }
    }

    // gear drop
    const gearChance = {
        common: 0.02,
        rare: 0.05,
        epic: 0.10,
        legendary: 0.20
    };

    if (Math.random() < (gearChance[boss.rarity] || 0)) {
        const gear = getGearByRarity(boss.rarity);
        if (gear) {
            loot.push(`GEAR: ${gear.name} (${colorizeRarity(gear.rarity)})`);
        }
    }

    // XP + GOLD
    const xpGain = boss.level * 20;
    const goldGain = boss.level * 15;

    const users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));

    users[username].xp += xpGain;
    users[username].gold += goldGain;

    // uložit loot
    for (const drop of loot) {
        if (drop.startsWith("GEAR: ")) {
            const name = drop.replace("GEAR: ", "").split(" (")[0];
            const gear = getGearByRarity(boss.rarity);

            users[username].inventory.push({
                name: gear.name,
                rarity: gear.rarity,
                slot: gear.slot,
                stats: gear.stats,
                type: "gear"
            });
        }
    }

    fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));

    return {
        ok: true,
        log,
        loot,
        xpGain,
        goldGain
    };
}

module.exports = {
    runDungeon
};
