import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Save, Edit } from 'lucide-react';
import { userAPI } from '../utils/api';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setProfile(response.data);
      } catch (error) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await userAPI.updateProfile(profile);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };

  const handleStudentChange = (field: string, value: any) => {
    setProfile({
      ...profile,
      student: {
        ...profile.student,
        [field]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                Your Profile
              </h1>
              <p className="text-secondary">Manage your account information and preferences</p>
            </div>
          </div>
          
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            disabled={saving}
            className="btn btn-primary"
          >
            {editing ? (
              <>
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </>
            ) : (
              <>
                <Edit size={16} />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Basic Information */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={profile?.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={profile?.email || ''}
              disabled={true}
              style={{ opacity: 0.6 }}
            />
            <small className="text-muted">Email cannot be changed</small>
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <input
              type="text"
              className="form-input"
              value={profile?.role || 'Student'}
              disabled={true}
              style={{ opacity: 0.6, textTransform: 'capitalize' }}
            />
          </div>
        </div>

        {/* Student Information */}
        {profile?.role === 'student' && (
          <>
            <h2 style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontSize: '1.8rem', 
              fontWeight: 700,
              marginBottom: '1.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--glass-border)'
            }}>
              Academic Information
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem'
            }}>
              <div className="form-group">
                <label className="form-label">MHT-CET Percentile</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter your percentile (e.g., 95.5)"
                  value={profile?.student?.mht_cet_cutoff || ''}
                  onChange={(e) => handleStudentChange('mht_cet_cutoff', parseFloat(e.target.value) || null)}
                  disabled={!editing}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={profile?.student?.category || 'Open'}
                  onChange={(e) => handleStudentChange('category', e.target.value)}
                  disabled={!editing}
                >
                  <option value="Open">Open</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OBC">OBC</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Region</label>
                <select
                  className="form-select"
                  value={profile?.student?.preferred_region || ''}
                  onChange={(e) => handleStudentChange('preferred_region', e.target.value)}
                  disabled={!editing}
                >
                  <option value="">No Preference</option>
                  <option value="Mumbai University">Mumbai University</option>
                  <option value="Pune University">Pune University</option>
                  <option value="Nagpur University">Nagpur University</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Branch</label>
                <select
                  className="form-select"
                  value={profile?.student?.preferred_branch || ''}
                  onChange={(e) => handleStudentChange('preferred_branch', e.target.value)}
                  disabled={!editing}
                >
                  <option value="">No Preference</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics and Telecommunication">Electronics and Telecommunication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '2rem' }}>
              <label className="form-label">Additional Information</label>
              <textarea
                className="form-textarea"
                placeholder="Any additional information about your preferences or goals..."
                value={profile?.student?.additional_info || ''}
                onChange={(e) => handleStudentChange('additional_info', e.target.value)}
                disabled={!editing}
                rows={4}
              />
            </div>
          </>
        )}

        {editing && (
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--glass-border)'
          }}>
            <button
              onClick={() => setEditing(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;