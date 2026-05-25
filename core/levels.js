// core/levels.js

function xpNeeded(level) {
    return Math.floor(50 + level * 35 + (level ** 2) * 5);
}

module.exports = { xpNeeded };
