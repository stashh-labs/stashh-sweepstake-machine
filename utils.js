const Prando = require('prando');
const crypto = require("crypto");

const MAX_SEED_VAL = 281474976710655;
const MIN_SEED_VAL = 0;
const MAX_ALLOWED_TICKETS = 32

exports.TallyEntries = function (entries) {
    const counts = {};

    for (const entry of entries) {
        counts[entry.address] = counts[entry.address] ? counts[entry.address] + 1 : 1;
    }

    return counts;
}

exports.ConductDraw = function (tickets, participants, winnerCount, seed) {
    const winners = [];

    const tallies = this.TallyEntries(tickets);
    const rng = SetupRandomNumberGenerator(seed);

    while (winners.length < winnerCount) {
        const candidate = tickets[rng.nextInt(0, tickets.length)];

        if (tallies[candidate.address] > MAX_ALLOWED_TICKETS) {
            console.warning(`⚠️ candidate ${candidate.address} rejected because they have too many tickets.`)
            continue;
        }

        if (winners.some(winner => winner.address === candidate.address)) {
            console.log(`⚠️ candidate ${candidate.address} skipped because they have already won once.`)
            continue;
        }

        winners.push(participants.find(participant => participant.address === candidate.address));
    }

    console.info(`Draw conduced at ${(new Date()).toISOString()}`)

    return winners;
}

exports.WriteWinners = function (winners) {

    winners.forEach(function callback(winner, index) {
        const symbol = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎖️";

        console.log(`${symbol} [${(index + 1).toString().padStart(3, '0')}]- ${winner.address} - @${winner.twitter} - ${winner.discord} - ${winner.name}`)
    });
}

function SetupRandomNumberGenerator (initSeed) {
    if (!initSeed) {
        initSeed = crypto.randomInt(MIN_SEED_VAL, MAX_SEED_VAL);
        console.warn(`Generated seed for draw: ${initSeed}`)
    }
    else if (typeof initSeed === 'number' && MIN_SEED_VAL >= 0 && initSeed <= MAX_SEED_VAL) {
        console.warn(`Using user provided seed for draw: ${initSeed}`)
    }
    else {
        throw "User provided seed is not valid!"
    }

    return new Prando(initSeed);
};