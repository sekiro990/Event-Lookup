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
    if (!id) return;

    const loadEvent = async () => {
      const data = await fetchEventById(id);
      setEvent(data);
    };

    loadEvent();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, "comments"),
      where("eventId", "==", id),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Realtime snapshot received:", data);
        setComments(data);
      },
      (error) => {
        console.error("Error fetching comments:", error);
      }
    );

    return () => unsubscribe();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!user) return alert("You must be logged in to comment.");
    if (!commentText.trim()) return;

    try {
      await addDoc(collection(db, "comments"), {
        eventId: id,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        text: commentText,
        timestamp: serverTimestamp(),
      });
      setCommentText("");
    } catch (err) {
      console.error("Failed to submit comment:", err);
    }
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

      <hr />

      <div className="comments-section">
        <h3>💬 Comments</h3>

        {user ? (
          <div className="comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              rows={4}
            />
            <button onClick={handleCommentSubmit}>Post Comment</button>
          </div>
        ) : (
          <p className="login-message">Please log in to comment.</p>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment">
                <div className="comment-header">
                  <strong>{c.userName}</strong>
                  <span className="comment-date">
                    {c.timestamp?.toDate
                      ? new Date(c.timestamp.toDate()).toLocaleString()
                      : "Just now"}
                  </span>
                </div>
                <p className="comment-text">{c.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
