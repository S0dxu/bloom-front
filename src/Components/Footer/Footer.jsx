import React from 'react';
import './Footer.css';
import instagram_icon from '../Assets/instagram_icon.png';
import pintester_icon from '../Assets/pintester_icon.png';
import whatsapp_icon from '../Assets/whatsapp_icon.png';

const Footer = () => {
    return (
        <div className='footer'>
            <div className="footer-logo">
                <p>BLOOM</p>
            </div>
            {/* <div className="footer-social-icon">
                <div className="footer-icons-cnt">
                    <img src={instagram_icon} alt="" />
                </div>
                <div className="footer-icons-cnt">
                    <img src={pintester_icon} alt="" />
                </div>
                <div className="footer-icons-cnt">
                    <img src={whatsapp_icon} alt="" />
                </div>
            </div> */}
            <div className="footer-copyright">
                <hr />
                <p>Copyright © 2024 - All</p>
            </div>
        </div>
    );
}

export default Footer;