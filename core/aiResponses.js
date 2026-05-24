// core/aiResponses.js

const forbiddenWords = ["buzerant", "negr", "žid"];

const friendly = [
    "Neboj kámo, příště to bude lepší.",
    "To chce klid, RNG je dneska divoký.",
    "Hele, stává se, nic si z toho nedělej."
];

const toxic = [
    "Brácho, tvoje štěstí dneska spí jak medvěd.",
    "Tohle RNG tě fakt nemá rádo.",
    "Kámo, tohle je skill issue."
];

const sarcastic = [
    "Jo jasně, určitě to nebyla tvoje chyba… vůbec.",
    "Tohle je přesně ten moment, kdy se směju nahlas.",
    "No… tohle se ti fakt povedlo."
];

const dark = [
    "Kdyby tvoje aim byla rarita, byla by to Common.",
    "Tohle RNG tě dneska zabilo víc než boss.",
    "Tohle je tak smutný, až je to vtipný."
];

function getAIResponse() {
    const all = [...friendly, ...toxic, ...sarcastic, ...dark];
    let msg = all[Math.floor(Math.random() * all.length)];

    for (const word of forbiddenWords) {
        if (msg.includes(word)) return getAIResponse();
    }

    return msg;
}

module.exports = { getAIResponse };
