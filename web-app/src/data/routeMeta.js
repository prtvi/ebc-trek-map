const PP = (date, assetCount) => {
	const out = [];

	for (let i = 1; i <= assetCount; i++) {
		out.push(
			`https://res.cloudinary.com/dbedchkny/image/upload/v1772697057/EBC/${date}/${date}-${i}.webp`,
		);
	}

	return out;
};

export const routeMeta = {
	// full routes
	'Lukla - Everest Base Camp Monument': {
		day: 'Started on',
		date: '2026-02-14',
		pictures: [...PP('2026-02-14', 6), ...PP('2026-02-15', 16), ...PP('2026-02-17', 14), ...PP('2026-02-18', 6), ...PP('2026-02-19', 10), ...PP('2026-02-21', 16), ...PP('2026-02-22', 8), ...PP('2026-02-23', 9)],
		notes: 'Full trek from Lukla to EBC. Acclimatisation days at Namche and Gokyo. Cho La pass and final push to base camp.',
	},
	'Everest Base Camp Monument - Lukla': {
		day: 'Ended on',
		date: '2026-02-25',
		pictures: [...PP('2026-02-24', 7), ...PP('2026-02-25', 5)],
		notes: 'Return journey from EBC to Lukla via Pheriche, Tengboche and Namche. Long descent days.',
	},

	// point to point and day wise routes
	'Lukla - Phakding': {
		day: 'Day 1',
		date: '2026-02-14',
		pictures: PP('2026-02-14', 6),
		notes: 'Short descent from Lukla to Phakding. First day on the trail, easy walk alongside the Dudh Koshi. Stayed at a teahouse with great dal bhat.',
	},
	'Phakding - Namche Bazaar': {
		day: 'Day 2',
		date: '2026-02-15',
		pictures: PP('2026-02-15', 16),
		notes: 'Tough climb up to Namche. Crossed the high suspension bridges. First views of Everest from the viewpoint above Namche. Rest day tomorrow for acclimatisation.',
	},
	'Namche Bazaar - Dole': {
		day: 'Day 4',
		date: '2026-02-17',
		pictures: PP('2026-02-17', 14),
		notes: 'Left the main EBC trail for the Gokyo route. Steep climb to Mong La then through rhododendron forest to Dole. Quieter trail, fewer trekkers.',
	},
	'Dole - Macchermo': {
		day: 'Day 5',
		date: '2026-02-18',
		pictures: PP('2026-02-18', 6),
		notes: 'Short day to Macchermo. Altitude starting to bite. Had a good rest and hydrated well. Views of Cho Oyu improving.',
	},
	'Macchermo - Gokyo': {
		day: 'Day 6',
		date: '2026-02-19',
		pictures: PP('2026-02-19', 10),
		notes: 'Reached Gokyo village by the lake. Stunning turquoise water. Afternoon walk up Gokyo Ri for panoramic views — Everest, Lhotse, Makalu, Cho Oyu. One of the best viewpoints of the trek.',
	},
	'Gokyo - Dragnag': {
		day: 'Day 8',
		date: '2026-02-21',
		pictures: PP('2026-02-21', 16),
		notes: 'Crossed the Ngozumpa glacier to Dragnag. Rocky, uneven terrain. Early start to get across before afternoon sun. Tired but excited for Cho La tomorrow.',
	},
	'Dragnag - Cho La': {
		day: 'Day 8',
		date: '2026-02-21',
		pictures: PP('2026-02-21', 16),
		notes: 'Cho La pass day. Steep climb on snow and rock, then descent to Dzonglha. Most challenging day so far. Started before dawn with headlamps.',
	},
	'Cho La - Dzonglha': {
		day: 'Day 8',
		date: '2026-02-21',
		pictures: PP('2026-02-21', 16),
		notes: 'Completed the Cho La crossing and descended to Dzonglha. Rejoined the main EBC route. Cold and windy on the pass; relief to reach the lodge.',
	},
	'Dzonglha - Lobuche': {
		day: 'Day 9',
		date: '2026-02-22',
		pictures: PP('2026-02-22', 8),
		notes: 'Short walk to Lobuche. Passed the memorial stupas for climbers who did not return. Altitude noticeable; took it slow and drank plenty of water.',
	},
	'Lobuche - Gorak Shep': {
		day: 'Day 10',
		date: '2026-02-23',
		pictures: PP('2026-02-23', 9),
		notes: 'Final push to Gorak Shep. Rocky trail beside the Khumbu glacier. Settled in at the lodge — EBC tomorrow!',
	},
	'Gorak Shep - Everest Base Camp Monument': {
		day: 'Day 10',
		date: '2026-02-23',
		pictures: PP('2026-02-23', 9),
		notes: 'Reached Everest Base Camp! Touched the monument, took photos, celebrated. Fulfilled a long-held dream. Weather was clear and cold.',
	},
	'Everest Base Camp Monument - Gorak Shep': {
		day: 'Day 10',
		date: '2026-02-23',
		pictures: PP('2026-02-23', 9),
		notes: 'Walked back from EBC to Gorak Shep. Same trail in reverse. Spent a second night at Gorak Shep before descending.',
	},
	'Gorak Shep - Lobuche': {
		day: 'Day 10',
		date: '2026-02-23',
		pictures: PP('2026-02-23', 9),
		notes: 'Started the descent to Lobuche. Legs felt good going downhill. EBC day complete; beginning the journey home.',
	},
	'Lobuche - Pheriche': {
		day: 'Day 11',
		date: '2026-02-24',
		pictures: PP('2026-02-24', 7),
		notes: 'Long descent to Pheriche. Much easier breathing at lower altitude. Stopped at the medical post in Pheriche for a quick check.',
	},
	'Pheriche - Pangboche': {
		day: 'Day 11',
		date: '2026-02-24',
		pictures: PP('2026-02-24', 7),
		notes: 'Continued down to Pangboche. Visited the old monastery. Warmer and more vegetation; feeling the benefit of losing altitude.',
	},
	'Pangboche - Tengboche': {
		day: 'Day 11',
		date: '2026-02-24',
		pictures: PP('2026-02-24', 7),
		notes: 'Short descent to Tengboche. Famous monastery with incredible mountain views. One of the most scenic spots on the return.',
	},
	'Tengboche - Namche Bazaar': {
		day: 'Day 11',
		date: '2026-02-24',
		pictures: PP('2026-02-24', 7),
		notes: 'Down to Namche. Steep drop to the river then climb back to Namche. Celebrated with a shower and a proper meal at the bakery.',
	},
	'Namche Bazaar - Phakding': {
		day: 'Day 12',
		date: '2026-02-25',
		pictures: PP('2026-02-25', 5),
		notes: 'Descent to Phakding. Last night on the trail. Bought a few souvenirs in Namche before leaving.',
	},
	'Phakding - Lukla': {
		day: 'Day 12',
		date: '2026-02-25',
		pictures: PP('2026-02-25', 5),
		notes: 'Final stretch to Lukla. Early flight out tomorrow. Trek complete — unforgettable experience from start to finish.',
	},

	// day wise routes
	'Gokyo - Dzonglha': {
		day: 'Day 8',
		date: '2026-02-21',
		pictures: PP('2026-02-21', 16),
		notes: 'Full day from Gokyo over the Ngozumpa glacier to Dragnag, then over Cho La pass to Dzonglha. Long and demanding; glacier crossing in the morning, pass in the afternoon.',
	},
	'Lobuche - Everest Base Camp Monument': {
		day: 'Day 10',
		date: '2026-02-23',
		pictures: PP('2026-02-23', 9),
		notes: 'Lobuche to Gorak Shep, then to Everest Base Camp and back. The big day — reached EBC, touched the monument, and returned to Gorak Shep.',
	},
	'Everest Base Camp Monument - Lobuche': {
		day: 'Day 10',
		date: '2026-02-23',
		pictures: PP('2026-02-23', 9),
		notes: 'Return from EBC and Gorak Shep down to Lobuche. End of the high-altitude section; descent begins in earnest.',
	},
	'Lobuche - Namche Bazaar': {
		day: 'Day 11',
		date: '2026-02-24',
		pictures: PP('2026-02-24', 7),
		notes: 'Long descent day: Lobuche → Pheriche → Pangboche → Tengboche → Namche. Covered a lot of ground; felt good to drop altitude.',
	},
	'Namche Bazaar - Lukla': {
		day: 'Day 12',
		date: '2026-02-25',
		pictures: PP('2026-02-25', 5),
		notes: 'Final day: Namche to Phakding to Lukla. Trek complete. Flight from Lukla scheduled for next morning.',
	},
};
