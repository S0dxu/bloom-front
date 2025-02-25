import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/bloom2.png';
import menu_icon2 from '../Assets/menu (1).png';
import shopping_bag from '../Assets/shopping-bag (1).png';
import x_icon from '../Assets/x-thin.svg';
import { ShopContext } from '../../Context/ShopContext';
import Search from '../Search/Search';

const Navbar = () => {
    const navigate = useNavigate();
    const { getTotalCartItems } = useContext(ShopContext);
    const [menu, setMenu] = useState('shop');
    const [showNavbar, setShowNavbar] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const isLoggedIn = !!localStorage.getItem('auth-token');

    const sidebarRef = useRef(null);

    let lastScroll = 0;

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        navigate('/');
        window.location.reload();
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > lastScroll && currentScroll > 50) {
                setShowNavbar(false);
            } else {
                setShowNavbar(true);
            }
            lastScroll = currentScroll;
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSearchOpen]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const shopArrivals = document.querySelector(".navbar-bottom");

    if (shopArrivals) {
        shopArrivals.style.opacity = isSidebarOpen ? "0" : "1";
        shopArrivals.style.transition = "opacity 0.3s ease-in-out";
    }



    return (
        <div>
            <div className={`navbar ${showNavbar ? 'show' : 'hide'} ${isSidebarOpen ? 'navbar-opacity' : ''}`}>
                <div className="nav-logo">
                    <Link to="/">
                            <img src={logo} alt="Logo" />
                    </Link>
                </div>
                <ul className="nav-menu">
                    <li onClick={() => { setMenu("shop") }}>
                        <Link style={{ textDecoration: "none", color: "#000" }} to="/">New & Featured</Link>
                    </li>
                    <li onClick={() => { setMenu("men") }}>
                        <Link style={{ textDecoration: "none", color: "#000" }} to="/men">Men</Link>
                    </li>
                    <li onClick={() => { setMenu("women") }}>
                        <Link style={{ textDecoration: "none", color: "#000" }} to="/women">Women</Link>
                    </li>
                    <li onClick={() => { setMenu("kids") }}>
                        <Link style={{ textDecoration: "none", color: "#000" }} to="/kids">Kids</Link>
                    </li>
                </ul>
                <div className="nav-login-cart">
                    {/* <button className='search-btn' onClick={toggleSearch}><i className='bx bx-search'></i></button> */}
                    <button className='prof'><Link className='pc' to={isLoggedIn ? "/profile" : "/login"}><i className='bx bx-user'></i></Link></button>
                    <button className='search-btn'><Link to="/getfavorites"><i className='bx bx-heart'></i></Link></button>
                    <button className='search-btn shop'>
                        <Link to="/cart">
                            <img className='shopping-bag' src={shopping_bag} alt="Cart" />
                            <div className="nav-cart-count">{getTotalCartItems()}</div>
                        </Link>
                    </button>
                    <button className='mobile2 search-btn' onClick={toggleSidebar}>
                        <img className='menu-icon' src={menu_icon2} alt="Menu" />
                    </button>
                </div>
            </div>

            <div className={`overlay ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>

            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
                <div className="sidebar-close-cnt" onClick={toggleSidebar}>
                    <img className="sidebar-close" src={x_icon} />
                </div>
                <ul className="sidebar-menu">
                    <li>
                        <Link className='Link' to="/" onClick={toggleSidebar}>New & Featured</Link>
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none">
                            <path stroke="currentColor" strokeWidth="1.5" d="M8.474 18.966L15.44 12 8.474 5.033"></path>
                        </svg>
                    </li>
                    <li>
                        <Link className='Link' to="/men" onClick={toggleSidebar}>Men</Link>
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none">
                            <path stroke="currentColor" strokeWidth="1.5" d="M8.474 18.966L15.44 12 8.474 5.033"></path>
                        </svg>
                    </li>
                    <li>
                        <Link className='Link' to="/women" onClick={toggleSidebar}>Women</Link>
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none">
                            <path stroke="currentColor" strokeWidth="1.5" d="M8.474 18.966L15.44 12 8.474 5.033"></path>
                        </svg>
                    </li>
                    <li>
                        <Link className='Link' to="/kids" onClick={toggleSidebar}>Kids</Link>
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none">
                            <path stroke="currentColor" strokeWidth="1.5" d="M8.474 18.966L15.44 12 8.474 5.033"></path>
                        </svg>
                    </li>
                    <div>
                        {/* <li>
                            <i className='bx bx-help-circle'></i>
                            <Link className='Link' to="/help" onClick={toggleSidebar}>Help</Link>
                        </li> */}
                        <li>
                            <i className='bx bx-user'></i>
                            <Link className='Link' to={isLoggedIn ? "/profile" : "/login"} onClick={toggleSidebar}>Profile</Link>
                        </li>
                        <li>
                            <img style={{ margin: '0px', padding: '0px' }} className='shopping-bag' src={shopping_bag} alt="Cart" />
                            <Link className='Link' to="/cart" onClick={toggleSidebar}>Cart</Link>
                        </li>
                        <li onClick={handleLogout}>
                            <i className='bx bx-log-out-circle' ></i>
                            <Link>Logout</Link>
                        </li>
                    </div>
                </ul>
            </div>

            {isSearchOpen && <Search onClose={() => setIsSearchOpen(false)} />}
        </div>
    );
};

export default Navbar;
