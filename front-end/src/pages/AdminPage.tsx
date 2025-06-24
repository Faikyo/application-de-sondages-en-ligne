// src/pages/AdminPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [multiple, setMultiple] = useState(false);
  const [options, setOptions] = useState(['', '']);
  const [message, setMessage] = useState('');

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validOptions = options.filter(opt => opt.trim() !== '');
    
    if (validOptions.length < 2) {
      setMessage('❌ Il faut au moins 2 options');
      return;
    }

    try {
      await apiService.createPoll({
        title,
        description,
        multiple,
        options: validOptions,
      });
      
      setMessage('✅ Sondage créé avec succès!');
      // Réinitialiser le formulaire
      setTitle('');
      setDescription('');
      setMultiple(false);
      setOptions(['', '']);
    } catch (err) {
      setMessage('❌ Erreur lors de la création');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Interface Admin</h1>
        <button onClick={() => navigate('/')} style={{ padding: '5px 10px' }}>
          Déconnexion
        </button>
      </div>

      <h2>Créer un sondage</h2>
      
      {message && <p style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Titre:</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description:</label><br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              checked={multiple}
              onChange={(e) => setMultiple(e.target.checked)}
            />
            Autoriser plusieurs réponses
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Options:</label>
          {options.map((option, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
                style={{ flex: 1, padding: '5px', marginRight: '5px' }}
              />
              {options.length > 2 && (
                <button type="button" onClick={() => handleRemoveOption(index)}>
                  Supprimer
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddOption} style={{ marginTop: '5px' }}>
            + Ajouter une option
          </button>
        </div>

        <button type="submit" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none',
          cursor: 'pointer'
        }}>
          Créer le sondage
        </button>
      </form>
    </div>
  );
};

export default AdminPage;