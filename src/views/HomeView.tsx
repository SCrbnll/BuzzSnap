import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Bienvenido a BuzzSnap</h1>
      <Link to="/">Cerrar Sesión</Link>
    </div>
  );
};

export default Home;
