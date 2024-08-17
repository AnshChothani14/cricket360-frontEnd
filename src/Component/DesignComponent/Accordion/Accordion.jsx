import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ar, ball, bat, caption, wc, vc } from '../../../Assets/photos.js'
import './Accordion.css';


const AccordionExpandIcon = ({ data = [], teamName }) => {
    const roleIcons = {
        'Captain': caption,
        'All Rounder':ar,
        'Bowler': ball,
        'Batsman': bat,
        'Wicket Keeper': wc,
        'Vice Captain': vc
    };

    return (
        <Accordion className='AccordionMain'>
            <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel-content"
                id="panel-header"
            >
                <Typography><h4>{teamName}</h4></Typography>
            </AccordionSummary>
            <AccordionDetails>
                {data.map((item) => (
                    <div key={item.id} style={{ marginBottom: '10px' }} className='Accordion row'>
                        <div className="text-left col-4">
                            <Typography> {item.name} </Typography>
                        </div>

                        <div className="text-left col-4">
                            <Typography>
                            <img src={roleIcons[item.role]} alt={item.role} style={{ width: '24px', height: '24px' }} />
                            </Typography>
                        </div>
                        <div className="text-left col-4">
                            <Typography>
                                <h5>ID:</h5> {item.id}
                            </Typography>
                        </div>
                    </div>
                ))}
            </AccordionDetails>
        </Accordion>
    );
};

export default AccordionExpandIcon;