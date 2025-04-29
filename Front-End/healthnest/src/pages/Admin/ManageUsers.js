import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch, FaUser } from 'react-icons/fa';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import './ManageUsers.css';
import { BASE_URL } from '../../config/apiConfig';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/admin/users`);
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNo && user.phoneNo.includes(searchTerm));
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users data...</p>
      </div>
    );
  }

  return (<>
  <Header></Header>
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
            
            style={{ textAlign: searchTerm ? 'center' : 'center' }}
            
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Date Of Birth</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}> 
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
                    <td>{user.phoneNo || 'N/A'}</td>
                    <td>{user.gender || 'N/A'}</td>
                    <td>{user.dateOfBirth || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

export default ManageUsers;