import React, { useContext, useState, useRef, useEffect } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);

  const [sortVisible, setSortVisible] = useState(false);
  const [sortOption, setSortOption] = useState('Name: A to Z');
  const [visibleCount, setVisibleCount] = useState(30);
  const [loading, setLoading] = useState(true); // Loading state
  const sortMenuRef = useRef(null);

  const sortMapping = {
    'Price: Low to High': (a, b) => a.new_price - b.new_price,
    'Price: High to Low': (a, b) => b.new_price - a.new_price,
    'Name: A to Z': (a, b) => a.name.localeCompare(b.name),
    'Name: Z to A': (a, b) => b.name.localeCompare(a.name),
  };

  useEffect(() => {
    if (all_product && all_product.length > 0) {
      setLoading(false);
    }
  }, [all_product]);

  const sortedProducts = [...all_product]
    .filter(item => item.category === props.category)
    .sort(sortMapping[sortOption] || (() => 0));

  const visibleProducts = sortedProducts.slice(0, visibleCount);

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
        visibleCount < sortedProducts.length
      ) {
        setVisibleCount(prev => Math.min(prev + 30, sortedProducts.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, sortedProducts.length]);

  if (loading) {
    return (
        <div className="loader" />
    );
  }

  return (
    <div className='shop-category'>
      <div className="shopcategory-indexSort">
        <div className='lenght'>
          <p>{props.category.charAt(0).toUpperCase() + props.category.slice(1)}'s Shoes</p>
          <div className='pc'>({sortedProducts.length})</div>
        </div>

        <div className="shopcategory-sort" ref={sortMenuRef}>
          <div onClick={toggleSortMenu} className="sort-label">
            {sortOption || 'Default'} <i className='bx bx-slider-alt'></i>
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
        <p className='results'>{sortedProducts.length} Results</p>
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

      {visibleCount >= sortedProducts.length && <p className="no-more"></p>}
    </div>
  );
};

export default ShopCategory;
