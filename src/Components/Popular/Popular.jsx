import React, { useState, useEffect } from 'react';
import './Popular.css'
import Item from '../Item/Item'

const Popular = () => {

    const [ popularInWomen, setPopularProducts ] = useState([])

    useEffect(() => {
        fetch('https://bloom-backend-five.vercel.app/popularinwomen')
        .then((response) => response.json())
        .then((data) => setPopularProducts(data))
    }, [])

    return (
        <div className='popular'>
            <h1>POPULAR IN WOMEN</h1>
            <hr />
            <div className="popular-item">
                {popularInWomen.map((item, i) => {
                    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
            })}
            </div>
        </div>
    );
}

export default Popular;