// MediaCard.jsx
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './Card.css'

const MediaCard = ({ image, title, description, context, source }) => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                sx={{ height: 140 }}
                image={image}
                title={title}
            />
            <CardContent>
                <Typography gutterBottom variant="h6" component="div" classes='hline'>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}   
                </Typography>
                <Typography variant="body3" color="text.secondary">
                    <span>Context : {context} </span><br />
                    <span>source : {source} </span>
                </Typography>
            </CardContent>
        </Card>
    );
}

export default MediaCard;
