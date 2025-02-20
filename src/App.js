import './App.css';
import { useEffect } from'react';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kids_banner from './Components/Assets/banner_kids.png';
import Favorites from './Components/Favorites/Favorites';
import { Link } from 'react-router-dom';
import Profile from './Components/Profile/Profile';
import PaymentGateway from './Components/PaymentGateway/PaymentGateway';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Success from './Components/Success/Success';
import Unsuccess from './Components/Unsuccess/Unsuccess';

const stripePromise = loadStripe('pk_test_51QUUgMRxVP5eUbdNbdLYmdtpz3YJK67GiRl9Y7X8OFhS2zM7PBGVPmtX9VrHvqD8LtBi8VysjfNTrr1wwCUnkhTE00ovW6wN22');

function App() {
  useEffect(() => {
    const disableDrag = (event) => event.preventDefault();
    document.addEventListener('dragstart', disableDrag);

    return () => {
      document.removeEventListener('dragstart', disableDrag);
    };
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <div className='navbar-bottom'>
          <p>SHOP ALL THE NEW ARRIVALS</p>
          <Link to="/" className='Link'>Shop</Link>
        </div>
        <Elements stripe={stripePromise}>
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/men" element={<ShopCategory banner={men_banner} category="men" />} />
            <Route path="/women" element={<ShopCategory banner={women_banner} category="women" />} />
            <Route path="/kids" element={<ShopCategory banner={kids_banner} category="kids" />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment" element={<PaymentGateway />} />
            <Route path="/getfavorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/success" element={<Success />} />
            <Route path="/unsuccess" element={<Unsuccess />} />
          </Routes>
        </Elements>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
