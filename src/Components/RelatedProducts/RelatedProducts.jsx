import React, { useState, useEffect } from 'react';
import './RelatedProducts.css';

const RelatedProducts = () => {
    const [randomProducts, setRandomProducts] = useState([]);
    const [error, setError] = useState(null);
    const [favoriteStatus, setFavoriteStatus] = useState({});

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const token = localStorage.getItem('auth-token');
                if (!token) return;

                const response = await fetch(`https://bloom-backend-five.vercel.app/getfavorites`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                });

                const favorites = await response.json();
                const favoritesMap = {};
                favorites.forEach((id) => {
                    favoritesMap[id] = true;
                });

                setFavoriteStatus(favoritesMap);
            } catch (error) {
                console.error('Error fetching favorite status:', error);
            }
        };

        fetchFavoriteStatus();
    }, []);

    const toggleFavorite = async (productId) => {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const isCurrentlyFavorite = favoriteStatus[productId];
            const url = isCurrentlyFavorite
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
                setFavoriteStatus((prevStatus) => ({
                    ...prevStatus,
                    [productId]: !isCurrentlyFavorite,
                }));
            } else {
                console.error(result.message || 'Failed to update favorite status.');
            }
        } catch (error) {
            console.error('Error updating favorite status:', error);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://bloom-backend-five.vercel.app/allproducts');
                if (response.ok) {
                    const products = await response.json();
                    if (products.length > 0) {
                        const shuffled = products.sort(() => 0.5 - Math.random());
                        const selectedProducts = shuffled.slice(0, 4);
                        setRandomProducts(selectedProducts);
                    } else {
                        setError("No products found.");
                    }
                } else {
                    setError("Error retrieving products.");
                }
            } catch (error) {
                console.error("Error:", error);
                setError("Unable to fetch products.");
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = (productId) => {
        window.location.href = `${productId}`;
    };

    return (
        <div className='relatedproducts'>
            <h1>You may also like</h1>
            <div className="relatedproducts-container">
                {error ? (
                    <p className="error-message">{error}</p>
                ) : randomProducts.length > 0 ? (
                    randomProducts.map((product) => (
                        <div
                            className="relatedproducts-item"
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                        >
                            <i
                                className={`bx ${favoriteStatus[product.id] ? 'heart2 bxs-heart' : 'heart2 bx-heart'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(product.id);
                                }}
                            ></i>
                            <img
                                src={product.images?.[0]}
                                alt={`Product ${product.name}`}
                                className="product-image"
                            />
                            <h2>{product.name}</h2>
                            <div>
                                {product.new_price === 0 && (
                                    <div className="productdisplay-right-price-new">FREE</div>
                                )}

                                {product.new_price > 0 && product.old_price <= product.new_price && (
                                    <div className="productdisplay-right-price-new">€{product.new_price}</div>
                                )}

                                {product.new_price > 0 && product.old_price > product.new_price && (
                                    <div className="productdisplay-right-price-new">€{product.new_price}</div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No related products found.</div>
                )}
            </div>
        </div>
    );
};

export default RelatedProducts;
