import React from 'react';
import styles from './Sidebar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faShoppingCart, faTachometerAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarContent}>
                <h2>Pharma X</h2>
                <ul className={styles.menuList}>
                    <li className={styles.menuItem}>
                        <NavLink 
                            to="/admin" 
                            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
                            end>
                            <FontAwesomeIcon className='icons' icon={faTachometerAlt} /> Dashboard
                        </NavLink>
                    </li>
                    <li className={styles.menuItem}>
                        <NavLink 
                            to="/admin/users" 
                            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                            <FontAwesomeIcon className='icons' icon={faUsers} /> Users
                        </NavLink>
                    </li>
                    <li className={styles.menuItem}>
                        <NavLink 
                            to="/admin/products" 
                            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                            <FontAwesomeIcon className='icons' icon={faBoxOpen} /> Products
                        </NavLink>
                    </li>
                    <li className={styles.menuItem}>
                        <NavLink 
                            to="/admin/orders" 
                            className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                            <FontAwesomeIcon className='icons' icon={faShoppingCart} /> Orders
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
