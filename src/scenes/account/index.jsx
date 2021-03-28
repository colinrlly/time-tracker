import React from 'react';
import { useSelector } from 'react-redux';

function Account() {
    const premium = useSelector((state) => state.premium);
    const userEmail = useSelector((state) => state.userEmail);

    const premiumLink = premium === 'premium'
        ? <a href='/create-customer-portal-session'>Manage Premium Subscription</a>
        : <a href='/premium'>Get premium</a>;

    return (
        <div>
            <p>{ premium }</p>
            <p>{ userEmail }</p>
            { premiumLink }
            <br />
            <a href='/logout'>Sign Out</a>
        </div>
    );
}

export default Account;
