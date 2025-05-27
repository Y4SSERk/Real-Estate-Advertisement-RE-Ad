import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    totalViews: 0,
    totalInquiries: 0
  });

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(loggedInUser);
      console.log('User data from localStorage:', userData);
      setUser(userData);
      
      // Set initial profile data from user object
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        bio: userData.bio || 'Real estate enthusiast and property owner.'
      });
      
      // Fetch user stats
      fetchUserStats();
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Handle corrupted user data by redirecting to login
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserStats = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.id) {
        throw new Error('User not authenticated');
      }
      
      // Try to fetch from API first
      try {
        const response = await fetch(`http://localhost:8000/api/properties/?user=${userData.id}`);
        
        if (response.ok) {
          const properties = await response.json();
          updateStatsFromProperties(properties);
          return;
        }
      } catch (error) {
        console.log('API not available, using mock data for stats');
      }
      
      // Fallback to mock data if API fails
      if (window.mockProperties) {
        // Filter properties by user ID
        const userProperties = window.mockProperties.filter(
          prop => prop.user && prop.user.id === userData.id
        );
        updateStatsFromProperties(userProperties);
      } else {
        // Import mock data dynamically if not available in window
        import('../services/mockData.js').then(({ mockProperties }) => {
          // Store in window for future use
          window.mockProperties = mockProperties;
          
          // Filter properties by user ID
          const userProperties = mockProperties.filter(
            prop => prop.user && prop.user.id === userData.id
          );
          updateStatsFromProperties(userProperties);
        });
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to update stats from properties
  const updateStatsFromProperties = (properties) => {
    // Calculate stats from properties data
    const activeListings = properties.filter(prop => 
      prop.status === 'for_sale' || prop.status === 'for_rent'
    ).length;
    
    // Sum up views and inquiries
    const totalViews = properties.reduce((sum, prop) => sum + (prop.views || 0), 0);
    const totalInquiries = properties.reduce((sum, prop) => sum + (prop.inquiries || 0), 0);
    
    setStats({
      totalProperties: properties.length,
      activeListings,
      totalViews,
      totalInquiries
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    
    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords don't match");
      setPasswordLoading(false);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      setPasswordLoading(false);
      return;
    }
    
    try {
      // In a real app, you would send this data to your backend
      // For demo purposes, we'll simulate a successful password change
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setPasswordSuccess("Password changed successfully");
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Failed to change password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);
    
    try {
      // In a real app, you would send this data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in localStorage
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        bio: profileData.bio
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload(); // Force reload to update navbar
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          {/* Profile Sidebar */}
          <div className="profile-sidebar">

            
            <div className="profile-name">{profileData.name}</div>
            <div className="profile-email">{profileData.email}</div>
            
            <div className="profile-stats">
              <div className="stat">
                <div className="stat-value">{stats.totalProperties}</div>
                <div className="stat-label">Properties</div>
              </div>
              <div className="stat">
                <div className="stat-value">{stats.activeListings}</div>
                <div className="stat-label">Active</div>
              </div>
              <div className="stat">
                <div className="stat-value">{stats.totalViews}</div>
                <div className="stat-label">Views</div>
              </div>
            </div>
            
            <div className="profile-nav">
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="fas fa-user"></i> Profile
              </button>
              <button 
                className={`nav-item ${activeTab === 'properties' ? 'active' : ''}`}
                onClick={() => navigate('/my-properties')}
              >
                <i className="fas fa-home"></i> My Properties
              </button>
              {/* Removed Favorites and Inquiries buttons */}
              <button 
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <i className="fas fa-cog"></i> Settings
              </button>
              <button 
                className="nav-item logout"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="profile-content">
            {activeTab === 'profile' && (
              <div className="profile-details">
                <div className="content-header">
                  <h2>Profile Information</h2>
                  {!isEditing ? (
                    <button className="btn btn-primary" onClick={handleEditToggle}>
                      <i className="fas fa-edit"></i> Edit Profile
                    </button>
                  ) : (
                    <button className="btn btn-secondary" onClick={handleEditToggle}>
                      <i className="fas fa-times"></i> Cancel
                    </button>
                  )}
                </div>
                
                {error && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>{error}</p>
                  </div>
                )}
                
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="profile-form">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="bio">Bio</label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows="4"
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={saveLoading}
                    >
                      {saveLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Saving...
                        </>
                      ) : 'Save Changes'}
                    </button>
                  </form>
                ) : (
                  <div className="profile-info">
                    <div className="info-group">
                      <div className="info-label">Full Name</div>
                      <div className="info-value">{profileData.name}</div>
                    </div>
                    
                    <div className="info-group">
                      <div className="info-label">Email</div>
                      <div className="info-value">{profileData.email}</div>
                    </div>
                    
                    <div className="info-group">
                      <div className="info-label">Phone</div>
                      <div className="info-value">{profileData.phone || 'Not provided'}</div>
                    </div>
                    
                    <div className="info-group">
                      <div className="info-label">Bio</div>
                      <div className="info-value bio">{profileData.bio || 'No bio provided'}</div>
                    </div>
                    
                    <div className="info-group">
                      <div className="info-label">Member Since</div>
                      <div className="info-value">May 2023</div>
                    </div>
                  </div>
                )}
                
                {/* Recent Activity section removed */}
              </div>
            )}
            
            {/* Favorites and Inquiries sections removed */}
            
            {activeTab === 'settings' && (
              <div className="settings-section">
                <div className="content-header">
                  <h2>Account Settings</h2>
                </div>
                
                <div className="settings-group">
                  <h3>Password</h3>
                  <form className="settings-form" onSubmit={handlePasswordChange}>
                    {passwordError && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        <p>{passwordError}</p>
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className="success-message">
                        <i className="fas fa-check-circle"></i>
                        <p>{passwordSuccess}</p>
                      </div>
                    )}
                    <div className="form-group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <input 
                        type="password" 
                        id="currentPassword" 
                        name="currentPassword" 
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input 
                        type="password" 
                        id="newPassword" 
                        name="newPassword" 
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm New Password</label>
                      <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        required
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Updating...
                        </>
                      ) : 'Change Password'}
                    </button>
                  </form>
                </div>
                
                {/* Only password change functionality is kept, other settings removed */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
