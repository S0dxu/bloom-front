import React, { useEffect, useState } from 'react';
import './Favorites.css';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [favoriteStatus, setFavoriteStatus] = useState({});
    const [allProducts, setAllProducts] = useState([]);
    const [randomProducts, setRandomProducts] = useState([]);

    useEffect(() => {
        const fetchFavoritesAndProducts = async () => {
            try {
                const token = localStorage.getItem('auth-token');
                if (!token) {
                    alert('You need to log in to view favorites.');
                    return;
                }

                const response = await fetch('https://bloom-backend-five.vercel.app/getfavorites', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                });

                const favoriteIds = await response.json();

                const productResponse = await fetch('https://bloom-backend-five.vercel.app/allproducts');
                const allProducts = await productResponse.json();

                setAllProducts(allProducts);

                const favoriteProducts = allProducts.filter(product =>
                    favoriteIds.includes(product.id)
                );

                setFavorites(favoriteProducts);

                const initialFavoriteStatus = favoriteProducts.reduce((acc, product) => {
                    acc[product.id] = true;
                    return acc;
                }, {});

                setFavoriteStatus(initialFavoriteStatus);

                const nonFavoriteProducts = allProducts.filter(product =>
                    !favoriteIds.includes(product.id)
                );

                const randomSelection = getRandomItems(nonFavoriteProducts, 6);
                setRandomProducts(randomSelection);

            } catch (error) {
                console.error('Error fetching favorites and products:', error);
            }
        };

        fetchFavoritesAndProducts();
    }, []);

    const getRandomItems = (arr, count) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const toggleFavorite = async (productId) => {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const url = favoriteStatus[productId]
                ? 'https://bloom-backend-five.vercel.app/removefavorite'
                : 'https://bloom-backend-five.vercel.app/addfavorite';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({ itemId: productId }),
            });

            const result = await response.json();

            if (result.success) {
                setFavoriteStatus(prevStatus => ({
                    ...prevStatus,
                    [productId]: !prevStatus[productId],
                }));
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

    return (
        <div className="favorites">
            <h1>Your Favorites</h1>
            {favorites.length > 0 ? (
                <div className="favorites-list">
                    {favorites.map((product) => {
                        const discount = calculateDiscount(product.old_price, product.new_price);

                        return (
                            <div key={product.id} className="favorite-item">
                                <Link to={`/product/${product.id}`}>
                                    <img src={product.images?.[0]}  alt={product.name} />
                                </Link>
                                <i
                                    className={`bx ${favoriteStatus[product.id] ? 'heart bxs-heart' : 'heart bx-heart'}`}
                                    onClick={() => toggleFavorite(product.id)}
                                ></i>
                                <div className="favorite-details">
                                    <p className="name">{product.name}</p>
                                    <p className="category">{product.category}</p>
                                    <div className="item-prices">
                                        <div className="item-price-new">
                                            {product.new_price === 0 ? 'FREE' : `€${product.new_price}`}
                                        </div>
                                        {product.old_price > product.new_price && (
                                            <div className="item-price-old">
                                                <s>€{product.old_price}</s>
                                            </div>
                                        )}
                                    </div>
                                    {/* {product.new_price === 0 && <p className="discount">Save 100%</p>}
                                    {discount > 0 && product.new_price !== 0 && (
                                        <p className="discount">Save {discount}%</p>
                                    )} */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div class="loader"></div>
            )}
            <br />
            <br />
            <h1>Find your next favorite item</h1>
            {randomProducts.length > 0 ? (
                <div className="favorites-list">
                    {randomProducts.map((product) => {
                        const discount = calculateDiscount(product.old_price, product.new_price);

                        return (
                            <div key={product.id} className="favorite-item">
                                <Link to={`/product/${product.id}`}>
                                    <img src={product.images?.[0]}  alt={product.name} />
                                </Link>
                                <i
                                    className={`bx ${favoriteStatus[product.id] ? 'heart bxs-heart' : 'heart bx-heart'}`}
                                    onClick={() => toggleFavorite(product.id)}
                                ></i>
                                <div className="favorite-details">
                                    
                                    <p className="name">{product.name}</p>
                                    <p className="category">{product.category}</p>
                                    <div className="item-prices">
                                        <div className="item-price-new">
                                            {product.new_price === 0 ? 'FREE' : `€${product.new_price}`}
                                        </div>
                                        {product.old_price > product.new_price && (
                                            <div className="item-price-old">
                                                <s>€{product.old_price}</s>
                                            </div>
                                        )}
                                    </div>
                                    {/* {product.new_price === 0 && <p className="discount">Save 100%</p>}
                                    {discount > 0 && product.new_price !== 0 && (
                                        <p className="discount">Save {discount}%</p>
                                    )} */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div class="loader"></div>
            )}
            <br />
        </div>
    );
};

export default Favorites;
