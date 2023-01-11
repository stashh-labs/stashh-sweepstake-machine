exports.LoadParticipants = function (filenames) {
    let participants = [];
    
    filenames.forEach(file => {
        participants = participants.concat(LoadValidParticipantsFromFile(file))
    });

    console.log(`${participants.length.toLocaleString()} participants are in the draw.`)


    return participants;
}

exports.GenerateTicketsFromEntries = function (filenames, participants) {
    let tickets = [];
    
    filenames.forEach(file => {
        tickets = tickets.concat(LoadValidEntriesFromFile(file,participants))
    });

    console.log(`${tickets.length.toLocaleString()} tickets are in the draw.`)

    return tickets;
};

function LoadValidParticipantsFromFile(filename) {
    const participants = require(filename);

    console.log(`Loaded ${participants.length.toLocaleString()} participants from '${filename}'`)

    return (participants);
}

function LoadValidEntriesFromFile(filename, participants) {
    const entries = require(filename);
    let validEntries = 0;
    const tickets = []

    entries.forEach(entry => {
        if (participants.some(participant => participant.address === entry.address)) {
            validEntries++;
            for (let i = 0; i < entry.count; i++) {
                tickets.push(entry)
            }
        }
    });

    console.log(`Loaded ${entries.length.toLocaleString()} entries from '${filename}' of which ${validEntries.toLocaleString()} are from valid participants resulting in ${tickets.length.toLocaleString()} tickets added to the draw.`)

    return tickets;
}