import React from 'react';
import { useSelector } from 'react-redux';

function Account() {
    const premium = useSelector((state) => state.premium);
    const userEmail = useSelector((state) => state.userEmail);

    return (
        <div>
            <p>{ premium }</p>
            <p>{ userEmail }</p>
            <a href='/create-customer-portal-session'>Manage Premium Subscription</a>
            <br />
            <a href='/logout'>Sign Out</a>
        </div>
    );
}

export default Account;
