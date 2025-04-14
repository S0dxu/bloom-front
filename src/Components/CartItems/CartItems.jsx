import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import paypal_icon from '../Assets/PayPal.svg.png';

const CartItems = (props) => {
    const { all_product, cartItems, removeToCart, incrementItemQuantity } = useContext(ShopContext);
    const [isFavorite, setIsFavorite] = useState(false);

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

    const getTotalAmount = () => {
        const totalAmount = Object.keys(cartItems).reduce((total, productKey) => {
            const [productId, size] = productKey.split('-');
            const product = all_product.find(item => item.id === parseInt(productId));

            if (product && product.new_price !== undefined) {
                return total + (product.new_price * cartItems[productKey]);
            }
            return total;
        }, 0);

        return totalAmount.toFixed(2);
    };

    const handleIncrement = (productKey, productId, size) => {
        const cartQuantity = cartItems[productKey];
        const product = all_product.find(item => item.id === parseInt(productId));
        if (!product) return;

        const selectedSizeData = product.sizes.find((sizeData) => sizeData.name === size);
        if (!selectedSizeData) return;

        const availableQuantity = selectedSizeData.quantity;

        if (availableQuantity === 0) {
            return;
        }

        if (cartQuantity >= availableQuantity) {
            return;
        }

        if (cartQuantity >= 5) {
            return;
        }

        incrementItemQuantity(productId, size);
    };

    const getArticles = () => {
        return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
    };

    if (!all_product || all_product.length === 0) {
        return (
            <div className="loader-wrapper">
                <div className="loader"></div>
            </div>
        );
    }    

    return (
        <div className='cartitems'>
            <div className="cartitems-list">
                <h1>Cart</h1>
                <div className="mobile">
                    <p><span>{getArticles()} Articles</span>| <span></span>€{getTotalAmount()}</p>
                    <hr />
                </div>
                {Object.keys(cartItems).map((productKey) => {
                    const [productId, size] = productKey.split('-');
                    const product = all_product.find(item => item.id === parseInt(productId));

                    if (cartItems[productKey] > 0 && product) {
                        const selectedSizeData = product.sizes.find((sizeData) => sizeData.name === size);
                        const availableQuantity = selectedSizeData ? selectedSizeData.quantity : 0;
                        const isButtonDisabled = cartItems[productKey] >= 5 || availableQuantity === 0;

                        const sizeMessage = availableQuantity < 5 && availableQuantity > 0
                            ? `Only ${availableQuantity} left`
                            : "Available";

                        return (
                            <div key={productKey}>
                                <div className="cartitems-format cartitems-format-main">
                                    <Link to={`/product/${product.id}`}>
                                        <img 
                                            onClick={() => window.scrollTo(0, 0)}
                                            src={product.images?.[0]} 
                                            alt="" 
                                            className='carticon-product-icon' 
                                        />
                                    </Link>
                                    <div className='fuckyou'>
                                        <p className='name'>{product.name}</p>
                                        <p className='size'>size: {size}</p>
                                        {/* <p className='gift'>Gift Options</p> */}
                                        {/* <p className='old_price'>{product.old_price > 0 ? `€${product.old_price * cartItems[productKey]}` : null}</p> */}
                                        <p className='price'>
                                            {product.new_price * cartItems[productKey] === 0 ? 'FREE' : `€${product.new_price * cartItems[productKey]}`}
                                        </p>
                                    </div>
                                </div>
                                <div className='todf'>
                                    <div className="obj">
                                        <i
                                            className={`bx ${cartItems[productKey] === 1 ? 'bx-trash' : 'bx-minus'}`}
                                            onClick={() => removeToCart(productKey)}
                                        ></i>
                                        <p className='cartitems-quanity'>{cartItems[productKey]}</p>
                                        <i
                                            className={`bx bx-plus ${isButtonDisabled || cartItems[productKey] >= availableQuantity ? 'disabled' : ''}`}
                                            onClick={() => handleIncrement(productKey, productId, size)}
                                        ></i>
                                    </div>
                                    <p>{sizeMessage}</p>
                                </div>
                                <hr />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Summary</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>€{getTotalAmount()}</p>
                        </div>
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Total</p>
                            <p>€{getTotalAmount()}</p>
                        </div>
                    </div>
                    <hr />
                    <Link to="/payment">
                        <button>Go to payment</button>
                    </Link>
                    {/* <button className='paypal'><img src={paypal_icon} alt="" /></button> */}
                </div>
            </div>
        </div>
    );
};

export default CartItems;
