import React from 'react';
import '../styles/Unauthorized.css';

const Unauthorized = () => {
    return (
        <div className="unauthorized">
            <h1>401 Unauthorized</h1>
            <p>Oops, it seems you don't have permission to access this page.<br/>Please login to continue.</p>
            <button onClick={() => window.location.href = '/in'}>Go to Login</button>
        </div>
    );
}

export default Unauthorized;
