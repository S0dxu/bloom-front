import React, { useState } from 'react';
import './Search.css';

const Search = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        console.log(`Searching for: ${searchQuery}`);
    };

    const clearInput = () => {
        setSearchQuery('');
    };

    return (
        <div className="search-dropdown">
            <button onClick={handleSearch}><i className='bx bx-search'></i></button>
            <input 
                type="text" 
                id="search-input"
                placeholder="Search" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <button 
                className="close-btn"
                onClick={clearInput}
            >
                <i className='bx bx-x'></i>
            </button>
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
    );
};

export default Search;
