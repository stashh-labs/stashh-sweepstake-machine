const utils = require('./utils');
const data = require('./data');

const ENTRY_FILES = ['./data/d1.json','./data/d2.json'];
const PARTICIPANT_FILES = ['./data/users.json'];
const WINNERS_TO_DRAW = 20;

// Load all the valid participants
const participants = data.LoadParticipants(PARTICIPANT_FILES)

// Generate tickets from entries after filtering out any from ineligible participants
const tickets = data.GenerateTicketsFromEntries(ENTRY_FILES, participants);

// Conduct the draw
const winners = utils.ConductDraw(tickets, participants, WINNERS_TO_DRAW);

// Write results
utils.WriteWinners(winners);