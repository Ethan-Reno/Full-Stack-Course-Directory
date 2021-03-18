import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
    return(
        <div className="bounds">
            <h1>Forbidden Route</h1>
            <p>You are not authorized to see this page</p>
            <Link className="button" to="/">Back to course directory</Link>   
        </div>
    )
}

export default Forbidden;