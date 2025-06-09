import React from "react";
import "../Styles/Cards.css"


const Cards = ({title,description,imageSrc}) => {
    return(
        <div className="event-card">
    <img src={imageSrc} alt={title} className="event-card-image" />
    <div className="event-card-content">
        <h3 className="event-card-title">{title}</h3>
        <p className="event-card-description">{description}</p>
        <button className="event-card-btn">Learn More</button>
    </div>
    </div>
    )
}

export default Cards