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

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    try {
      const data = await apiService.getAllPolls();
      setPolls(data);
    } catch (err) {
      setMessage('❌ Erreur lors du chargement des sondages');
    }
  };

  const handleSelectPoll = (poll: Poll) => {
    setSelectedPoll(poll);
    setSelectedOptions([]);
    setPollResults(null);
    setMessage('');
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
        voter: 'user123', // On met un ID utilisateur fixe pour simplifier
        optionIds: selectedOptions,
      });
      setMessage('✅ Vote enregistré!');
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
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Sondages disponibles</h1>
        <button onClick={() => navigate('/')} style={{ padding: '5px 10px' }}>
          Déconnexion
        </button>
      </div>

      {message && <p style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>{message}</p>}

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Liste des sondages */}
        <div style={{ flex: '0 0 300px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Choisir un sondage:</h3>
          {polls.map(poll => (
            <div
              key={poll.id}
              onClick={() => handleSelectPoll(poll)}
              style={{
                padding: '10px',
                margin: '5px 0',
                backgroundColor: selectedPoll?.id === poll.id ? '#e0e0e0' : '#f5f5f5',
                cursor: 'pointer',
                border: '1px solid #ddd'
              }}
            >
              <strong>{poll.title}</strong>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>{poll.description}</p>
            </div>
          ))}
        </div>

        {/* Détails du sondage */}
        {selectedPoll && (
          <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px' }}>
            <h2>{selectedPoll.title}</h2>
            <p>{selectedPoll.description}</p>
            <p style={{ color: '#666', fontSize: '14px' }}>
              {selectedPoll.multiple 
                ? '(Plusieurs réponses possibles)' 
                : '(Une seule réponse possible)'}
            </p>

            {!pollResults ? (
              <>
                <div style={{ margin: '20px 0' }}>
                  {selectedPoll.options.map(option => (
                    <div key={option.id} style={{ margin: '10px 0' }}>
                      <label>
                        <input
                          type={selectedPoll.multiple ? 'checkbox' : 'radio'}
                          name="options"
                          checked={selectedOptions.includes(option.id)}
                          onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                        />
                        {' ' + option.text}
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
                    cursor: 'pointer'
                  }}
                >
                  Voter
                </button>
              </>
            ) : (
              <>
                <h3>Résultats:</h3>
                <p>Total des votes: {pollResults.totalVotes}</p>
                {pollResults.results.map(result => {
                  const percentage = pollResults.totalVotes > 0
                    ? (result.votes / pollResults.totalVotes) * 100
                    : 0;
                  
                  return (
                    <div key={result.optionId} style={{ margin: '10px 0' }}>
                      <div>{result.text}</div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '200px',
                          height: '20px',
                          backgroundColor: '#e0e0e0',
                          marginRight: '10px'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor: '#007bff'
                          }} />
                        </div>
                        <span>{result.votes} votes ({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  );
                })}
                
                <button
                  onClick={() => loadResults(selectedPoll.id)}
                  style={{ marginTop: '20px', padding: '5px 10px' }}
                >
                  Actualiser les résultats
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;