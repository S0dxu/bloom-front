import React, { useState, useEffect } from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = (props) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const token = localStorage.getItem('auth-token');
                if (!token) return;

                const response = await fetch(`https://ah873hdsha98h2wuisah9872-nw0e.onrender.com/getfavorites`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                });

                const favorites = await response.json();
                if (favorites.includes(props.id)) {
                    setIsFavorite(true);
                }
            } catch (error) {
                console.error('Error fetching favorite status:', error);
            }
        };

        fetchFavoriteStatus();
    }, [props.id]);

    const toggleFavorite = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const url = isFavorite
                ? 'https://ah873hdsha98h2wuisah9872-nw0e.onrender.com/removefavorite'
                : 'https://ah873hdsha98h2wuisah9872-nw0e.onrender.com/addfavorite';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({ itemId: props.id }),
            });

            const result = await response.json();

            if (result.success) {
                setIsFavorite(!isFavorite);
            } else {
                console.error(result.message || 'Failed to update favorite status.');
            }
        } catch (error) {
            console.error('Error updating favorite status:', error);
        }
    };

    const calculateDiscount = (oldPrice, newPrice) => {
        if (!oldPrice || !newPrice) return 0;
        return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    };

    const discount = calculateDiscount(props.old_price, props.new_price);

    return (
        <div className="item">
            <Link to={`/product/${props.id}`}>
                <img
                    onClick={() => window.scrollTo(0, 0)}
                    src={props.image}
                    alt=""
                />
            </Link>
            <i
                className={`bx ${isFavorite ? 'heart bxs-heart' : 'heart bx-heart'}`}
                onClick={toggleFavorite}
            ></i>
            <p className="name">{props.name}</p>
            <p className="category">{props.category}'s shoes</p>
            <p className="colour">1 Colour</p>
            <div className="item-prices">
                <div className="item-price-new">
                    {props.new_price === 0 ? 'FREE' : `€${props.new_price}`}
                </div>
                {props.old_price > props.new_price && (
                    <div className="item-price-old">
                        <s>€{props.old_price}</s>
                    </div>
                )}
            </div>
            {props.new_price === 0 && <p className="discount">Save 100%</p>}
            {discount > 0 && props.new_price !== 0 && (
                <p className="discount">Save {discount}%</p>
            )}
        </div>
    );
};

export default Item;
