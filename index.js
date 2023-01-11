const crypto = require("crypto");
const Prando = require('prando');

const MAX_SEED_VAL = 281474976710655;
const MIN_SEED_VAL = 0;

console.info(`Starting draw at ${(new Date()).toISOString()}`)

function SetupRandomNumberGenerator(initSeed) {
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
}

const rng = SetupRandomNumberGenerator();

const qualifyingWallets = require("./data/users.json");

console.info(`Loaded ${qualifyingWallets.length} qualifying users from ./users.json`)

function GetEntriesFromDataSet(filename) {
    const data = require(filename);

    var drawEntries = []

    data.forEach(item => {
        if (WalletQualifies(item.address)) {
            for (var i = 0; i < item.count; i++) {
                drawEntries.push(item)
            }
        }
    });

    console.log(`Loaded ${drawEntries.length} entries from ${filename}`)

    return drawEntries;
}

function WalletQualifies(walletAddress) {
    return qualifyingWallets.some(wallet => wallet.address === walletAddress);;
}

function GenerateEntries() {
    var entries = GetEntriesFromDataSet("./data/d1.json").concat(GetEntriesFromDataSet("./data/d2.json"));

    console.log(`Loaded ${entries.length} entries in total`)

    return entries
}

function TallyEntries(entries) {
    const counts = {};

    for (const entry of entries) {
        counts[entry.address] = counts[entry.address] ? counts[entry.address] + 1 : 1;
    }

    return counts;
}

function PickWinnersFromEntries(entries, winnerCount) {
    var winners = [];

    var tallies = TallyEntries(entries);

    while (winners.length < winnerCount) {
        var candidate = entries[rng.nextInt(0,entries.length)];

        var totalEntriesForUser = tallies[candidate.address];

        if (totalEntriesForUser > 32) {
            console.warning(`⚠️ candidate ${candidate.address} rejected because they have too many tickets.`)
            continue;
        }

        if (winners.some(winner => winner.address === candidate.address)) {
            console.log(`⚠️ candidate ${candidate.address} skipped because they have already won once.`)
            continue;
        }

        var winner = qualifyingWallets.find(wallet => wallet.address === candidate.address);
        winners.push(winner);
    }

    return winners;
}

function WriteWinners(winners) {

    winners.forEach(function callback(winner, index) {
        var symbol = index == 0 ? "🥇" : index == 1 ? "🥈" : index == 2 ? "🥉" : "🎖️";

        console.log(`${symbol} [${(index + 1).toString().padStart(3, '0')}]- ${winner.address} - @${winner.twitter} - ${winner.discord} - ${winner.name}`)
    });
}

var entries = GenerateEntries();

var winners = PickWinnersFromEntries(entries, 20);

console.log("Drawing winners...")

WriteWinners(winners);

console.info(`Draw complete at ${(new Date()).toISOString()}`)