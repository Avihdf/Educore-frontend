import React from 'react'
import { useauth } from '../../context/AppContext'
import { Navigate } from 'react-router-dom';

const EducatorProtected = ({ children }) => {
    const { admin, loading } = useauth();

    if (loading) return <div>Loading...</div>;

    if (!admin) return <Navigate to='/login' replace />

    return children;
}

export default EducatorProtected
