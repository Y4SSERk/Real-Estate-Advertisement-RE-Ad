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
    bio: '',
    profileImage: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
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
    
    const userData = JSON.parse(loggedInUser);
    setUser(userData);
    
    // Set initial profile data from user object
    setProfileData({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      bio: userData.bio || 'Real estate enthusiast and property owner.',
      profileImage: userData.profileImage || 'https://via.placeholder.com/150'
    });
    
    // Fetch user stats
    fetchUserStats();
  }, [navigate]);

  const fetchUserStats = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.id) {
        throw new Error('User not authenticated');
      }
      
      // Fetch user properties to calculate stats
      const response = await fetch(`http://localhost:8000/api/properties/?user=${userData.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const properties = await response.json();
      
      // Calculate stats from properties data
      const activeListings = properties.filter(prop => 
        prop.status === 'for_sale' || prop.status === 'for_rent'
      ).length;
      
      // Sum up views and inquiries (if available in your API)
      const totalViews = properties.reduce((sum, prop) => sum + (prop.views || 0), 0);
      const totalInquiries = properties.reduce((sum, prop) => sum + (prop.inquiries || 0), 0);
      
      setStats({
        totalProperties: properties.length,
        activeListings,
        totalViews,
        totalInquiries
      });
    } catch (err) {
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
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
        bio: profileData.bio,
        profileImage: profileData.profileImage
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
            <div className="profile-image-container">
              <img src={profileData.profileImage} alt="Profile" className="profile-image" />
              {isEditing && (
                <div className="image-upload">
                  <label htmlFor="profileImage">
                    <i className="fas fa-camera"></i>
                  </label>
                  <input 
                    type="text" 
                    id="profileImage" 
                    name="profileImage" 
                    value={profileData.profileImage}
                    onChange={handleInputChange}
                    placeholder="Image URL"
                    className="image-url-input"
                  />
                </div>
              )}
            </div>
            
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
              <button 
                className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                <i className="fas fa-heart"></i> Favorites
              </button>
              <button 
                className={`nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
                onClick={() => setActiveTab('inquiries')}
              >
                <i className="fas fa-envelope"></i> Inquiries
              </button>
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
                
                <div className="activity-section">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon">
                        <i className="fas fa-home"></i>
                      </div>
                      <div className="activity-details">
                        <div className="activity-title">Added a new property</div>
                        <div className="activity-description">Modern Apartment in City Center</div>
                        <div className="activity-time">2 days ago</div>
                      </div>
                    </div>
                    
                    <div className="activity-item">
                      <div className="activity-icon">
                        <i className="fas fa-comment"></i>
                      </div>
                      <div className="activity-details">
                        <div className="activity-title">Received an inquiry</div>
                        <div className="activity-description">From Sarah about Luxury Villa with Pool</div>
                        <div className="activity-time">1 week ago</div>
                      </div>
                    </div>
                    
                    <div className="activity-item">
                      <div className="activity-icon">
                        <i className="fas fa-edit"></i>
                      </div>
                      <div className="activity-details">
                        <div className="activity-title">Updated property</div>
                        <div className="activity-description">Office Space in Business District</div>
                        <div className="activity-time">2 weeks ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'favorites' && (
              <div className="favorites-section">
                <div className="content-header">
                  <h2>Favorite Properties</h2>
                </div>
                
                <div className="no-content-message">
                  <i className="fas fa-heart"></i>
                  <h3>No Favorites Yet</h3>
                  <p>You haven't added any properties to your favorites yet.</p>
                  <button className="btn btn-primary" onClick={() => navigate('/search')}>Browse Properties</button>
                </div>
              </div>
            )}
            
            {activeTab === 'inquiries' && (
              <div className="inquiries-section">
                <div className="content-header">
                  <h2>My Inquiries</h2>
                </div>
                
                <div className="inquiries-tabs">
                  <button className="tab-btn active">Received (3)</button>
                  <button className="tab-btn">Sent (0)</button>
                </div>
                
                <div className="inquiries-list">
                  <div className="inquiry-item">
                    <div className="inquiry-header">
                      <div className="inquiry-property">Luxury Villa with Pool</div>
                      <div className="inquiry-date">May 15, 2023</div>
                    </div>
                    <div className="inquiry-content">
                      <div className="inquiry-user">
                        <div className="user-avatar">
                          <img src="https://via.placeholder.com/40" alt="User" />
                        </div>
                        <div className="user-info">
                          <div className="user-name">Sarah Johnson</div>
                          <div className="user-email">sarah.j@example.com</div>
                        </div>
                      </div>
                      <div className="inquiry-message">
                        Hello, I'm interested in this property. Is it still available? I would like to schedule a viewing this weekend if possible.
                      </div>
                      <div className="inquiry-actions">
                        <button className="btn btn-primary">
                          <i className="fas fa-reply"></i> Reply
                        </button>
                        <button className="btn btn-secondary">
                          <i className="fas fa-archive"></i> Archive
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="inquiry-item">
                    <div className="inquiry-header">
                      <div className="inquiry-property">Modern Apartment in City Center</div>
                      <div className="inquiry-date">May 10, 2023</div>
                    </div>
                    <div className="inquiry-content">
                      <div className="inquiry-user">
                        <div className="user-avatar">
                          <img src="https://via.placeholder.com/40" alt="User" />
                        </div>
                        <div className="user-info">
                          <div className="user-name">Michael Brown</div>
                          <div className="user-email">michael.b@example.com</div>
                        </div>
                      </div>
                      <div className="inquiry-message">
                        I'm looking for an apartment in this area. What's the earliest move-in date available? Also, is the price negotiable?
                      </div>
                      <div className="inquiry-actions">
                        <button className="btn btn-primary">
                          <i className="fas fa-reply"></i> Reply
                        </button>
                        <button className="btn btn-secondary">
                          <i className="fas fa-archive"></i> Archive
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="inquiry-item">
                    <div className="inquiry-header">
                      <div className="inquiry-property">Office Space in Business District</div>
                      <div className="inquiry-date">May 5, 2023</div>
                    </div>
                    <div className="inquiry-content">
                      <div className="inquiry-user">
                        <div className="user-avatar">
                          <img src="https://via.placeholder.com/40" alt="User" />
                        </div>
                        <div className="user-info">
                          <div className="user-name">David Wilson</div>
                          <div className="user-email">david.w@example.com</div>
                        </div>
                      </div>
                      <div className="inquiry-message">
                        Our company is expanding and we're looking for office space. Does this property have high-speed internet and parking facilities?
                      </div>
                      <div className="inquiry-actions">
                        <button className="btn btn-primary">
                          <i className="fas fa-reply"></i> Reply
                        </button>
                        <button className="btn btn-secondary">
                          <i className="fas fa-archive"></i> Archive
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="settings-section">
                <div className="content-header">
                  <h2>Account Settings</h2>
                </div>
                
                <div className="settings-group">
                  <h3>Password</h3>
                  <form className="settings-form">
                    <div className="form-group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <input type="password" id="currentPassword" name="currentPassword" />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input type="password" id="newPassword" name="newPassword" />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm New Password</label>
                      <input type="password" id="confirmPassword" name="confirmPassword" />
                    </div>
                    
                    <button type="submit" className="btn btn-primary">Change Password</button>
                  </form>
                </div>
                
                <div className="settings-group">
                  <h3>Notifications</h3>
                  <div className="notification-settings">
                    <div className="notification-option">
                      <div className="option-label">
                        <h4>Email Notifications</h4>
                        <p>Receive emails about inquiries, property updates, and more</p>
                      </div>
                      <div className="option-toggle">
                        <input type="checkbox" id="emailNotifications" checked />
                        <label htmlFor="emailNotifications"></label>
                      </div>
                    </div>
                    
                    <div className="notification-option">
                      <div className="option-label">
                        <h4>Property Alerts</h4>
                        <p>Get notified when new properties match your criteria</p>
                      </div>
                      <div className="option-toggle">
                        <input type="checkbox" id="propertyAlerts" checked />
                        <label htmlFor="propertyAlerts"></label>
                      </div>
                    </div>
                    
                    <div className="notification-option">
                      <div className="option-label">
                        <h4>Marketing Communications</h4>
                        <p>Receive updates about promotions and news</p>
                      </div>
                      <div className="option-toggle">
                        <input type="checkbox" id="marketingComms" />
                        <label htmlFor="marketingComms"></label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="settings-group danger-zone">
                  <h3>Danger Zone</h3>
                  <div className="danger-actions">
                    <div className="danger-action">
                      <div className="action-info">
                        <h4>Deactivate Account</h4>
                        <p>Temporarily disable your account</p>
                      </div>
                      <button className="btn btn-outline-danger">Deactivate</button>
                    </div>
                    
                    <div className="danger-action">
                      <div className="action-info">
                        <h4>Delete Account</h4>
                        <p>Permanently delete your account and all your data</p>
                      </div>
                      <button className="btn btn-danger">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
