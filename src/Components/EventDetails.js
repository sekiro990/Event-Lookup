import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById } from "../Utils/eventfindApi";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import "../Styles/EventDetails.css";

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const loadEvent = async () => {
      const data = await fetchEventById(id);
      setEvent(data);
    };
    loadEvent();
  }, [id]);

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("eventId", "==", id),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!user) return alert("You must be logged in to comment.");
    if (!commentText.trim()) return;

    await addDoc(collection(db, "comments"), {
      eventId: id,
      userId: user.uid,
      userName: user.displayName,
      text: commentText,
      timestamp: serverTimestamp(),
    });

    setCommentText("");
  };

  if (!event) return <p>Loading event details...</p>;

  return (
    <div className="event-detail-page">
      <h1 className="event-details-title">{event.name}</h1>

      {event.image ? (
        <img src={event.image} alt={event.name} className="event-details-image" />
      ) : (
        <div className="image-placeholder">No Image Available</div>
      )}

      <p className="event-description">{event.description || "No description provided."}</p>
      <p className="event-meta"><strong>📍 Venue:</strong> {event.venue}</p>
      <p className="event-meta"><strong>🗓️ Date:</strong> {new Date(event.date).toLocaleString()}</p>

      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="event-link-button"
      >
        Buy Tickets / More Info
      </a>

      <hr style={{ margin: "40px 0", borderColor: "#444" }} />

      <div className="comments-section">
        <h3 style={{ color: "#ff9800" }}>Comments</h3>

        {user ? (
          <div className="comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              className="comment-textarea"
            />
            <button onClick={handleCommentSubmit} className="event-link-button">
              Post
            </button>
          </div>
        ) : (
          <p>Please log in to comment.</p>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p style={{ color: "#aaa" }}>No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment">
                <strong>{c.userName}</strong>
                <p>{c.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
