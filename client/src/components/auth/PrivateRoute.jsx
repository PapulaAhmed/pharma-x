import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const role = localStorage.getItem('role'); // Fetch role from local storage

  if (!allowedRoles.includes(role)) {
    // Redirect user to login page if they do not have the required role
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Define the prop types
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // React node, because children could be any renderable React elements
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired // Array of strings
};

export default PrivateRoute;
