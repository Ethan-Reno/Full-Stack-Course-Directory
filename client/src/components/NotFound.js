import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className="bounds">
    <h1>Not Found</h1>
    <p>There is nothing here!</p>
    <Link className="button" to="/">Back to course directory</Link>
  </div>
);
