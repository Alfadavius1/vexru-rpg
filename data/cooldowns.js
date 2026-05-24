// core/cooldowns.js

const cooldowns = {};

function checkCooldown(user, command, seconds) {
    const key = `${user}_${command}`;
    const now = Date.now();

    if (!cooldowns[key]) {
        cooldowns[key] = now;
        return false;
    }

    const diff = (now - cooldowns[key]) / 1000;

    if (diff < seconds) {
        return seconds - diff;
    }

    cooldowns[key] = now;
    return false;
}

module.exports = { checkCooldown };
