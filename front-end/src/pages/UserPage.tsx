// src/pages/UserPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService, { type Poll, type PollResults } from '../services/api';

/**
 * Page principale pour les utilisateurs
 * Permet de visualiser les sondages, voter et consulter les résultats
 */
const UserPage: React.FC = () => {
  const navigate = useNavigate();
  
  // États du composant
  /** Liste de tous les sondages disponibles */
  const [polls, setPolls] = useState<Poll[]>([]);
  /** Sondage actuellement sélectionné */
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  /** IDs des options sélectionnées pour le vote */
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  /** Résultats du sondage après vote */
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  /** Message d'information ou d'erreur */
  const [message, setMessage] = useState('');
  /** Indique si l'utilisateur a déjà voté */
  const [hasVoted, setHasVoted] = useState(false);
  /** Identifiant de l'utilisateur connecté */
  const [userId, setUserId] = useState('');

  /**
   * Hook d'initialisation
   * Vérifie la connexion et charge les sondages
   */
  useEffect(() => {
    // Récupérer l'ID utilisateur depuis sessionStorage
    const storedUserId = sessionStorage.getItem('userId');
    if (!storedUserId) {
      // Rediriger vers login si non connecté
      navigate('/');
      return;
    }
    setUserId(storedUserId);
    loadPolls();
  }, [navigate]);

  /**
   * Charge tous les sondages disponibles depuis l'API
   */
  const loadPolls = async () => {
    try {
      const data = await apiService.getAllPolls();
      setPolls(data);
    } catch (err) {
      setMessage('❌ Erreur lors du chargement des sondages');
    }
  };

  /**
   * Gère la sélection d'un sondage
   * Vérifie si l'utilisateur a déjà voté et charge les résultats si c'est le cas
   * @param poll - Le sondage sélectionné
   */
  const handleSelectPoll = async (poll: Poll) => {
    // Réinitialiser l'état
    setSelectedPoll(poll);
    setSelectedOptions([]);
    setPollResults(null);
    setMessage('');
    setHasVoted(false);

    // Vérifier si l'utilisateur a déjà voté
    try {
      const { hasVoted: userHasVoted } = await apiService.hasUserVoted(poll.id, userId);
      setHasVoted(userHasVoted);
      
      if (userHasVoted) {
        // Charger directement les résultats si déjà voté
        await loadResults(poll.id);
        setMessage('✅ Vous avez déjà voté pour ce sondage');
      }
    } catch (err) {
      console.error('Erreur lors de la vérification du vote:', err);
    }
  };

  /**
   * Gère le changement de sélection d'une option
   * @param optionId - ID de l'option
   * @param checked - État de sélection
   */
  const handleOptionChange = (optionId: number, checked: boolean) => {
    if (selectedPoll?.multiple) {
      // Sondage à choix multiples
      if (checked) {
        setSelectedOptions([...selectedOptions, optionId]);
      } else {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      }
    } else {
      // Sondage à choix unique
      setSelectedOptions([optionId]);
    }
  };

  /**
   * Enregistre le vote de l'utilisateur
   * Valide la sélection et envoie le vote à l'API
   */
  const handleVote = async () => {
    // Validation
    if (!selectedPoll || selectedOptions.length === 0) {
      setMessage('❌ Sélectionnez au moins une option');
      return;
    }

    try {
      // Envoyer le vote
      await apiService.vote(selectedPoll.id, {
        voter: userId,
        optionIds: selectedOptions,
      });
      
      setMessage('✅ Vote enregistré!');
      setHasVoted(true);
      
      // Charger les résultats immédiatement
      await loadResults(selectedPoll.id);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  /**
   * Charge les résultats d'un sondage
   * @param pollId - ID du sondage
   */
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
      {/* En-tête avec déconnexion */}
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

      {/* Message d'information */}
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

        {/* Zone de vote/résultats */}
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

            {/* Affichage conditionnel : formulaire de vote ou résultats */}
            {!hasVoted && !pollResults ? (
              // Formulaire de vote
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
              // Affichage des résultats
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
              // État de chargement
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