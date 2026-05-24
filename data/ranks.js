// core/ranks.js

const ranks = [
    { name: "Bronze", minLevel: 1 },
    { name: "Silver", minLevel: 5 },
    { name: "Gold", minLevel: 10 },
    { name: "Platinum", minLevel: 20 },
    { name: "Diamond", minLevel: 30 }
];

function getRank(level) {
    let current = "Bronze";
    for (const r of ranks) {
        if (level >= r.minLevel) current = r.name;
    }
    return current;
}

module.exports = { getRank };
