import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById } from "../Utils/eventfindApi";
import { getAuth } from "firebase/auth";
import { db } from "../firebase"; // Your Firestore config
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

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
      timestamp: new Date(),
    });

    setCommentText("");
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="event-detail-page">
      <h1>{event.name}</h1>
      {event.image && <img src={event.image} alt={event.name} />}
      <p>{event.description}</p>
      <p>📍 {event.venue}</p>
      <p>🗓️ {event.date}</p>
      <a href={event.url} target="_blank" rel="noopener noreferrer">
        More Info / Buy Tickets
      </a>

      <hr />

      <div className="comments-section">
        <h3>Comments</h3>
        {user ? (
          <>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
            />
            <button onClick={handleCommentSubmit}>Post</button>
          </>
        ) : (
          <p>Please log in to comment.</p>
        )}

        <div className="comments-list">
          {comments.map((c) => (
            <div key={c.id} className="comment">
              <strong>{c.userName}</strong>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
