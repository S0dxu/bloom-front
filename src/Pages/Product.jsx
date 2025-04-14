import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../Components/Breadcrumbs/Breadcrumb';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {
    const { all_product } = useContext(ShopContext);
    const { productId } = useParams();

    const product = all_product?.find((e) => e.id === Number(productId));

    if (!product) {
        return (
            <div className="loader"></div>
        );
    }

    return (
        <div>
            {/* <Breadcrumb product={product}/> */}
            <ProductDisplay product={product} id={product.id} />
            <RelatedProducts product={product} id={product.id} />
        </div>
    );
};

export default Product;
