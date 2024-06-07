import React from 'react';
import '../styles/NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found">
            <h1>404 Not Found</h1>
            <p>Oops, the page you're looking for doesn't exist.<br/>Let's get you back on track.</p>
            <button onClick={() => window.location.href = '/'}>Go to Homepage</button>
        </div>
    );
}

export default NotFound;
