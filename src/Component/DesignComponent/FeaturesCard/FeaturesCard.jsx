import React from 'react';
import PropTypes from 'prop-types';
import './FeaturesCard.css';

const FeaturesCard = ({ title, featureGif }) => (
    <div className="featuresCard">
        <img src={featureGif}  alt={title} />
        <h4>{title}</h4>
    </div>
);

FeaturesCard.propTypes = {
    title: PropTypes.string.isRequired,
    featureGif: PropTypes.string.isRequired,
};

export default FeaturesCard;
