import React, { useState } from 'react';
import './DropDown.css'; 

const Dropdown = ({ buttonText, dropdownItems }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState({});

    const handleSubMenuToggle = (e, index) => {
        e.stopPropagation();
        setIsSubMenuOpen((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                {buttonText}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {dropdownItems.map((item, index) => (
                    <li key={index} className="dropdown-item-container">
                        {item.subItems ? (
                            <div className="dropdown-submenu">
                                <button className="dropdown-item dropdown-toggle" type="button" onClick={(e) => handleSubMenuToggle(e, index)}>
                                    {item.text}
                                </button>
                                <ul className={`dropdown-menu dropdown-submenu-items ${isSubMenuOpen[index] ? 'show' : ''}`}>
                                    {item.subItems.map((subItem, subIndex) => (
                                        <li key={subIndex}>
                                            <button className="dropdown-item" onClick={subItem.onClick}>{subItem.text}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <button className="dropdown-item" onClick={item.onClick}>{item.text}</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropdown;
