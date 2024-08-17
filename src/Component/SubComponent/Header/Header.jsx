import React from 'react'
import { Logo_Header } from '../../../Assets/photos'
import './Header.css'
import Dropdown from '../../DesignComponent/Dropdown/DropDown'
import { HiMenuAlt3 } from "react-icons/hi";
const Header = () => {
    const dropdownItems = [
        { text: 'About Cricket360', href: '#' },
        { text: 'About Me', href: '#' },
        { text: 'Help', href: '#' },
        { text: 'Feedback', href: '#' },
      ];
    return (
        <div className="mainHeader">
            <div className="container-fluid pt-3">
            <div className="container Header">
                <div className="logo">
                    <img src={Logo_Header} alt="" />
                </div>
                <div className="nav">
                <Dropdown buttonText={<HiMenuAlt3 />} dropdownItems={dropdownItems} />
                </div>
            </div>
        </div>
        </div>
    )
}

export default Header
