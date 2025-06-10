
import EventCard from '../Components/Cards';
import './Home.css'; // Styling for the home page
import sport from "../Assets/sports.webp";
import concert from "../Assets/concert.webp";
import comedy from "../Assets/comedy.jpg";

const Home = () => {
  return (
    <div className="home-container">
      {/* Home Page Title and Description */}
      <h1 className="home-title">Welcome to Our Event Booking App</h1>
      <p className="home-description">
      
      </p>
      
      {/* Featured Events Section */}
      <h2 className="featured-events-title">Featured Events</h2>
      <div className="event-cards-container">
        <EventCard
          title="Sports Event"
          description="Join the thrilling sports event with teams battling it out on the field!"
          imageSrc={sport}
        />
        <EventCard
          title="Live Concert"
          description="Enjoy an unforgettable live music experience with top artists!"
          imageSrc={concert}
        />
        <EventCard
          title="Comedy Show"
          description="Laugh out loud at the funniest comedians performing live!"
          imageSrc={comedy}
        />
      </div>
    </div>
  );
};

export default Home;
