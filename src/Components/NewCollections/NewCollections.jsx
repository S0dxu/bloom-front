import React, { useState, useEffect, useRef, useCallback } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';

const AllProducts = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [sortVisible, setSortVisible] = useState(false);
    const [sortOption, setSortOption] = useState('Name: A to Z');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [totalProducts, setTotalProducts] = useState(0);
    const limit = 30;

    const sortMapping = {
        'Price: Low to High': 'price-asc',
        'Price: High to Low': 'price-desc',
        'Name: A to Z': 'name-asc',
        'Name: Z to A': 'name-desc',
    };

    const sortMenuRef = useRef(null);

    const toggleSortMenu = () => {
        setSortVisible(!sortVisible);
    };

    const handleClickOutside = (event) => {
        if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
            setSortVisible(false);
        }
    };

    const fetchProducts = useCallback(async (pageToLoad = page, reset = false) => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const res = await fetch(
                `https://bloom-backend-five.vercel.app/allproducts?page=${pageToLoad}&limit=${limit}&sort=${sortMapping[sortOption]}`
            );
            const data = await res.json();

            if (reset) {
                setAllProducts(data.products);
                setPage(2);
            } else {
                setAllProducts(prev => [...prev, ...data.products]);
                setPage(prev => prev + 1);
            }

            if (data.total) {
                setTotalProducts(data.total);
            }

            if (data.products.length < limit) {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    }, [sortOption, page, loading, hasMore]);

    useEffect(() => {
        fetchProducts(1, true);
        setHasMore(true);
    }, [sortOption]);

    useEffect(() => {
        const handleScroll = () => {
            const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
            if (nearBottom && hasMore && !loading) {
                fetchProducts(page);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchProducts, page, hasMore, loading]);

    useEffect(() => {
        if (sortVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sortVisible]);

    const handleSortChange = (option) => {
        setSortOption(option);
        setPage(1);
        setHasMore(true);
        setAllProducts([]);
    };

    return (
        <div className='all-products'>
            <div className='cnt-products-header'>
                <div>
                    <h1 className='pc'>New Arrivals ({totalProducts})</h1>
                    <h1 className='mobile'>New Arrivals</h1>
                    <hr className='mobile' />
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

            {loading && <p className="loading-text"></p>}
            {!hasMore && <p className="no-more"></p>}
        </div>
    );
};

export default AllProducts;