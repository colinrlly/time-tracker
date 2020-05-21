import React, { useEffect } from 'react';

function PageVisibilityWatcher() {
    function handleVisibilityChange() {
        console.log(document.hidden);
    }

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    return (null);
}

export default PageVisibilityWatcher;
