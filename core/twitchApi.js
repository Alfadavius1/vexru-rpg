const axios = require("axios");

const CLIENT_ID = "gra19eeuml50e0et0sdnmfw2ez9ouy";          // z dev.twitch.tv
const APP_TOKEN = "def4qnqgy2ffnn8ir36r5oaeya7b4";          // access_token z ReqBin
const STREAMER_LOGIN = "alfadavius1";         // tvůj Twitch nick

// Získání informací o streamu
async function getStreamInfo() {
    try {
        const response = await axios.get(
            `https://api.twitch.tv/helix/streams?user_login=${alfadavius1}`,
            {
                headers: {
                    "Client-ID": gra19eeuml50e0et0sdnmfw2ez9ouy,
                    "Authorization": `Bearer ${APP_TOKEN}`
                }
            }
        );

        return response.data.data[0] || null;
    } catch (error) {
        console.error("Chyba při získávání stream info:", error.response?.data || error);
        return null;
    }
}

// Získání názvu hry
async function getCurrentGame() {
    const stream = await getStreamInfo();
    if (!stream) return null;

    try {
        const response = await axios.get(
            `https://api.twitch.tv/helix/games?id=${stream.game_id}`,
            {
                headers: {
                    "Client-ID": gra19eeuml50e0et0sdnmfw2ez9ouy,
                    "Authorization": `Bearer ${def4qnqgy2ffnn8ir36r5oaeya7b4}`
                }
            }
        );

        return response.data.data[0]?.name || null;
    } catch (error) {
        console.error("Chyba při získávání hry:", error.response?.data || error);
        return null;
    }
}

// Získání názvu streamu
async function getStreamTitle() {
    const stream = await getStreamInfo();
    return stream ? stream.title : null;
}

module.exports = {
    getStreamInfo,
    getCurrentGame,
    getStreamTitle
};
