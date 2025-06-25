// src/pages/UserPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService, { type Poll, type PollResults } from '../services/api';

const UserPage: React.FC = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [message, setMessage] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Récupérer l'ID utilisateur
    const storedUserId = sessionStorage.getItem('userId');
    if (!storedUserId) {
      navigate('/');
      return;
    }
    setUserId(storedUserId);
    loadPolls();
  }, [navigate]);

  const loadPolls = async () => {
    try {
      const data = await apiService.getAllPolls();
      setPolls(data);
    } catch (err) {
      setMessage('❌ Erreur lors du chargement des sondages');
    }
  };

  const handleSelectPoll = async (poll: Poll) => {
    setSelectedPoll(poll);
    setSelectedOptions([]);
    setPollResults(null);
    setMessage('');
    setHasVoted(false);

    // Vérifier si l'utilisateur a déjà voté
    try {
      const { hasVoted: userHasVoted } = await apiService.hasUserVoted(poll.id, userId);
      setHasVoted(userHasVoted);
      
      // Si l'utilisateur a déjà voté, charger directement les résultats
      if (userHasVoted) {
        await loadResults(poll.id);
        setMessage('✅ Vous avez déjà voté pour ce sondage');
      }
    } catch (err) {
      console.error('Erreur lors de la vérification du vote:', err);
    }
  };

  const handleOptionChange = (optionId: number, checked: boolean) => {
    if (selectedPoll?.multiple) {
      if (checked) {
        setSelectedOptions([...selectedOptions, optionId]);
      } else {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      }
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = async () => {
    if (!selectedPoll || selectedOptions.length === 0) {
      setMessage('❌ Sélectionnez au moins une option');
      return;
    }

    try {
      await apiService.vote(selectedPoll.id, {
        voter: userId,
        optionIds: selectedOptions,
      });
      setMessage('✅ Vote enregistré!');
      setHasVoted(true);
      await loadResults(selectedPoll.id);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const loadResults = async (pollId: number) => {
    try {
      const results = await apiService.getPollResults(pollId);
      setPollResults(results);
    } catch (err) {
      setMessage('❌ Erreur lors du chargement des résultats');
    }
  };

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      color: '#333'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', margin: 0 }}>Sondages disponibles - {userId}</h1>
        <button onClick={() => {
          sessionStorage.removeItem('userId');
          navigate('/');
        }} style={{ 
          padding: '5px 10px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Déconnexion
        </button>
      </div>

      {message && <p style={{ 
        padding: '10px', 
        backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
        color: message.includes('✅') ? '#155724' : '#721c24',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>{message}</p>}

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Liste des sondages */}
        <div style={{ 
          flex: '0 0 300px', 
          backgroundColor: 'white',
          border: '1px solid #ddd', 
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginTop: 0 }}>Choisir un sondage:</h3>
          {polls.map(poll => (
            <div
              key={poll.id}
              onClick={() => handleSelectPoll(poll)}
              style={{
                padding: '10px',
                margin: '5px 0',
                backgroundColor: selectedPoll?.id === poll.id ? '#007bff' : '#f8f9fa',
                color: selectedPoll?.id === poll.id ? 'white' : '#333',
                cursor: 'pointer',
                border: '1px solid #ddd',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
            >
              <strong>{poll.title}</strong>
              <p style={{ 
                margin: '5px 0', 
                fontSize: '14px',
                color: selectedPoll?.id === poll.id ? '#f0f0f0' : '#666'
              }}>{poll.description}</p>
            </div>
          ))}
        </div>

        {/* Détails du sondage */}
        {selectedPoll && (
          <div style={{ 
            flex: 1, 
            backgroundColor: 'white',
            border: '1px solid #ddd', 
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#333', marginTop: 0 }}>{selectedPoll.title}</h2>
            <p style={{ color: '#555' }}>{selectedPoll.description}</p>
            <p style={{ color: '#666', fontSize: '14px' }}>
              {selectedPoll.multiple 
                ? '(Plusieurs réponses possibles)' 
                : '(Une seule réponse possible)'}
            </p>

            {!hasVoted && !pollResults ? (
              <>
                <div style={{ margin: '20px 0' }}>
                  {selectedPoll.options.map(option => (
                    <div key={option.id} style={{ margin: '10px 0' }}>
                      <label style={{ 
                        color: '#333', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <input
                          type={selectedPoll.multiple ? 'checkbox' : 'radio'}
                          name="options"
                          checked={selectedOptions.includes(option.id)}
                          onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                          style={{ marginRight: '8px' }}
                        />
                        {option.text}
                      </label>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleVote}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Voter
                </button>
              </>
            ) : pollResults ? (
              <>
                <h3 style={{ color: '#333' }}>Résultats:</h3>
                <p style={{ color: '#666' }}>Total des votes: {pollResults.totalVotes}</p>
                {pollResults.results.map(result => {
                  const percentage = pollResults.totalVotes > 0
                    ? (result.votes / pollResults.totalVotes) * 100
                    : 0;
                  
                  return (
                    <div key={result.optionId} style={{ margin: '15px 0' }}>
                      <div style={{ color: '#333', fontWeight: 'bold' }}>{result.text}</div>
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                        <div style={{
                          width: '200px',
                          height: '20px',
                          backgroundColor: '#e0e0e0',
                          marginRight: '10px',
                          borderRadius: '10px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor: '#007bff',
                            transition: 'width 0.3s'
                          }} />
                        </div>
                        <span style={{ color: '#555' }}>{result.votes} votes ({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  );
                })}
                
                <button
                  onClick={() => loadResults(selectedPoll.id)}
                  style={{ 
                    marginTop: '20px', 
                    padding: '8px 15px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Actualiser les résultats
                </button>
              </>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                Chargement...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;