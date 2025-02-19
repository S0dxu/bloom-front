import React from 'react';
import './Unsuccess.css';


const Unsuccess = () => {
    return (
        <div className='unsuccess'>
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="#b71b1b" stroke="#b71b1b" strokeWidth="2" d="M16 16 L36 36" /><path className="checkmark__check" fill="#b71b1b" stroke="#b71b1b" strokeWidth="2" d="M36 16 L16 36" /></svg>
            <p>Your transaction could not be completed. <br />
                Please check your payment details or try again later.</p>
        </div>
    );
}
export default Unsuccess;