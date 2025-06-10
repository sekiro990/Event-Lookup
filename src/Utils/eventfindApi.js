import axios from "axios";

// ✅ Load from environment variables
const TICKETMASTER_API_KEY = process.env.REACT_APP_TICKETMASTER_API_KEY;
const BASE_URL = process.env.REACT_APP_TICKETMASTER_API_URL || "https://app.ticketmaster.com/discovery/v2/events.json";

export const fetchEvents = async (rows = 100) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: TICKETMASTER_API_KEY,
        city: "Melbourne",
        countryCode: "AU",
        size: rows,
        sort: "date,asc",
      },
    });

    const rawEvents = response.data._embedded?.events || [];
    const uniqueEventsMap = new Map();

    for (const ev of rawEvents) {
      const nameKey = ev.name?.toLowerCase().trim();
      if (!nameKey || uniqueEventsMap.has(nameKey)) continue;

      uniqueEventsMap.set(nameKey, {
        id: ev.id,
        name: ev.name || "Untitled Event",
        image: ev.images?.[0]?.url || null,
        description: ev.info || "",
        venue: ev._embedded?.venues?.[0]?.name || "Venue TBA",
        date: ev.dates?.start?.dateTime || "",
        url: ev.url || "#",
      });
    }

    return Array.from(uniqueEventsMap.values());
  } catch (error) {
    console.error("❌ Error fetching Ticketmaster events:", error.message);
    return [];
  }
};
