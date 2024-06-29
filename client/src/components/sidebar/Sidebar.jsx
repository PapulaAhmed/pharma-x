import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faShoppingCart, faTachometerAlt, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();
    const auth = getAuth();
    const location = useLocation(); // Hook to get the current location

    const handleLogout = () => {
        signOut(auth).then(() => {
            localStorage.clear();
            navigate('/login');
        }).catch((error) => {
            console.error('Logout Failed', error);
        });
    };

    // Function to determine if the link is active
    const checkIsActive = (path) => {
        return location.pathname === path; // Checks exact match
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarContent}>
                <h2>Pharma X</h2>
                <ul className={styles.menuList}>
                    {role === 'admin' && (
                        <>
                            <li className={styles.menuItem}>
                                <NavLink to="/admin" className={checkIsActive('/admin') ? `${styles.link} ${styles.active}` : styles.link}>
                                    <FontAwesomeIcon className='icons' icon={faTachometerAlt} /> Dashboard
                                </NavLink>
                            </li>
                            <li className={styles.menuItem}>
                                <NavLink to="/admin/users" className={checkIsActive('/admin/users') ? `${styles.link} ${styles.active}` : styles.link}>
                                    <FontAwesomeIcon className='icons' icon={faUsers} /> Users
                                </NavLink>
                            </li>
                        </>
                    )}
                    {role === 'pharmacist technician' && (
                        <li className={styles.menuItem}>
                            <NavLink to="/app/products" className={checkIsActive('/products') ? `${styles.link} ${styles.active}` : styles.link}>
                                <FontAwesomeIcon className='icons' icon={faBoxOpen} /> Products
                            </NavLink>
                        </li>
                    )}
                    {role === 'pharmacist' && (
                        <>
                            <li className={styles.menuItem}>
                                <NavLink to="/app/invoices" className={checkIsActive('/app/invoices') ? `${styles.link} ${styles.active}` : styles.link}>
                                    <FontAwesomeIcon className='icons' icon={faShoppingCart} /> Invoices
                                </NavLink>
                            </li>
                            <li className={styles.menuItem}>
                                <NavLink to="/app/customers" className={checkIsActive('/app/customers') ? `${styles.link} ${styles.active}` : styles.link}>
                                    <FontAwesomeIcon className='icons' icon={faShoppingCart} /> Customers
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
                <div onClick={handleLogout} className={styles.logout}>
                    <FontAwesomeIcon className='icons' icon={faSignOutAlt} /> Logout
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
