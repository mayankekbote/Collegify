import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Upload } from 'lucide-react';
import { collegeAPI, College } from '../utils/api';

const AdminDashboard: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<Partial<College>>({
    college_name: '',
    branch: '',
    cutoff_percentile: 0,
    category: 'Open',
    region: '',
    fees: 0,
    median_package: 0,
    image_urls: '[]'
  });

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await collegeAPI.getAll();
      setColleges(response.data);
    } catch (error) {
      setError('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editing) {
        await collegeAPI.update(editing, formData);
        setSuccess('College updated successfully!');
      } else {
        await collegeAPI.create(formData as Omit<College, 'id'>);
        setSuccess('College added successfully!');
      }
      
      fetchColleges();
      resetForm();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (college: College) => {
    setFormData(college);
    setEditing(college.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this college?')) return;

    try {
      await collegeAPI.delete(id);
      setSuccess('College deleted successfully!');
      fetchColleges();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      college_name: '',
      branch: '',
      cutoff_percentile: 0,
      category: 'Open',
      region: '',
      fees: 0,
      median_package: 0,
      image_urls: '[]'
    });
    setEditing(null);
    setShowForm(false);
  };

  const filteredColleges = colleges.filter(college =>
    college.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontSize: '2.5rem', 
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              Admin Dashboard
            </h1>
            <p className="text-secondary">Manage colleges and their information</p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            Add College
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Search */}
        <div className="form-group">
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search colleges, branches, or regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </div>

        {/* Colleges Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--border-radius)',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600 }}>College</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600 }}>Branch</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600 }}>Cutoff</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600 }}>Region</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600 }}>Fees</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600 }}>Package</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredColleges.map((college, index) => (
                <tr key={college.id} style={{
                  borderBottom: '1px solid var(--glass-border)',
                  background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                }}>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{college.college_name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{college.branch}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{college.cutoff_percentile}%</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`category-badge category-${college.category.toLowerCase()}`}>
                      {college.category}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{college.region}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>₹{college.fees.toLocaleString()}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>₹{college.median_package} LPA</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(college)}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem', minWidth: 'auto' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(college.id)}
                        className="btn btn-danger"
                        style={{ padding: '0.5rem', minWidth: 'auto' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredColleges.length === 0 && (
          <div className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
            No colleges found matching your search criteria.
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div className="glass-card" style={{ 
            maxWidth: '600px', 
            width: '100%', 
            maxHeight: '90vh', 
            overflowY: 'auto' 
          }}>
            <h2 style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontSize: '1.8rem', 
              fontWeight: 700,
              marginBottom: '1.5rem'
            }}>
              {editing ? 'Edit College' : 'Add New College'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1rem' 
              }}>
                <div className="form-group">
                  <label className="form-label">College Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.college_name || ''}
                    onChange={(e) => setFormData({...formData, college_name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Branch *</label>
                  <select
                    className="form-select"
                    value={formData.branch || ''}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics and Telecommunication">Electronics and Telecommunication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Cutoff Percentile *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.cutoff_percentile || ''}
                    onChange={(e) => setFormData({...formData, cutoff_percentile: parseFloat(e.target.value) || 0})}
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formData.category || 'Open'}
                    onChange={(e) => setFormData({...formData, category: e.target.value as 'Open' | 'SC' | 'ST' | 'OBC'})}
                    required
                  >
                    <option value="Open">Open</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="OBC">OBC</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Region *</label>
                  <select
                    className="form-select"
                    value={formData.region || ''}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    required
                  >
                    <option value="">Select Region</option>
                    <option value="Mumbai University">Mumbai University</option>
                    <option value="Pune University">Pune University</option>
                    <option value="Nagpur University">Nagpur University</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Annual Fees *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.fees || ''}
                    onChange={(e) => setFormData({...formData, fees: parseInt(e.target.value) || 0})}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Median Package (LPA) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.median_package || ''}
                    onChange={(e) => setFormData({...formData, median_package: parseInt(e.target.value) || 0})}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URLs (JSON Array)</label>
                <textarea
                  className="form-textarea"
                  value={formData.image_urls || '[]'}
                  onChange={(e) => setFormData({...formData, image_urls: e.target.value})}
                  placeholder='["https://example.com/image1.jpg", "https://example.com/image2.jpg"]'
                  rows={3}
                />
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'flex-end',
                marginTop: '2rem'
              }}>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editing ? 'Update' : 'Add'} College
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;