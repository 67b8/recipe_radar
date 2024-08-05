import React from 'react';

const RatingShow = ({ rating }) => {
    // Assuming rating is a number between 1 and 5
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<span key={i} style={{ color: '#ffc107' }}>&#9733;</span>);
            } else {
                stars.push(<span key={i} style={{ color: '#e4e5e9' }}>&#9733;</span>);
            }
        }
        return stars;
    };

    return (
        <div>
            {renderStars()}
            <span style={{ marginLeft: '0.5rem', fontSize: '1.2rem' }}></span>
        </div>
    );
};

export default RatingShow;
