import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [charities, setCharities] = useState([]);
  const [newScore, setNewScore] = useState('');

  // Fetch charities from database on component mount
  useEffect(() => {
    const fetchCharities = async () => {
      const { data } = await supabase.from('charities').select('*');
      setCharities(data || []);
    };
    fetchCharities();
  }, []);

  // Handle user subscription plans
  const handleSubscribe = (planType) => {
    alert(`Thank you for choosing the ${planType} plan! Your contribution will support our partner charities.`);
  };

  // Add new golf score with rolling 5 logic
  const handleAddScore = async () => {
    const scoreVal = parseInt(newScore);
    
    // Validation: Score must be within 1-45 range
    if (isNaN(scoreVal) || scoreVal < 1 || scoreVal > 45) {
      return alert("Invalid score. Please enter a value between 1 and 45.");
    }

    const { data: existingScores } = await supabase
      .from('golf_scores')
      .select('*')
      .order('created_at', { ascending: true });

    // Ensure only the latest 5 scores are maintained
    if (existingScores && existingScores.length >= 5) {
      const oldestId = existingScores[0].id;
      await supabase.from('golf_scores').delete().eq('id', oldestId);
    }

    const { error } = await supabase.from('golf_scores').insert([{ score: scoreVal }]);

    if (!error) {
      setNewScore('');
      alert("Score successfully recorded.");
    } else {
      alert("Error saving score: " + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Golf Charity Platform</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '50px' }}>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #3b82f6', width: '200px', textAlign: 'center' }}>
          <h3 style={{ color: '#3b82f6' }}>Monthly</h3>
          <p style={{ fontSize: '1.5rem' }}>$19.99</p>
          <button onClick={() => handleSubscribe('Monthly')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer' }}>Subscribe</button>
        </div>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #10b981', width: '200px', textAlign: 'center' }}>
          <h3 style={{ color: '#10b981' }}>Yearly</h3>
          <p style={{ fontSize: '1.5rem' }}>$199.99</p>
          <button onClick={() => handleSubscribe('Yearly')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer' }}>Subscribe</button>
        </div>
      </div>

      <div style={{ textAlign: 'center', background: '#1e293b', padding: '20px', borderRadius: '15px', maxWidth: '400px', margin: '0 auto 40px' }}>
        <h3 style={{ marginBottom: '15px' }}>Enter Your Score (1-45)</h3>
        <input 
          type="number" 
          value={newScore} 
          onChange={(e) => setNewScore(e.target.value)} 
          placeholder="Score"
          style={{ padding: '10px', borderRadius: '5px', border: 'none', width: '80px' }}
        />
        <button onClick={handleAddScore} style={{ marginLeft: '10px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add Score
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {charities.map(c => (
          <div key={c.id} style={{ border: '1px solid #334155', padding: '20px', borderRadius: '12px', background: '#1e293b' }}>
            <h4 style={{ color: '#3b82f6', marginBottom: '10px' }}>{c.name}</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;