import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userId === 'admin') {
      navigate('/admin');
    } else if (userId.trim() !== '') {
      navigate('/user');
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Connexion</h1>
      <p>Entrez "admin" pour l'interface admin, ou n'importe quoi d'autre pour l'interface utilisateur</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Identifiant"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginBottom: '10px',
            fontSize: '16px'
          }}
        />
        <button 
          type="submit"
          style={{ 
            width: '100%', 
            padding: '10px', 
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default LoginPage;