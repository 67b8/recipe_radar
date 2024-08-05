import React from 'react';
import RatingShow from '../RatingShow/RatingShow'; // Adjust the import path based on your project structure

const RecipeCard = (props) => {
    return (
        <div className="card" style={{ width: "100%", height: "100%" }}>
            <img src={props.image} className="card-img-top" alt={props.recipename} style={{ objectFit: "cover", width: "100%", height: "200px" }} />
            <div className="card-body" style={{ minHeight: "150px" }}>
                <h5 className="card-title" style={{ minHeight: "50px", maxHeight: "50px", overflow: "hidden" }}>{props.recipename}</h5>
                
                <RatingShow rating={props.averageRating} /> 
                <p>{props.description}</p>
            </div>
        </div>
    );
};

export default RecipeCard;
