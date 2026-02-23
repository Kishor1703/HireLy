import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const UserRoute = ({ children, allowedRoles }) => {

    const { userInfo } = useSelector((state) => state.signIn);
    if (!userInfo) {
        return <Navigate to="/" />;
    }
    if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
        return <Navigate to="/" />;
    }
    return children;
}

export default UserRoute
