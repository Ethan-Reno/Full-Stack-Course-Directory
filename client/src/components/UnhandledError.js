import React from 'react';
import { Link } from 'react-router-dom';

const UnhandledError = () => {
    return(
        <div className="bounds">
            <h1>Error</h1>
            <p>There has been an error</p>
            <Link className="button" to="/">Back to course directory</Link>
        </div>
    )
}

export default UnhandledError;