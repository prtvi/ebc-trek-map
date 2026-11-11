const PP = (date, assetCount) => {
	const out = [];

	for (let i = 0; i < assetCount; i++) {
		out.push(
			`https://res.cloudinary.com/dbedchkny/image/upload/EBC/${date}/${i}.webp`,
		);
	}

	return out;
};

const D = day => day.toLowerCase().replace(' ', '');

const TYPE_FULL = 'full';
const TYPE_DAY = 'day';
const TYPE_P2P = 'p2p'; // point to point

const DATE_FEB_14 = '2026-02-14';
const DATE_FEB_15 = '2026-02-15';
const DATE_FEB_17 = '2026-02-17';
const DATE_FEB_18 = '2026-02-18';
const DATE_FEB_19 = '2026-02-19';
const DATE_FEB_21 = '2026-02-21';
const DATE_FEB_22 = '2026-02-22';
const DATE_FEB_23 = '2026-02-23';
const DATE_FEB_24 = '2026-02-24';
const DATE_FEB_25 = '2026-02-25';

const DAY_1 = 'Day 1';
const DAY_2 = 'Day 2';
const DAY_4 = 'Day 4';
const DAY_5 = 'Day 5';
const DAY_6 = 'Day 6';
const DAY_8 = 'Day 8';
const DAY_9 = 'Day 9';
const DAY_10 = 'Day 10';
const DAY_11 = 'Day 11';
const DAY_12 = 'Day 12';

const FULL_LUKLA_2_EBC = 'Lukla - Everest Base Camp Monument';
const FULL_EBC_2_LUKLA = 'Everest Base Camp Monument - Lukla';

const DAY_LUKLA_2_PHAKDING = 'Lukla - Phakding';
const DAY_PHAKDING_2_NAMCHE = 'Phakding - Namche Bazaar';
const DAY_NAMCHE_2_DOLE = 'Namche Bazaar - Dole';
const DAY_DOLE_2_MACCHERMO = 'Dole - Macchermo';
const DAY_MACCHERMO_2_GOKYO = 'Macchermo - Gokyo';
const DAY_GOKYO_2_DZONGLHA = 'Gokyo - Dzonglha';
const DAY_LOBUCHE_2_EBC = 'Lobuche - Everest Base Camp Monument';
const DAY_EBC_2_LOBUCHE = 'Everest Base Camp Monument - Lobuche';
const DAY_LOBUCHE_2_NAMCHE = 'Lobuche - Namche Bazaar';
const DAY_NAMCHE_2_LUKLA = 'Namche Bazaar - Lukla';

const P2P_GOKYO_2_DRAGNAG = 'Gokyo - Dragnag';
const P2P_DRAGNAG_2_CHO_LA = 'Dragnag - Cho La';
const P2P_CHO_LA_2_DZONGLHA = 'Cho La - Dzonglha';
const P2P_DZONGLHA_2_LOBUCHE = 'Dzonglha - Lobuche';
const P2P_LOBUCHE_2_GORAK_SHEP = 'Lobuche - Gorak Shep';
const P2P_GORAK_SHEP_2_EBC = 'Gorak Shep - Everest Base Camp Monument';
const P2P_EBC_2_GORAK_SHEP = 'Everest Base Camp Monument - Gorak Shep';
const P2P_GORAK_SHEP_2_LOBUCHE = 'Gorak Shep - Lobuche';
const P2P_LOBUCHE_2_PHERICHE = 'Lobuche - Pheriche';
const P2P_PHERICHE_2_PANGBOCHE = 'Pheriche - Pangboche';
const P2P_PANGBOCHE_2_TENGBOCHE = 'Pangboche - Tengboche';
const P2P_TENGBOCHE_2_NAMCHE = 'Tengboche - Namche Bazaar';
const P2P_NAMCHE_2_PHAKDING = 'Namche Bazaar - Phakding';
const P2P_PHAKDING_2_LUKLA = 'Phakding - Lukla';

const PICS_FEB_14 = PP(DATE_FEB_14, 10);
// const PICS_FEB_14 = PP(DATE_FEB_14, 23);
const PICS_FEB_15 = PP(DATE_FEB_15, 14);
const PICS_FEB_17 = PP(DATE_FEB_17, 15);
const PICS_FEB_18 = PP(DATE_FEB_18, 9);
const PICS_FEB_19 = PP(DATE_FEB_19, 11);
const PICS_FEB_21 = PP(DATE_FEB_21, 15);
const PICS_FEB_22 = PP(DATE_FEB_22, 11);
const PICS_FEB_23 = PP(DATE_FEB_23, 16);
const PICS_FEB_24 = PP(DATE_FEB_24, 12);
const PICS_FEB_25 = PP(DATE_FEB_25, 11);

export const routeMeta = {
	// full routes
	[FULL_LUKLA_2_EBC]: {
		day: 'Started on',
		date: DATE_FEB_14,
		pictures: [...PICS_FEB_14], //, ...PICS_FEB_15, ...PICS_FEB_17, ...PICS_FEB_18, ...PICS_FEB_19, ...PICS_FEB_21, ...PICS_FEB_22, ...PICS_FEB_23],
		mediaEnabled: true,
		type: TYPE_FULL,
		notes: 'Full trek from Lukla to EBC. Acclimatisation days at Namche and Gokyo. Cho La pass and final push to base camp.',
	},
	[FULL_EBC_2_LUKLA]: {
		day: 'Ended on',
		date: DATE_FEB_25,
		pictures: [...PICS_FEB_24, ...PICS_FEB_25],
		mediaEnabled: false,
		type: TYPE_FULL,
		notes: 'Return journey from EBC to Lukla via Pheriche, Tengboche and Namche. Long descent days. But really proud to have completed the descent in 2 days.',
	},

	// point to point and day wise routes
	[DAY_LUKLA_2_PHAKDING]: {
		day: DAY_1,
		q: D(DAY_1),
		date: DATE_FEB_14,
		pictures: PICS_FEB_14,
		mediaEnabled: true,
		type: TYPE_DAY,
		notes: 'Short descent from Lukla to Phakding. First day on the trail, kinda tiring but beautiful views of the villages and mountains. Good food at Phakding.',
	},
	[DAY_PHAKDING_2_NAMCHE]: {
		day: DAY_2,
		q: D(DAY_2),
		date: DATE_FEB_15,
		pictures: PICS_FEB_15,
		mediaEnabled: false,
		type: TYPE_DAY,
		notes: 'Tough climb up to Namche. Crossed the high suspension bridges. Entered the Sagarmatha National Park. Witnessed snowfall for the first time. Rest day tomorrow for acclimatisation.',
	},
	[DAY_NAMCHE_2_DOLE]: {
		day: DAY_4,
		q: D(DAY_4),
		date: DATE_FEB_17,
		pictures: PICS_FEB_17,
		mediaEnabled: false,
		type: TYPE_DAY,
		notes: 'Left the main EBC trail for the Gokyo route. Steep climb to Mong La then through the forest to Dole. Quieter trail, fewer trekkers. Felt like the longest trail so far.',
	},
	[DAY_DOLE_2_MACCHERMO]: {
		day: DAY_5,
		q: D(DAY_5),
		date: DATE_FEB_18,
		pictures: PICS_FEB_18,
		mediaEnabled: false,
		type: TYPE_DAY,
		notes: 'Short day to Macchermo. Shorter distance so did not take many breaks. Views were amazing.',
	},
	[DAY_MACCHERMO_2_GOKYO]: {
		day: DAY_6,
		q: D(DAY_6),
		date: DATE_FEB_19,
		pictures: PICS_FEB_19,
		mediaEnabled: false,
		type: TYPE_DAY,
		notes: 'Reached Gokyo village by the lake. Stunning turquoise water. One of the best viewpoints of the trek. Rest day tomorrow for acclimatisation.',
	},
	[P2P_GOKYO_2_DRAGNAG]: {
		day: DAY_8,
		date: DATE_FEB_21,
		pictures: PICS_FEB_21,
		mediaEnabled: false,
		type: TYPE_P2P,
		notes: 'Crossed the Ngozumpa glacier to Dragnag. Rocky, uneven terrain. Felt very difficult to get there.',
	},
	[P2P_DRAGNAG_2_CHO_LA]: {
		day: DAY_8,
		date: DATE_FEB_21,
		pictures: PICS_FEB_21,
		mediaEnabled: false,
		type: TYPE_P2P,
		notes: 'Felt very very tiriging to get to the top of the Cho La pass. Steep climb on snow and rock, then descent to Dzonglha. Most challenging day so far.',
	},
	[P2P_CHO_LA_2_DZONGLHA]: {
		day: DAY_8,
		date: DATE_FEB_21,
		pictures: PICS_FEB_21,
		mediaEnabled: false,
		type: TYPE_P2P,
		notes: 'Completed the Cho La crossing and descended to Dzonglha. Barely made it by the end of the day. Experienced extreme cold and snowfall. Good rest at Dzonglha.',
	},
	[P2P_DZONGLHA_2_LOBUCHE]: {
		day: DAY_9,
		q: D(DAY_9),
		date: DATE_FEB_22,
		pictures: PICS_FEB_22,
		mediaEnabled: false,
		type: TYPE_DAY,
		notes: 'Short walk to Lobuche. The trail was gentler than expected. Good rest at Lobuche.',
	},
	[P2P_LOBUCHE_2_GORAK_SHEP]: {
		day: DAY_10,
		date: DATE_FEB_23,
		pictures: PICS_FEB_23,
		mediaEnabled: false,
		type: TYPE_P2P,
		notes: 'EBC day! Rocky trail beside the Khumbu glacier to Gorak Shep. Had some good breakfast here and left for EBC.',
	},
	[P2P_GORAK_SHEP_2_EBC]: {
		day: DAY_10,
		date: DATE_FEB_23,
		pictures: PICS_FEB_23,
		mediaEnabled: false,
		type: TYPE_P2P,
		notes: 'Reached Everest Base Camp! Touched the monument, took photos, celebrated. Fulfilled a long-held dream. Weather was clear and cold.',
	},
	[P2P_EBC_2_GORAK_SHEP]: {
		day: DAY_10,
		date: DATE_FEB_23,
		pictures: PICS_FEB_23,
		mediaEnabled: false,
		type: TYPE_P2P,
		notes: 'Walked back from EBC to Gorak Shep. Same trail in reverse. Spent a little time for snacks at Gorak Shep and descended to Lobuche.',
	},
	[P2P_GORAK_SHEP_2_LOBUCHE]: {
		day: DAY_10,
		date: DATE_FEB_23,
		pictures: PICS_FEB_23,
		mediaEnabled: false,
		type: TYPE_P2P,
		notes: 'Started the descent to Lobuche. Legs felt good going downhill. EBC day complete; beginning the journey home.',
	},
	[P2P_LOBUCHE_2_PHERICHE]: {
		day: DAY_11,
		date: DATE_FEB_24,
		pictures: PICS_FEB_24,
		mediaEnabled: false,
		type: TYPE_P2P,
		notes: "Long descent to Pheriche. Much easier breathing at lower altitude. Got some good hydration here; didn't stop here, planned to target reaching Namche Bazaar today.",
	},
	[P2P_PHERICHE_2_PANGBOCHE]: {
		day: DAY_11,
		date: DATE_FEB_24,
		pictures: PICS_FEB_24,
		mediaEnabled: false,
		type: TYPE_P2P,
		notes: 'Continued down to Pangboche. Warmer and more vegetation; feeling the benefit of losing altitude.',
	},
	[P2P_PANGBOCHE_2_TENGBOCHE]: {
		day: DAY_11,
		date: DATE_FEB_24,
		pictures: PICS_FEB_24,
		mediaEnabled: false,
		type: TYPE_P2P,
		notes: 'Short descent to Tengboche. Famous monastery with incredible mountain views. One of the most scenic spots on the return.',
	},
	[P2P_TENGBOCHE_2_NAMCHE]: {
		day: DAY_11,
		date: DATE_FEB_24,
		pictures: PICS_FEB_24,
		mediaEnabled: false,
		type: TYPE_P2P,
		notes: 'Down to Namche. Steep drop to the river then climb back to Namche. Celebrated with a shower and a proper meal at the stay.',
	},
	[P2P_NAMCHE_2_PHAKDING]: {
		day: DAY_12,
		date: DATE_FEB_25,
		pictures: PICS_FEB_25,
		mediaEnabled: false,
		type: TYPE_P2P,
		notes: 'Descent to Phakding. Last night on the trail. Bought a few souvenirs in Namche before leaving.',
	},
	[P2P_PHAKDING_2_LUKLA]: {
		day: DAY_12,
		date: DATE_FEB_25,
		pictures: PICS_FEB_25,
		mediaEnabled: false,
		type: TYPE_P2P,
		notes: 'Final stretch to Lukla. Early flight out tomorrow. Trek complete — unforgettable experience from start to finish.',
	},

	// day wise routes
	[DAY_GOKYO_2_DZONGLHA]: {
		day: DAY_8,
		q: D(DAY_8),
		date: DATE_FEB_21,
		pictures: PICS_FEB_21,
		mediaEnabled: false,
		type: TYPE_DAY,
		notes: 'Full day from Gokyo over the Ngozumpa glacier to Dragnag, then over Cho La pass to Dzonglha. Long and demanding; glacier crossing in the morning, pass in the afternoon. One of the most challenging days of the entire trek.',
	},
	[DAY_LOBUCHE_2_EBC]: {
		day: DAY_10,
		q: D(DAY_10),
		date: DATE_FEB_23,
		pictures: PICS_FEB_23,
		mediaEnabled: false,
		type: TYPE_DAY,
		notes: 'Lobuche to Gorak Shep, then to Everest Base Camp and back. The big day — reached EBC, touched the monument, and returned to Gorak Shep.',
	},
	[DAY_EBC_2_LOBUCHE]: {
		day: DAY_10,
		q: D(DAY_10),
		date: DATE_FEB_23,
		pictures: PICS_FEB_23,
		mediaEnabled: false,
		type: TYPE_DAY,
		notes: 'Return from EBC and Gorak Shep down to Lobuche. End of the high-altitude section; descent begins in earnest.',
	},
	[DAY_LOBUCHE_2_NAMCHE]: {
		day: DAY_11,
		q: D(DAY_11),
		date: DATE_FEB_24,
		pictures: PICS_FEB_24,
		mediaEnabled: false,
		type: TYPE_DAY,
		notes: 'Long descent day: Lobuche → Pheriche → Pangboche → Tengboche → Namche. Covered a lot of ground; felt good to drop altitude.',
	},
	[DAY_NAMCHE_2_LUKLA]: {
		day: DAY_12,
		q: D(DAY_12),
		date: DATE_FEB_25,
		pictures: PICS_FEB_25,
		mediaEnabled: false,
		type: TYPE_DAY,
		notes: 'Final day: Namche to Phakding to Lukla. Trek complete. Flight from Lukla scheduled for next morning.',
	},
};
