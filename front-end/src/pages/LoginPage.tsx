import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userId.trim() === '') {
      alert('Veuillez entrer un identifiant');
      return;
    }
    
    // Stocker l'ID utilisateur dans sessionStorage
    sessionStorage.setItem('userId', userId);
    
    // Si l'ID est "admin", aller à la page admin
    if (userId === 'admin') {
      navigate('/admin');
    } else {
      // Sinon, aller à la page user
      navigate('/user');
    }
  };

  return (
    <div style={{ 
      padding: '50px', 
      maxWidth: '400px', 
      margin: '0 auto',
      backgroundColor: 'white',
      color: '#333',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#333' }}>Connexion</h1>
      <p style={{ color: '#666' }}>
        Entrez "admin" pour l'interface admin<br/>
        Ou votre nom pour voter (ex: Jean, Marie, Pierre...)
      </p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Votre identifiant"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginBottom: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            color: '#333'
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
            borderRadius: '4px',
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
