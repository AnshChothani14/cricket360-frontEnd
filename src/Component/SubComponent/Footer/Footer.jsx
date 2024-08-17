import React from 'react';
import './Footer.css'; // Ensure you have a CSS file for the styles

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__container bd-container">
                <h2 className="footer__title">Clay Doe</h2>
                <p className="footer__description">I am Clay Doe and this is my personal website, consult me here.</p>

                <div className="footer__social">
                    <a href="#" className="footer__link"><i className="bx bxl-linkedin"></i></a>
                    <a href="#" className="footer__link"><i className="bx bxl-github"></i></a>
                    <a href="#" className="footer__link"><i className="bx bxl-codepen"></i></a>
                </div>
                <p className="footer__copy">&#169; 2024 Clay Doe. All right reserved</p>
            </div>
        </footer>
    );
}

export default Footer;
