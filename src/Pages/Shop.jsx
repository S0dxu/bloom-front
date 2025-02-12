import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Hero from '../Components/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import Offers from '../Components/Offers/Offers';
import NewCollections from '../Components/NewCollections/NewCollections';
import NewsLetter from '../Components/NewsLetter/NewsLetter';

const Shop = () => {
    const { all_product } = useContext(ShopContext);
    const product = all_product?.[0];

    return (
        <div>
            {/* <Hero/>
            <Popular/>
            <Offers/> */}
            <NewCollections product={product} id={product?.id}/>
            {/* <NewsLetter/> */}
        </div>
    );
}

export default Shop;
