import React from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/home'); 
  };

  return (
    <div>
      <h1>Register</h1>
      <button onClick={handleLogin}>Registrar</button>
    </div>
  );
};

export default Register;
