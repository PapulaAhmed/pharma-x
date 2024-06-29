import React from 'react'
import './AdminPanel.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faShoppingCart, faTachometerAlt, faUsers } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '../../components/sidebar/Sidebar.jsx'

const AdminPanel = () => {
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

export default AdminPanel