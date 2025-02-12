import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DelayedLink = ({ to, children, delay = 500 }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    setTimeout(() => {
      navigate(to);
    }, delay);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};

export default DelayedLink;
