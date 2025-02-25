import React, { useState, useEffect, useRef } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';

const AllProducts = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [sortVisible, setSortVisible] = useState(false);
    const [sortOption, setSortOption] = useState('Name: A to Z');

    const sortMenuRef = useRef(null);

    const sortMapping = {
        'Price: Low to High': (a, b) => a.new_price - b.new_price,
        'Price: High to Low': (a, b) => b.new_price - a.new_price,
        'Name: A to Z': (a, b) => a.name.localeCompare(b.name),
        'Name: Z to A': (a, b) => b.name.localeCompare(a.name),
    };

    const handleSortChange = (option) => {
        setSortOption(option);
        const sortedProducts = [...allProducts].sort(sortMapping[option]);
        setAllProducts(sortedProducts);
        setSortVisible(false);
    };

    const toggleSortMenu = () => {
        setSortVisible(!sortVisible);
    };

    const handleClickOutside = (event) => {
        if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
            setSortVisible(false);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://ah873hdsha98h2wuisah9872.onrender.com/allproducts');
                const data = await response.json();
                setAllProducts(data);
            } catch (error) {
                console.error('Error fetching all products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (sortVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sortVisible]);

    const totalProducts = allProducts.length;

    return (
        <div className='all-products'>
            <div className='cnt-products-header'>
                <div>
                    <h1 className='pc'>New Arrivals ({totalProducts})</h1>
                    <h1 className='mobile'>New Arrivals</h1>
                    <hr className='mobile'/>
                    <h2 className='mobile result'>{totalProducts} Results</h2>
                </div>
                <div>
                    <div className="sort" ref={sortMenuRef}>
                        <div onClick={toggleSortMenu} className="sort-label">
                            {sortOption} <i className='bx bx-slider-alt'></i>
                        </div>
                        {sortVisible && (
                            <div className="sort-menu">
                                {Object.keys(sortMapping).map((option) => (
                                    <div
                                        key={option}
                                        className="sort-option"
                                        onClick={() => handleSortChange(option)}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="product-list">
                {allProducts.map((product) => (
                    <Item
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        image={product.images?.[0]}
                        category={product.category}
                        new_price={product.new_price}
                        old_price={product.old_price}
                    />
                ))}
            </div>
        </div>
    );
};

export default AllProducts;
