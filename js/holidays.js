const HOLIDAYS_2026 = {
  restricted: [
    { date: "2026-01-26", day: "Monday",    name: "Republic Day",               month: "January" },
    { date: "2026-03-17", day: "Tuesday",   name: "Holi",                        month: "March" },
    { date: "2026-04-14", day: "Tuesday",   name: "Dr. B.R. Ambedkar Jayanti",   month: "April" },
    { date: "2026-08-15", day: "Saturday",  name: "Independence Day",            month: "August" },
    { date: "2026-10-02", day: "Friday",    name: "Gandhi Jayanti",              month: "October" },
    { date: "2026-10-22", day: "Thursday",  name: "Dussehra (Vijaya Dashami)",   month: "October" },
    { date: "2026-11-12", day: "Thursday",  name: "Diwali (Deepavali)",          month: "November" },
    { date: "2026-12-25", day: "Friday",    name: "Christmas Day",               month: "December" },
  ],
  floating: [
    { date: "2026-01-14", day: "Wednesday", name: "Makar Sankranti / Pongal",    month: "January" },
    { date: "2026-01-23", day: "Friday",    name: "Netaji Jayanti",              month: "January" },
    { date: "2026-02-26", day: "Thursday",  name: "Mahashivratri",               month: "February" },
    { date: "2026-03-25", day: "Wednesday", name: "Holi (First Day)",            month: "March" },
    { date: "2026-03-30", day: "Monday",    name: "Ram Navami",                  month: "March" },
    { date: "2026-04-06", day: "Monday",    name: "Mahavir Jayanti",             month: "April" },
    { date: "2026-04-17", day: "Friday",    name: "Good Friday",                 month: "April" },
    { date: "2026-05-23", day: "Saturday",  name: "Buddha Purnima",              month: "May" },
    { date: "2026-06-17", day: "Wednesday", name: "Eid ul Adha (Bakrid)",        month: "June" },
    { date: "2026-06-26", day: "Friday",    name: "Muharram (Ashura)",           month: "June" },
    { date: "2026-08-27", day: "Thursday",  name: "Janmashtami",                 month: "August" },
    { date: "2026-09-05", day: "Saturday",  name: "Ganesh Chaturthi",            month: "September" },
    { date: "2026-11-05", day: "Thursday",  name: "Guru Nanak Jayanti",          month: "November" },
  ]
};

// Holiday knowledge for "Ask Anything"
const HOLIDAY_QA = [
  {
    keywords: ["next holiday", "upcoming holiday", "next off", "next break", "when is next"],
    answer: () => {
      const today = new Date();
      const all = [...HOLIDAYS_2026.restricted, ...HOLIDAYS_2026.floating]
        .map(h => ({ ...h, dateObj: new Date(h.date) }))
        .filter(h => h.dateObj > today)
        .sort((a, b) => a.dateObj - b.dateObj);
      if (!all.length) return "There are no more holidays scheduled for 2026.";
      const next = all[0];
      const isFloating = HOLIDAYS_2026.floating.some(f => f.date === next.date);
      const diff = Math.ceil((next.dateObj - today) / (1000 * 60 * 60 * 24));
      return `The next upcoming holiday is <strong>${next.name}</strong> on <strong>${next.day}, ${formatDate(next.date)}</strong> — ${diff} day${diff !== 1 ? 's' : ''} from today. It is a <strong>${isFloating ? 'Floating' : 'Restricted'} Holiday</strong>.`;
    }
  },
  {
    keywords: ["how many holidays", "total holidays", "number of holidays", "count holidays"],
    answer: () => `There are <strong>${HOLIDAYS_2026.restricted.length} Restricted Holidays</strong> and <strong>${HOLIDAYS_2026.floating.length} Floating Holidays</strong> in 2026 — a total of <strong>${HOLIDAYS_2026.restricted.length + HOLIDAYS_2026.floating.length} holidays</strong>.`
  },
  {
    keywords: ["diwali", "deepavali"],
    answer: () => `<strong>Diwali (Deepavali)</strong> falls on <strong>Thursday, 12 November 2026</strong>. It is a <strong>Restricted Holiday</strong>.`
  },
  {
    keywords: ["holi"],
    answer: () => `<strong>Holi</strong> this year: The first day (Holika Dahan) is a Floating Holiday on <strong>Wednesday, 25 March 2026</strong>. The main Holi is a <strong>Restricted Holiday</strong> on <strong>Tuesday, 17 March 2026</strong>.`
  },
  {
    keywords: ["republic day", "republic"],
    answer: () => `<strong>Republic Day</strong> is on <strong>Monday, 26 January 2026</strong>. It is a <strong>Restricted Holiday</strong>.`
  },
  {
    keywords: ["independence day", "15 august", "august 15"],
    answer: () => `<strong>Independence Day</strong> is on <strong>Saturday, 15 August 2026</strong>. It is a <strong>Restricted Holiday</strong>.`
  },
  {
    keywords: ["gandhi jayanti", "gandhi", "2 october", "october 2"],
    answer: () => `<strong>Gandhi Jayanti</strong> is on <strong>Friday, 2 October 2026</strong>. It is a <strong>Restricted Holiday</strong>.`
  },
  {
    keywords: ["christmas", "25 december", "december 25"],
    answer: () => `<strong>Christmas Day</strong> falls on <strong>Friday, 25 December 2026</strong>. It is a <strong>Restricted Holiday</strong>.`
  },
  {
    keywords: ["eid", "bakrid", "eid ul adha"],
    answer: () => `<strong>Eid ul Adha (Bakrid)</strong> is on <strong>Wednesday, 17 June 2026</strong>. It is a <strong>Floating Holiday</strong>.`
  },
  {
    keywords: ["muharram", "ashura"],
    answer: () => `<strong>Muharram (Ashura)</strong> falls on <strong>Friday, 26 June 2026</strong>. It is a <strong>Floating Holiday</strong>.`
  },
  {
    keywords: ["good friday", "easter"],
    answer: () => `<strong>Good Friday</strong> is on <strong>Friday, 17 April 2026</strong>. It is a <strong>Floating Holiday</strong>.`
  },
  {
    keywords: ["janmashtami", "krishna"],
    answer: () => `<strong>Janmashtami</strong> falls on <strong>Thursday, 27 August 2026</strong>. It is a <strong>Floating Holiday</strong>.`
  },
  {
    keywords: ["restricted holiday", "restricted holidays", "restricted"],
    answer: () => {
      const list = HOLIDAYS_2026.restricted.map(h => `<strong>${h.name}</strong> (${formatDate(h.date)})`).join(', ');
      return `There are <strong>${HOLIDAYS_2026.restricted.length} Restricted Holidays</strong> in 2026: ${list}.`;
    }
  },
  {
    keywords: ["floating holiday", "floating holidays", "optional holiday"],
    answer: () => {
      const list = HOLIDAYS_2026.floating.map(h => `<strong>${h.name}</strong> (${formatDate(h.date)})`).join(', ');
      return `There are <strong>${HOLIDAYS_2026.floating.length} Floating Holidays</strong> in 2026: ${list}.`;
    }
  },
  {
    keywords: ["list all holidays", "show all holidays", "all holidays", "full holiday list"],
    answer: () => {
      const all = [...HOLIDAYS_2026.restricted.map(h => ({ ...h, type: 'Restricted' })),
                   ...HOLIDAYS_2026.floating.map(h => ({ ...h, type: 'Floating' }))]
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      return all.map(h => `<strong>${h.name}</strong> — ${formatDate(h.date)} (${h.type})`).join('<br>');
    }
  },
  {
    keywords: ["june holiday", "holidays in june"],
    answer: () => `In <strong>June 2026</strong> there are 2 holidays: <strong>Eid ul Adha (Bakrid)</strong> on 17 Jun (Floating) and <strong>Muharram (Ashura)</strong> on 26 Jun (Floating).`
  },
  {
    keywords: ["october holiday", "holidays in october"],
    answer: () => `In <strong>October 2026</strong> there are 2 holidays: <strong>Gandhi Jayanti</strong> on 2 Oct (Restricted) and <strong>Dussehra</strong> on 22 Oct (Restricted).`
  },
  {
    keywords: ["november holiday", "holidays in november"],
    answer: () => `In <strong>November 2026</strong> there are 2 holidays: <strong>Diwali</strong> on 12 Nov (Restricted) and <strong>Guru Nanak Jayanti</strong> on 5 Nov (Floating).`
  }
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getHolidayAnswer(query) {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  for (const qa of HOLIDAY_QA) {
    if (qa.keywords.some(k => q.includes(k))) {
      return qa.answer();
    }
  }
  // Generic fallback — check if any holiday name is mentioned
  const allH = [...HOLIDAYS_2026.restricted, ...HOLIDAYS_2026.floating];
  for (const h of allH) {
    if (q.includes(h.name.toLowerCase())) {
      const isFloating = HOLIDAYS_2026.floating.some(f => f.date === h.date);
      return `<strong>${h.name}</strong> is on <strong>${h.day}, ${formatDate(h.date)}</strong>. It is a <strong>${isFloating ? 'Floating' : 'Restricted'} Holiday</strong>.`;
    }
  }
  return `I can answer questions about <strong>public holidays in 2026</strong>. Try asking: "When is the next holiday?", "List all restricted holidays", or ask about a specific holiday like "When is Diwali?".`;
}
