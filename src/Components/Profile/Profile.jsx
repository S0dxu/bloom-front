import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import user_profile from '../Assets/user-profile.png';

const Profile = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('profile');
    const [userData, setUserData] = useState({ name: '', email: '', date: '', deliveryAddresses: [] });
    const [newAddress, setNewAddress] = useState('');
    const [editData, setEditData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response = await fetch('https://ah873hdsha98h2wuisah9872.onrender.com/getuser', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setUserData({
                        name: data.user.name,
                        email: data.user.email,
                        date: new Date(data.user.date).toLocaleDateString(),
                        deliveryAddresses: data.user.deliveryAddresses || [],
                    });
                } else {
                    alert('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        navigate('/');
    };

    const handleAddAddress = async () => {
        const token = localStorage.getItem('auth-token');
        try {
            const response = await fetch('https://ah873hdsha98h2wuisah9872.onrender.com/addaddress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({ address: newAddress }),
            });
            const data = await response.json();
            if (data.success) {
                setUserData({ ...userData, deliveryAddresses: data.addresses });
                setNewAddress('');
            } else {
                alert('Failed to add address');
            }
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const handleEditProfile = async (type) => {
        const token = localStorage.getItem('auth-token');
        let bodyData = {};

        if (type === 'name' && editData.name !== userData.name) {
            if (editData.name.trim() === '') {
                setError('Name cannot be empty');
                return;
            }
            bodyData = { name: editData.name };
        } else if (type === 'email' && editData.email !== userData.email) {
            if (editData.email.trim() === '') {
                setError('Email cannot be empty');
                return;
            }
            if (!validateEmail(editData.email)) {
                setError('Please enter a valid email');
                return;
            }
            bodyData = { email: editData.email };
        } else if (type === 'password' && editData.password.trim() !== '') {
            bodyData = { password: editData.password };
        }

        if (Object.keys(bodyData).length === 0) {
            setError('No valid changes made or fields are empty.');
            return;
        }

        try {
            const response = await fetch('https://ah873hdsha98h2wuisah9872.onrender.com/updateprofile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();
            if (data.success) {
                setUserData({ ...userData, ...data.user });
                alert('Profile updated successfully');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className='profile-cnt'>
            {/* <div className="right">
                <h1>Settings</h1>
                <ul>
                    <li onClick={() => setActiveSection('profile')}>
                        <i className='bx bx-user'></i>
                        <p>Profile</p>
                    </li>
                    <li onClick={() => setActiveSection('deliveryAddresses')}>
                        <i className='bx bx-package'></i>
                        <p>Delivery Addresses</p>
                    </li>
                    <li onClick={() => setActiveSection('paymentMethods')}>
                        <i className='bx bx-credit-card-alt'></i>
                        <p>Payment Methods</p>
                    </li>
                    <li onClick={() => setActiveSection('editProfile')}>
                        <i className='bx bx-edit-alt'></i>
                        <p>Edit Profile</p>
                    </li>
                    <li>
                        <i className='bx bx-log-out-circle' ></i>
                        {localStorage.getItem('auth-token') ? (
                            <p onClick={handleLogout}>Logout</p>
                        ) : null}
                    </li>
                    <li onClick={() => setActiveSection('deleteProfile')}>
                        <i className='bx bx-trash-alt' ></i>
                        <p>Delete Account</p>
                    </li>
                </ul>   
            </div> */}
            <div className="left">
                {activeSection === 'profile' && (
                    <div className="profile-section">
                        <img src={user_profile} alt="" />
                        <div className="profile-desc">
                            <h2>{userData.name || 'User'}</h2>
                            <p>Email: {userData.email || 'N/A'}</p>
                            <p>Member since {userData.date || 'N/A'}</p>
                        </div>
                    </div>
                )}
                {/* {activeSection === 'deliveryAddresses' && (
                    <div className="delivery-addresses-section">
                        <h2>Saved delivery addresses</h2>
                        <ul>
                            {userData.deliveryAddresses.map((address, index) => (
                                <li key={index}>{address}</li>
                            ))}
                        </ul>
                        <input
                            type="text"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            placeholder="Add new address"
                        />
                        <button onClick={handleAddAddress}>Add Address</button>
                    </div>
                )}
                {activeSection === 'paymentMethods' && (
                    <div className="payment-methods-section">
                        <h2>Saved payment methods</h2>
                    </div>
                )} */}
                {activeSection === 'editProfile' && (
                    <div className="edit-profile-section">
                        <h2>Edit Profile</h2>
                        {error && <p className="error-message">{error}</p>}
                        <p>Username</p>
                        <input
                            type="text"
                            placeholder="New Name"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                        <button onClick={() => handleEditProfile('name')}>Save Changes</button>
                        <p>Email</p>
                        <input
                            type="email"
                            placeholder="New Email"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        />
                        <button onClick={() => handleEditProfile('email')}>Save Changes</button>
                        <p>Password</p>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={editData.password}
                            onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                        />
                        <button onClick={() => handleEditProfile('password')}>Save Changes</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
