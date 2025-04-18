import React, { useState, useContext, useEffect } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart, cartItems } = useContext(ShopContext);

    const [selectedSize, setSelectedSize] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sizeMessage, setSizeMessage] = useState("");

    const mainImage = product.images[currentImageIndex];

    useEffect(() => {
        if (!props.id) return;
        const fetchFavoriteStatus = async () => {
            try {
                const token = localStorage.getItem('auth-token');
                if (!token) return;

                const response = await fetch('https://bloom-backend-five.vercel.app/getfavorites', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                });

                const favorites = await response.json();
                setIsFavorite(favorites.includes(props.id));
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
                ? 'https://bloom-backend-five.vercel.app/removefavorite'
                : 'https://bloom-backend-five.vercel.app/addfavorite';

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

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleSizeSelect = (size, quantity) => {
        setSelectedSize(size);
        if (quantity < 5 && quantity > 0) {
            setSizeMessage(`Only ${quantity} left`);
        } else {
            setSizeMessage("");
        }
    };

    const renderStars = (stars) => {
        if (typeof stars !== 'number' || stars < 0 || stars > 5) {
            return <div>
                <i className='bx bx-star'></i>
                <i className='bx bx-star'></i>
                <i className='bx bx-star'></i>
                <i className='bx bx-star'></i>
                <i className='bx bx-star'></i>
            </div>;
        }

        return Array.from({ length: 5 }, (_, index) => (
            <img
                key={index}
                src={index < stars ? <i className='bx bx-star'></i> : <i className='bx bxs-star'></i>}
                alt=""
            />
        ));
    };

    const renderRecensions = (recensions) => {
        if (!Array.isArray(recensions) || recensions.length === 0) {
            return <span>(0)</span>;
        }

        return (
            <ul>
                {recensions.map((review, index) => (
                    <li key={index}>{review}</li>
                ))}
            </ul>
        );
    };

    const renderSizes = (sizes) => {
        if (!sizes || sizes.length === 0) {
            return <p>No sizes available</p>;
        }

        sizes.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
    
        return sizes.map(({ name, quantity }, index) => (
            <div
                key={index}
                className={`productdisplay-size-option ${quantity > 0 ? 'products-available' : 'products-unavailable'} ${selectedSize === name ? 'selected' : ''}`}
                onClick={() => quantity > 0 && handleSizeSelect(name, quantity)}
            >
                <span>{name}</span>
            </div>
        ));
    };    

    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeMessage('Please select a size');
            return;
        }
    
        const cartKey = `${product.id}-${selectedSize}`;
        const currentQuantity = cartItems?.[cartKey] || 0;

        const selectedSizeData = product.sizes.find((size) => size.name === selectedSize);
        if (!selectedSizeData) {
            setSizeMessage('Selected size not found');
            return;
        }
    
        const availableQuantity = selectedSizeData.quantity;

        if (currentQuantity >= 5) {
            setSizeMessage('You cannot add more than 5 of this item.');
            return;
        }

        if (currentQuantity >= availableQuantity) {
            setSizeMessage(`You cannot add more than ${availableQuantity} of this size.`);
            return;
        }

        addToCart(product.id, selectedSize);
    };

    return (
        <div className='productdisplay'>
            <h1 className='name'>{product.name}</h1>
            <p className="cate">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}'s Shoes</p>
            <div className="productdisplay-right-prices">
                {product.new_price === 0 && (
                    <div className="productdisplay-right-price-new">FREE</div>
                )}
                {product.new_price > 0 && product.old_price > product.new_price && (
                    <div className='productdisplay-price-div'>
                        <div className="productdisplay-right-price-new">€{product.new_price}</div>
                        <div className="productdisplay-right-price-old">€{product.old_price}</div>
                        
                        <div>
                            {product.new_price === 0 && (
                                <p className="discount">Save 100%</p>
                            )}
                            {product.old_price > product.new_price && (
                                <p className="discount">Save {Math.round(((product.old_price - product.new_price) / product.old_price) * 100)}%</p>
                            )}
                        </div>
                    </div>
                )}
                {product.new_price > 0 && product.old_price <= product.new_price && (
                    <div className="productdisplay-right-price-new">€{product.new_price}</div>
                )}
            </div>

            <div className="productdisplay-left">
                <div className="productdisplay-img-container">
                    <button className="arrow left-arrow" onClick={handlePreviousImage}>
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M15.525 18.966L8.558 12l6.967-6.967"></path></svg>
                    </button>
                    <img src={mainImage} alt="Main product" className="productdisplay-main-img" />
                    <button className="arrow right-arrow" onClick={handleNextImage}>
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M8.474 18.966L15.44 12 8.474 5.033"></path></svg>
                    </button>
                </div>
                <div className="productdisplay-img-list">
                    {product.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Product ${idx}`}
                            onMouseEnter={() => setCurrentImageIndex(idx)}
                            className={currentImageIndex === idx ? 'selected' : ''}
                        />
                    ))}
                </div>
            </div>
            <div className="productdisplay-right">
                <h1 className='pc'>{product.name}</h1>
                <p className="category pc">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}'s Shoes</p>
                <div className="productdisplay-right-prices-pc">
                    {product.new_price === 0 && (
                        <div className="productdisplay-right-price-new">FREE</div>
                    )}
                    {product.new_price > 0 && product.old_price > product.new_price && (
                        <div className='productdisplay-price-div'>
                            <div className="productdisplay-right-price-new">€{product.new_price}</div>
                            <div className="productdisplay-right-price-old">€{product.old_price}</div>
                            
                            <div>
                                {product.new_price === 0 && (
                                    <p className="discount">Save 100%</p>
                                )}
                                {product.old_price > product.new_price && (
                                    <p className="discount">Save {Math.round(((product.old_price - product.new_price) / product.old_price) * 100)}%</p>
                                )}
                            </div>
                        </div>
                    )}
                    {product.new_price > 0 && product.old_price <= product.new_price && (
                        <div className="productdisplay-right-price-new">€{product.new_price}</div>
                    )}
                </div>
                <div className="productdisplay-description">
                    <p>{product.description}</p>
                </div>
                <div className='productdisplay-size-cnt'>
                    <h1 className='pc'>Select Size</h1>
                    <div className='productdisplay-size'>
                        {renderSizes(product.sizes)}
                    </div>
                </div>
                {sizeMessage && (
                    <p className="size-quantity-message">{sizeMessage}</p>
                )}
                <button onClick={handleAddToCart} className="productdisplay-button">ADD TO CART</button>
                <button onClick={toggleFavorite} className="productdisplay-fav-button">
                    {isFavorite ? 'REMOVE FROM FAVORITES' : 'ADD TO FAVORITES'}
                    <i className={`bx ${isFavorite ? 'bxs-heart' : 'bx-heart'}`}></i>
                </button>
                {/* <div className="productdisplay-stars">
                    <p>Recentions{renderRecensions(product.recensions)}</p>
                    <div>
                        <div>{renderStars(product.stars)}</div>
                        <i className='bx bx-chevron-down' ></i>
                    </div>
                </div>
                <hr /> */}
            </div>
        </div>
    );
};


export default ProductDisplay;
