import React from 'react';
import './Breadcrumb.css';
import arrow_icon from '../Assets/breadcrum_arrow.png'

const Breadcrumb = (props) => {
    const { product } = props;
    console.log('Product:', product);

    if (!product) {
        return <div className='breadcrumb'></div>;
    }

    return (
        <div className='breadcrumb'>
            HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> { product.category } <img src={arrow_icon} alt="" /> { product.name } <img src={arrow_icon} alt="" />
        </div>
    );
}


export default Breadcrumb;