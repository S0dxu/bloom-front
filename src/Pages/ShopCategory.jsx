import React, { useContext, useState, useRef, useEffect } from 'react';
import './CSS/ShopCategory.css';
import { Link } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
    const { all_product } = useContext(ShopContext);

    const [sortVisible, setSortVisible] = useState(false);
    const [sortOption, setSortOption] = useState('');
    const [visibleCount, setVisibleCount] = useState(30);

    const sortMenuRef = useRef(null);

    const sortMapping = {
        'Price: Low to High': (a, b) => a.new_price - b.new_price,
        'Price: High to Low': (a, b) => b.new_price - a.new_price,
        'Name: A to Z': (a, b) => a.name.localeCompare(b.name),
        'Name: Z to A': (a, b) => b.name.localeCompare(a.name),
    };

    const filteredProducts = [...all_product]
        .filter(item => item.category === props.category)
        .sort(sortMapping[sortOption] || (() => 0));

    const visibleProducts = filteredProducts.slice(0, visibleCount);

    const toggleSortMenu = () => {
        setSortVisible(!sortVisible);
    };

    const handleSortChange = (option) => {
        setSortOption(option);
        setSortVisible(false);
        setVisibleCount(30);
    };

    const handleClickOutside = (event) => {
        if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
            setSortVisible(false);
        }
    };

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

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
                visibleCount < filteredProducts.length
            ) {
                setVisibleCount(prev => Math.min(prev + 30, filteredProducts.length));
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [visibleCount, filteredProducts.length]);

    return (
        <div className='shop-category'>
            <div className="shopcategory-indexSort">
                <div className='lenght'>
                    <p>{props.category.charAt(0).toUpperCase() + props.category.slice(1)}'s Shoes</p>
                    <div className='pc'>({filteredProducts.length})</div>
                </div>

                <div className="shopcategory-sort" ref={sortMenuRef}>
                    <div onClick={toggleSortMenu} className="sort-label">
                        Sort by {sortOption || 'Default'} <i className='bx bx-slider-alt'></i>
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

            <div className="mobile">
                <hr />
                <p className='results'>{filteredProducts.length} Results</p>
            </div>

            <div className="shopcategory-products">
                {visibleProducts.map((item, i) => (
                    <Item 
                        key={i} 
                        id={item.id} 
                        name={item.name}
                        category={item.category}
                        image={item.images?.[0]}
                        new_price={item.new_price} 
                        old_price={item.old_price}
                        sale={item.discount}
                    />
                ))}
            </div>

            {visibleCount >= filteredProducts.length && (
                <p className="no-more"></p>
            )}
        </div>
    );
}

export default ShopCategory;
