import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, BookOpen, Award, TrendingUp } from 'lucide-react';
import { userAPI, quizAPI } from '../utils/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileResponse, quizResponse] = await Promise.all([
          userAPI.getProfile(),
          quizAPI.getResults()
        ]);
        
        setProfile(profileResponse.data);
        setQuizResults(quizResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Welcome Section */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={40} color="white" />
          </div>
          <div>
            <h1 style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontSize: '2.5rem', 
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              Welcome back, {user?.name}!
            </h1>
            <p className="text-secondary">Ready to find your perfect engineering college?</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 'var(--border-radius)',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <BookOpen size={32} color="#6366f1" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ color: '#6366f1', fontSize: '1.5rem', fontWeight: 700 }}>
              {profile?.student?.mht_cet_cutoff || 'Not Set'}
            </h3>
            <p className="text-muted">MHT-CET Percentile</p>
          </div>

          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: 'var(--border-radius)',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <Award size={32} color="#22c55e" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 700 }}>
              {quizResults.length}
            </h3>
            <p className="text-muted">Quizzes Taken</p>
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: 'var(--border-radius)',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <TrendingUp size={32} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 700 }}>
              Active
            </h3>
            <p className="text-muted">Account Status</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card">
        <h2 style={{ 
          fontFamily: 'Space Grotesk, sans-serif', 
          fontSize: '1.8rem', 
          fontWeight: 700,
          marginBottom: '1.5rem'
        }}>
          Quick Actions
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem'
        }}>
          <div className="feature-card" style={{ margin: 0, padding: '2rem' }}>
            <div className="feature-icon" style={{ marginBottom: '1rem' }}>
              🎯
            </div>
            <h3 className="feature-title">Find Colleges</h3>
            <p className="feature-description" style={{ marginBottom: '1.5rem' }}>
              Discover engineering colleges that match your MHT-CET percentile and preferences.
            </p>
            <a href="/college-finder" className="btn btn-primary">
              Start Finding
            </a>
          </div>

          <div className="feature-card" style={{ margin: 0, padding: '2rem' }}>
            <div className="feature-icon" style={{ marginBottom: '1rem' }}>
              🧭
            </div>
            <h3 className="feature-title">Branch Quiz</h3>
            <p className="feature-description" style={{ marginBottom: '1.5rem' }}>
              Take our comprehensive quiz to discover your ideal engineering branch.
            </p>
            <a href="/branch-quiz" className="btn btn-secondary">
              Take Quiz
            </a>
          </div>

          <div className="feature-card" style={{ margin: 0, padding: '2rem' }}>
            <div className="feature-icon" style={{ marginBottom: '1rem' }}>
              👤
            </div>
            <h3 className="feature-title">Update Profile</h3>
            <p className="feature-description" style={{ marginBottom: '1.5rem' }}>
              Keep your profile updated with the latest MHT-CET scores and preferences.
            </p>
            <a href="/profile" className="btn btn-success">
              Edit Profile
            </a>
          </div>
        </div>
      </div>

      {/* Recent Quiz Results */}
      {quizResults.length > 0 && (
        <div className="glass-card">
          <h2 style={{ 
            fontFamily: 'Space Grotesk, sans-serif', 
            fontSize: '1.8rem', 
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}>
            Recent Quiz Results
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quizResults.slice(0, 3).map((result, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--border-radius)',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    Branch Discovery Quiz
                  </h4>
                  <p className="text-muted">
                    Taken on {new Date(result.taken_at).toLocaleDateString()}
                  </p>
                  {result.suggested_branches && (
                    <p className="text-secondary">
                      Suggested: {JSON.parse(result.suggested_branches).slice(0, 2).join(', ')}
                    </p>
                  )}
                </div>
                <div style={{
                  background: 'var(--primary)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  fontWeight: 600
                }}>
                  {result.score}% Match
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;