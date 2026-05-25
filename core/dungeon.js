const bestiary = require("./bestiary");
const { loadStats, saveStats } = require("./stats");
const { addXP } = require("./xp");
const { addGold } = require("./gold");
const { addItem } = require("./inventory");
const { playerDeath } = require("./death");

// Vybere náhodného bosse (legendary)
function getRandomBoss() {
    const bosses = bestiary.filter(m => m.rarity === "legendary");
    return bosses[Math.floor(Math.random() * bosses.length)];
}

// Vybere náhodného normálního moba
function getRandomMob() {
    const mobs = bestiary.filter(m => m.rarity !== "legendary");
    return mobs[Math.floor(Math.random() * mobs.length)];
}

// Boj hráče s jedním mobem
function fightMob(player, mob) {
    const dmgPlayer = Math.max(1, player.strengthTotal - mob.defense);
    const dmgMob = Math.max(1, mob.damage - player.defenseTotal);

    let hpPlayer = player.currentHP;
    let hpMob = mob.hp;

    while (hpPlayer > 0 && hpMob > 0) {
        hpMob -= dmgPlayer;
        if (hpMob <= 0) break;

        hpPlayer -= dmgMob;
    }

    return {
        playerHP: hpPlayer,
        mobHP: hpMob,
        win: hpPlayer > 0
    };
}

function runDungeon(username, difficulty) {
    const stats = loadStats();
    const s = stats[username];

    if (!s) return { ok: false, msg: "Nemáš statistiky." };

    // Obtížnost multiplikátor
    let mult = 1.0;
    if (difficulty === "easy") mult = 0.8;
    if (difficulty === "medium") mult = 1.0;
    if (difficulty === "hard") mult = 1.5;

    let log = [];
    let currentHP = s.currentHP;

    // 3 normální mobové
    for (let i = 1; i <= 3; i++) {
        const baseMob = getRandomMob();
        const mob = bestiary.scaleMobDifficulty(baseMob, s.level, difficulty);

        const result = fightMob(
            { ...s, currentHP: currentHP },
            mob
        );

        currentHP = result.playerHP;

        if (!result.win) {
            const deathMsg = playerDeath(username);
            return { ok: false, msg: `Zemřel jsi u ${mob.name}. ${deathMsg}` };
        }

        log.push(`Porazil jsi ${mob.name} (${difficulty}).`);
    }

    // Boss fight
    const baseBoss = getRandomBoss();
    const boss = bestiary.scaleMobDifficulty(baseBoss, s.level, difficulty);

    const bossResult = fightMob(
        { ...s, currentHP: currentHP },
        boss
    );

    currentHP = bossResult.playerHP;

    if (!bossResult.win) {
        const deathMsg = playerDeath(username);
        return { ok: false, msg: `Boss ${boss.name} tě zabil. ${deathMsg}` };
    }

    log.push(`Porazil jsi bosse ${boss.name}!`);

    // Odměny
    const xpGain = Math.floor((s.level * 20) * mult);
    const goldGain = Math.floor((s.level * 15) * mult);

    addXP(username, xpGain);
    addGold(username, goldGain);

    // Loot 1–3 itemy z boss dropů
    let loot = [];

    const dropCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < dropCount; i++) {
        const drop = boss.drops[Math.floor(Math.random() * boss.drops.length)];

        addItem(username, {
            name: drop.name,
            rarity: drop.rarity,
            type: drop.type,
            amount: 1,
            value: drop.value || 1,
            stats: drop.stats || null
        });

        loot.push(drop.name);
    }

    // Uložíme HP
    s.currentHP = currentHP;
    saveStats(stats);

    return {
        ok: true,
        log,
        xpGain,
        goldGain,
        loot
    };
}

module.exports = {
    runDungeon
};
