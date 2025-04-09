import React, { useContext, useState } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import './PaymentGateway.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51QUUgMRxVP5eUbdNbdLYmdtpz3YJK67GiRl9Y7X8OFhS2zM7PBGVPmtX9VrHvqD8LtBi8VysjfNTrr1wwCUnkhTE00ovW6wN22');

const CheckoutForm = ({ totalAmount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setErrorMessage('Stripe is not initialized.');
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setErrorMessage('Please enter your card details.');
            return;
        }

        setErrorMessage(null);
        setIsProcessing(true);

        try {
            const response = await fetch('https://bloom-backend-five.vercel.app/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalAmount * 100, currency: 'eur' }),
            });

            const { clientSecret } = await response.json();

            const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (paymentError) {
                setErrorMessage(paymentError.message);
                setIsProcessing(false);
                navigate('/unsuccess');
            } else {
                console.log('Payment successful', paymentIntent);
                setIsProcessing(false);
                navigate('/success');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setErrorMessage('Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button className='strange-thing' type="submit" disabled={!stripe || isProcessing}>
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

const PaymentGateway = () => {
    const { all_product, cartItems } = useContext(ShopContext);
    const [selectedOption, setSelectedOption] = useState('Shipping');
    const [selectedDelivery, setSelectedDelivery] = useState('Free');

    const getTotalAmount = () => {
        return Object.keys(cartItems).reduce((total, productKey) => {
            const [productId] = productKey.split('-');
            const product = all_product.find(item => item.id === parseInt(productId));
            return product ? total + product.new_price * cartItems[productKey] : total;
        }, 0);
    };

    const shippingFee = selectedDelivery === 'Paid' ? 10 : 0;
    const totalAmount = getTotalAmount() + shippingFee;

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleDeliveryChange = (delivery) => {
        setSelectedDelivery(delivery);
    };

    const getArticles = () => {
        return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
    };

    const shippingFeeBeutify = selectedDelivery === 'Paid' ? "€10" : "Free";

    const getDeliveryDate = () => {
        const today = new Date();
        let deliveryDate = new Date(today);
    
        if (selectedDelivery === 'Free') {
            deliveryDate.setDate(today.getDate() + 14);
        } else if (selectedDelivery === 'Paid') {
            deliveryDate.setDate(today.getDate() + 3);
        }

        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        return deliveryDate.toLocaleDateString('en-GB', options);
    };

    return (
        <div className="paymentgateway">
            <h1>Payment</h1>
            <div className="paymentgateway-cnt">
                <div className="left">
                    <div className="delivery-options">
                        <h2>Details</h2>
                        <div className="btns">
                            <button
                                className={selectedOption === 'Shipping' ? 'selected' : ''}
                                onClick={() => handleOptionChange('Shipping')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21.004 7.975V6c0-2.206-1.794-4-4-4h-10c-2.206 0-4 1.794-4 4v1.998l-.076.004A1 1 0 0 0 2 9v2a1 1 0 0 0 1 1h.004v6c0 .735.403 1.372.996 1.72V21a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h10v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.276A1.994 1.994 0 0 0 21.004 18v-6a1 1 0 0 0 1-1V9.062a1.006 1.006 0 0 0-.072-.455c-.203-.487-.635-.604-.928-.632zM19.006 18H5.004v-5h14.001l.001 5zM11.004 7v4h-6V7h6zm8 0v4h-6V7h6zm-12-3h10c.736 0 1.375.405 1.722 1H5.282c.347-.595.986-1 1.722-1z"></path><circle cx="7.5" cy="15.5" r="1.5"></circle><circle cx="16.5" cy="15.5" r="1.5"></circle></svg>Shipping
                            </button>
                            <button
                                className={selectedOption === 'Withdraw' ? 'selected' : ''}
                                onClick={() => handleOptionChange('Withdraw')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 5c0-1.654-1.346-3-3-3H5C3.346 2 2 3.346 2 5v2.831c0 1.053.382 2.01 1 2.746V19c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-8.424c.618-.735 1-1.692 1-2.746V5zm-2 0v2.831c0 1.14-.849 2.112-1.891 2.167L18 10c-1.103 0-2-.897-2-2V4h3c.552 0 1 .449 1 1zM10 4h4v4c0 1.103-.897 2-2 2s-2-.897-2-2V4zM4 5c0-.551.448-1 1-1h3v4c0 1.103-.897 2-2 2l-.109-.003C4.849 9.943 4 8.971 4 7.831V5zm6 14v-3h4v3h-4zm6 0v-3c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v3H5v-7.131c.254.067.517.111.787.125A3.988 3.988 0 0 0 9 10.643c.733.832 1.807 1.357 3 1.357s2.267-.525 3-1.357a3.988 3.988 0 0 0 3.213 1.351c.271-.014.533-.058.787-.125V19h-3z"></path></svg>Withdraw
                            </button>
                        </div>

                        {selectedOption === 'Shipping' && (
                            <div className="shipping">
                                <div className="cnt-ship">
                                    <div>
                                        <p>name*</p>
                                        <input type="text" className="name" />
                                    </div>
                                    <div>
                                        <p>surname*</p>
                                        <input type="text" className="surname" />
                                    </div>
                                </div>
                                <p>address and house number*</p>
                                <input type="text" className="address" />
                                <div className="cnt-ship">
                                    <div>
                                        <p>city*</p>
                                        <input type="text" className="city" />
                                    </div>
                                    <div>
                                        <p>ZIP*</p>
                                        <input type="text" className="zip" />
                                    </div>
                                    <div>
                                        <p>country*</p>
                                        <input type="text" className="country" />
                                    </div>
                                </div>
                                <div className="cnt-ship">
                                    <div>
                                        <p>email*</p>
                                        <input type="text" className="email" />
                                    </div>
                                    <div>
                                        <p>phone number*</p>
                                        <input type="text" className="phone" />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                    <hr />
                    <h3>Select your preferred shipping speed</h3>
                    <div className="delivery">
                        <div
                            className={`free ${selectedDelivery === 'Free' ? 'selected' : ''}`}
                            onClick={() => handleDeliveryChange('Free')}
                        >
                            <h4><span>Free</span></h4>
                            <h4>1-2 weeks delivery</h4>
                        </div>
                        <div
                            className={`paid ${selectedDelivery === 'Paid' ? 'selected' : ''}`}
                            onClick={() => handleDeliveryChange('Paid')}
                        >
                            <h4><span>€10,00</span></h4>
                            <h4>2-3 days delivery</h4>
                        </div>
                    </div>
                    <hr />
                    <h3 className='details-item'>Enter your card details</h3>
                    <div className="test">
                        <Elements stripe={stripePromise}>
                            <CheckoutForm className='strange-thing' totalAmount={totalAmount} />
                        </Elements>
                    </div>
                </div>
                <div className="right">
                    <h2>Cart ({getArticles()} Items)</h2>
                    <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>€{getTotalAmount().toFixed(2)}</p>
                    </div>
                    <div className="cartitems-total-item">
                        <p>Shipping Fee</p>
                        <p>{shippingFeeBeutify}</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <p>Total</p>
                        <p>€{totalAmount.toFixed(2)}</p>
                    </div>
                    <h3>Arrives by {getDeliveryDate()}</h3>
                    {Object.keys(cartItems).map((productKey) => {
                        const [productId, size] = productKey.split('-');
                        const product = all_product.find(item => item.id === parseInt(productId));

                        if (cartItems[productKey] > 0 && product) {
                            return (
                                <div key={productKey} className='payment-products-cnt'>
                                    <div className="payment-products">
                                        <img src={product.images?.[0]} className='image-pay' />
                                        <div>
                                            <p className='name'>{product.name}</p>
                                            <p className='size'>size: {size}</p>
                                            <p className='quantity'>quantity: {cartItems[productKey]} x €{product.new_price}</p>
                                            <p className='price'>
                                                {product.new_price * cartItems[productKey] === 0 ? 'FREE' : `€${product.new_price * cartItems[productKey]}`}
                                            </p>
                                        </div>
                                    </div>                               
                                    <hr />
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;
