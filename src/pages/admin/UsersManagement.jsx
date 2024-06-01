import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar.jsx'

const UsersManagement = () => {
    return (
        <div>
            {/* < !--Flex Container --> */}
            <div className="container">
                <div className="flex-container">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Content */}
                    <div className="content">
                        <h2>User Management</h2>
                        <p>Welcome to user management page where you will see a list of current users of the system</p>

                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersManagement