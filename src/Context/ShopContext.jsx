import React, { useState, createContext, useEffect } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        fetch('https://bloom-backend-five.vercel.app/allproducts')
            .then((response) => response.json())
            .then((data) => setAll_Product(data));

        if (localStorage.getItem('auth-token')) {
            fetch('https://bloom-backend-five.vercel.app/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: "",
            }).then((response) => response.json())
                .then((data) => setCartItems(data));
        }
    }, []);

    useEffect(() => {
        console.log(cartItems);
    }, [cartItems]);

    const addToCart = (itemId, size) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev };
            const itemKey = `${itemId}-${size}`;

            if (updatedCart[itemKey] !== undefined && !isNaN(updatedCart[itemKey])) {
                updatedCart[itemKey] += 1;
            } else {
                updatedCart[itemKey] = 1;
            }

            if (localStorage.getItem('auth-token')) {
                fetch('https://bloom-backend-five.vercel.app/addtocart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId, size }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (!data.success) {
                            console.error(data.errors);
                        }
                    })
                    .catch((error) => console.error(error));
            }

            return updatedCart;
        });
    };

    const incrementItemQuantity = (itemId, size) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev };
            const itemKey = `${itemId}-${size}`;

            if (updatedCart[itemKey]) {
                updatedCart[itemKey] += 1;
            } else {
                updatedCart[itemKey] = 1;
            }

            if (localStorage.getItem('auth-token')) {
                fetch('https://bloom-backend-five.vercel.app/addtocart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId, size }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (!data.success) {
                            console.error(data.errors);
                        }
                    })
                    .catch((error) => console.error(error));
            }

            return updatedCart;
        });
    };

    const removeToCart = (productKey) => {
        const [productId, size] = productKey.split('-');

        fetch('https://bloom-backend-five.vercel.app/removetocart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'auth-token': `${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId: productId, size: size }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setCartItems((prevCartItems) => {
                    const updatedCart = { ...prevCartItems };
                    const itemKey = `${productId}-${size}`;
                    if (updatedCart[itemKey] > 1) {
                        updatedCart[itemKey] -= 1;
                    } else {
                        delete updatedCart[itemKey];
                    }
                    return updatedCart;
                });
            } else {
                console.error('Error removing item');
            }
        })
        .catch((error) => console.error(error));
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemKey in cartItems) {
            if (cartItems[itemKey] > 0) {
                const [itemId, size] = itemKey.split('-');
                let itemInfo = all_product.find((product) => product.id === Number(itemId));
                if (itemInfo) {
                    const itemPrice = itemInfo.new_price;
                    totalAmount += itemPrice * cartItems[itemKey];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItems = 0;
        for (const itemKey in cartItems) {
            if (cartItems[itemKey] > 0) {
                totalItems += cartItems[itemKey];
            }
        }
        return totalItems;
    };

    const contextValue = { getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeToCart, incrementItemQuantity };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
