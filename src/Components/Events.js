import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEvents } from "../Utils/eventfindApi";
import "../Styles/Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      const eventData = await fetchEvents();
      console.log("✅ Events received:", eventData);
      setEvents(eventData);
    };
    loadEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="events-container">
      <h1 className="events-title">🎉 Upcoming Events in Melbourne</h1>

      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="events-search"
      />

      <div className="events-grid">
        {filteredEvents.map((event) => (
          <div key={event.id} className="event-card">
            <h2 className="event-name">{event.name}</h2>

            {event.image ? (
              <img
                src={event.image}
                alt={event.name}
                className="event-image"
              />
            ) : (
              <div className="event-placeholder">No image available</div>
            )}

            <p className="event-description">
              {event.description?.trim()
                ? event.description.slice(0, 200)
                : "No description available."}
            </p>

            <p className="event-location">📍 {event.venue || "Venue TBA"}</p>
            <p className="event-time">
              🗓️{" "}
              {event.date
                ? new Date(event.date).toLocaleString()
                : "Date TBA"}
            </p>

            <Link
              to={`/events/${event.id}`}
              className="event-link"
            >
              View Event
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
