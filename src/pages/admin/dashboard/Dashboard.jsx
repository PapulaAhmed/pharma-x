import React from 'react'
import styles from './Dashboard.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faShoppingCart, faTachometerAlt, faUsers } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '../../../components/sidebar/Sidebar.jsx'
import  '../globalStyle.css'

const Dashboard = () => {
    return (
        <div>
            {/* < !--Flex Container --> */}
            <div className="container">
                <div className="flex-container">
                    {/* Sidebar */}
                    <Sidebar />
                    
                    {/* Content */}
                    <div className="content">
                        <h2>Dashboard</h2>
                        <p>Welcome to the Admin Panel</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard