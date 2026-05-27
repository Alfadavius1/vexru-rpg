// =======================================
// VEXRU RPG 2.0 – index.js (Twitch API verze)
// Stabilní verze s auto-reconnect + heartbeat
// =======================================

const tmi = require("tmi.js");
const fs = require("fs");
const express = require("express");

// AI modul
const { getAIResponse } = require("./core/aiResponses");
const { getProfile } = require("./core/profile");

// Twitch API modul
const { getCurrentGame } = require("./core/twitchApi");

// =======================================
// HTTP SERVER PRO RENDER
// =======================================

const app = express();
app.get("/", (req, res) => res.send("Vexru běží."));
app.listen(process.env.PORT || 3000);

// =======================================
// CONFIG
// =======================================

const BOT_USERNAME = process.env.BOT_USERNAME || "vexru";
const OAUTH_TOKEN = process.env.OAUTH_TOKEN || "oauth:xxxxx";
const CHANNEL_NAME = process.env.CHANNEL_NAME || "#alfadavius1";
const STREAMER_LOGIN = process.env.STREAMER_LOGIN || "alfadavius1";

// Cache hry
let lastGame = null;
let lastGameCheck = 0;

async function getGameCached() {
  const now = Date.now();
  if (!lastGame || now - lastGameCheck > 60 * 1000) {
    lastGame = await getCurrentGame(STREAMER_LOGIN);
    lastGameCheck = now;
  }
  return lastGame;
}

// =======================================
// CLIENT – STABILNÍ NASTAVENÍ
// =======================================

const client = new tmi.Client({
  options: { debug: false },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN
  },
  channels: [CHANNEL_NAME]
});

// Připojení
client.connect().catch(err => console.error("Chyba připojení:", err));

client.on("connected", () => {
  console.log("BOT JE V CHATTU A PŘIHLÁŠENÝ");
});

// =======================================
// HEARTBEAT – aby Twitch neodpojoval
// =======================================

setInterval(() => {
  client.ping().catch(() => {});
  console.log("Heartbeat ping sent");
}, 1000 * 60 * 5);

// =======================================
// AUTO RECONNECT LOG
// =======================================

client.on("disconnected", (reason) => {
  console.log("Bot byl odpojen:", reason);
  console.log("Zkouším reconnect...");
  client.connect().catch(() => {});
});

// =======================================
// COMMAND LOADER
// =======================================

const commands = new Map();
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const cmd = require(`./commands/${file}`);
  commands.set(cmd.name, cmd);
  console.log(`Loaded command: ${cmd.name}`);
}

// =======================================
// MESSAGE HANDLER
// =======================================

client.on("message", async (channel, user, message, self) => {
  if (self) return;

  const username = user.username.toLowerCase();
  const msg = message.toLowerCase();

  // COMMANDS
  if (msg.startsWith("!")) {
    const args = msg.slice(1).split(" ");
    const cmdName = args.shift().toLowerCase();

    const cmd = commands.get(cmdName);
    if (cmd) {
      try {
        await cmd.execute(client, channel, user, args);
      } catch (err) {
        console.error(err);
        client.say(channel, `@${username} něco se pokazilo.`);
      }
    }
    return;
  }

  // PRIORITA 1 — BOT NAME
  if (msg.includes("vexru")) {
    const profile = getProfile(username);
    let extra = "";

    if (profile) {
      if (profile.level <= 3) extra = "máš level jak mimino.";
      else if (profile.level >= 10) extra = "už jsi skoro boss.";
      else extra = "pracuj na sobě dál.";
    }

    const ai = getAIResponse();
    return client.say(channel, `@${username} ${ai} ${extra}`);
  }

  // PRIORITA 2 — QUESTIONS
  if (msg.endsWith("?")) {
    const ai = getAIResponse();
    return client.say(channel, `@${username} ${ai}`);
  }

  // SPAM
  if (/([a-zA-Z])\1\1/.test(msg)) {
    return client.say(channel, `@${username} klid, nebo ti dám cooldown na život.`);
  }

  // GAME REACTIONS
  const game = await getGameCached();
  if (game) {
    const g = game.toLowerCase();

    if (g.includes("tarkov")) {
      return client.say(channel, `🔫 Tarkov? Šance na přežití: 12 %, tilt: 98 %.`);
    } else if (g.includes("cs2") || g.includes("counter-strike")) {
      return client.say(channel, `🎯 CS2? Aim dneska spí jak medvěd.`);
    } else if (g.includes("fortnite")) {
      return client.say(channel, `🏗️ Fortnite? To je dětská verze Tarkova.`);
    } else if (g.includes("outlast")) {
      return client.say(channel, `😱 Outlast? Doufám, že máš čistý trenky.`);
    }
  }
});

// =======================================
// AUTO !all KAŽDÝCH 20 MINUT
// =======================================

setInterval(() => {
  client.say(CHANNEL_NAME, "!all");
}, 20 * 60 * 1000);

// =======================================
// AUTOMATICKÁ REGENERACE HP KAŽDÝCH 10 SEKUND
// =======================================

setInterval(() => {
  const users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));
  let changed = false;

  for (const username in users) {
    const u = users[username];

    if (!u.hp || !u.currentHP) continue;

    if (u.currentHP < u.hp) {
      const regen = Math.ceil(u.hp * 0.01); // 1 % max HP
      u.currentHP += regen;

      if (u.currentHP > u.hp) {
        u.currentHP = u.hp;
      }

      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));
  }
}, 10000);

console.log("Vexru RPG 2.0 (Twitch API verze) běží...");
