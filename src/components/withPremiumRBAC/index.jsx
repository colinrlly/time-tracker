import React from 'react';
import { useSelector } from 'react-redux';

function WithPremiumRBAC(WrappedComponent) {
    const premium = useSelector((state) => state.premium);

    return premium === 'premium' ? WrappedComponent : null;
}

export default WithPremiumRBAC;
