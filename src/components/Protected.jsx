import React from 'react'
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const Protected = () => {

    const token = localStorage.getItem('token');
    console.log(token);

    return (
        token ? <Outlet /> : <Navigate to='/login' />
    )
}

export default Protected