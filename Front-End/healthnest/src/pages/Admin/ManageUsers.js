import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch, FaTrash, FaUser, FaUserCheck, FaUserSlash } from 'react-icons/fa';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/admin/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      // Replace with your actual API endpoint
      await axios.delete(`http://localhost:8080/admin/delete/${userId}`);
      
      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} selected users?`)) {
      try {
        // Replace with your actual API endpoint
        await axios.post('http://localhost:8080/admin/delete', { userIds: selectedUsers });
        
        // Update local state
        setUsers(users.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
      } catch (error) {
        console.error('Error performing bulk delete:', error);
      }
    }
  };

  const toggleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users data...</p>
      </div>
    );
  }

  return (
    <div className="manage-users-container">
      <div className="users-header">
        <h1>Manage Users</h1>
        
        <div className="users-summary">
          <div className="summary-card">
            <div className="summary-icon">
              <FaUser />
            </div>
            <div className="summary-details">
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
          </div>
          
          {selectedUsers.length > 0 && (
            <div className="bulk-actions">
              <span>{selectedUsers.length} users selected</span>
              <button className="bulk-delete-btn" onClick={handleBulkDelete}>
                <FaTrash /> Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="users-filter">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or email " 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="users-section">
        <h2>All Users</h2>
        {filteredUsers.length === 0 ? (
          <div className="no-data">
            <p>No users found matching your criteria</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Date Of Birth</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                      />
                    </td>
                    <td>
                      <div className="user-name-cell">
                        {user.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt={user.name} 
                            className="small-avatar" 
                          />
                        ) : (
                          <div className="small-avatar-placeholder">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone_no || 'N/A'}</td>
                    <td>{user.gender || 'N/A'}</td>
                    <td>{user.date_of_birth || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="view-btn">
                          View
                        </button>
                        {user.active ? (
                          <button className="deactivate-btn">
                            <FaUserSlash /> Deactivate
                          </button>
                        ) : (
                          <button className="activate-btn">
                            <FaUserCheck /> Activate
                          </button>
                        )}
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;