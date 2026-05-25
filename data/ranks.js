// core/ranks.js

const ranks = [
    { name: "Bronze", minLevel: 1 },
    { name: "Silver", minLevel: 5 },
    { name: "Gold", minLevel: 10 },
    { name: "Platinum", minLevel: 20 },
    { name: "Diamond", minLevel: 30 }
];

function getRank(level) {
    // Najdeme nejvyšší rank, na který hráč dosáhne
    const eligible = ranks.filter(r => level >= r.minLevel);

    // Pokud hráč nesplňuje nic (teoreticky), vrátíme Bronze
    if (eligible.length === 0) return "Bronze";

    // Poslední splněný rank = nejvyšší
    return eligible[eligible.length - 1].name;
}

module.exports = { getRank };
