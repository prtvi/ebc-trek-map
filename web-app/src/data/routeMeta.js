const PP = (date, assetCount) => {
	const out = [];

	for (let i = 1; i <= assetCount; i++) {
		out.push(
			`https://res.cloudinary.com/dbedchkny/image/upload/EBC/${date}/${date}-${i}.webp`,
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
		notes: 'Return journey from EBC to Lukla via Pheriche, Tengboche and Namche. Long descent days. But really proud to have completed the descent in 2 days.',
	},

	// point to point and day wise routes
	'Lukla - Phakding': {
		day: 'Day 1',
		date: '2026-02-14',
		pictures: PP('2026-02-14', 6),
		notes: 'Short descent from Lukla to Phakding. First day on the trail, kinda tiring but beautiful views of the villages and mountains. Good food at Phakding.',
	},
	'Phakding - Namche Bazaar': {
		day: 'Day 2',
		date: '2026-02-15',
		pictures: PP('2026-02-15', 16),
		notes: 'Tough climb up to Namche. Crossed the high suspension bridges. Entered the Sagarmatha National Park. Witnessed snowfall for the first time. Rest day tomorrow for acclimatisation.',
	},
	'Namche Bazaar - Dole': {
		day: 'Day 4',
		date: '2026-02-17',
		pictures: PP('2026-02-17', 14),
		notes: 'Left the main EBC trail for the Gokyo route. Steep climb to Mong La then through the forest to Dole. Quieter trail, fewer trekkers. Felt like the longest trail so far.',
	},
	'Dole - Macchermo': {
		day: 'Day 5',
		date: '2026-02-18',
		pictures: PP('2026-02-18', 6),
		notes: 'Short day to Macchermo. Shorter distance so did not take many breaks. Views were amazing.',
	},
	'Macchermo - Gokyo': {
		day: 'Day 6',
		date: '2026-02-19',
		pictures: PP('2026-02-19', 10),
		notes: 'Reached Gokyo village by the lake. Stunning turquoise water. One of the best viewpoints of the trek. Rest day tomorrow for acclimatisation.',
	},
	'Gokyo - Dragnag': {
		day: 'Day 8',
		date: '2026-02-21',
		pictures: PP('2026-02-21', 16),
		notes: 'Crossed the Ngozumpa glacier to Dragnag. Rocky, uneven terrain. Felt very difficult to get there.',
	},
	'Dragnag - Cho La': {
		day: 'Day 8',
		date: '2026-02-21',
		pictures: PP('2026-02-21', 16),
		notes: 'Felt very very tiriging to get to the top of the Cho La pass. Steep climb on snow and rock, then descent to Dzonglha. Most challenging day so far.',
	},
	'Cho La - Dzonglha': {
		day: 'Day 8',
		date: '2026-02-21',
		pictures: PP('2026-02-21', 16),
		notes: 'Completed the Cho La crossing and descended to Dzonglha. Barely made it by the end of the day. Experienced extreme cold and snowfall. Good rest at Dzonglha.',
	},
	'Dzonglha - Lobuche': {
		day: 'Day 9',
		date: '2026-02-22',
		pictures: PP('2026-02-22', 8),
		notes: 'Short walk to Lobuche. The trail was gentler than expected. Good rest at Lobuche.',
	},
	'Lobuche - Gorak Shep': {
		day: 'Day 10',
		date: '2026-02-23',
		pictures: PP('2026-02-23', 9),
		notes: 'EBC day! Rocky trail beside the Khumbu glacier to Gorak Shep. Had some good breakfast here and left for EBC.',
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
		notes: 'Walked back from EBC to Gorak Shep. Same trail in reverse. Spent a little time for snacks at Gorak Shep and descended to Lobuche.',
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
		notes: 'Long descent to Pheriche. Much easier breathing at lower altitude. Got some good hydration here; didn\'t stop here, planned to target reaching Namche Bazaar today.',
	},
	'Pheriche - Pangboche': {
		day: 'Day 11',
		date: '2026-02-24',
		pictures: PP('2026-02-24', 7),
		notes: 'Continued down to Pangboche. Warmer and more vegetation; feeling the benefit of losing altitude.',
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
		notes: 'Down to Namche. Steep drop to the river then climb back to Namche. Celebrated with a shower and a proper meal at the stay.',
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
		notes: 'Full day from Gokyo over the Ngozumpa glacier to Dragnag, then over Cho La pass to Dzonglha. Long and demanding; glacier crossing in the morning, pass in the afternoon. One of the most challenging days of the entire trek.',
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
