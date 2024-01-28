import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate= useNavigate();

  useEffect(() => {
    // Function to fetch notifications
    const fetchNotifications = async () => {
      try {
        const email = localStorage.getItem('email');
        const response = await fetch(`/api/notifications/email/${email}/read/false`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        setError('Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };

    // Call the fetchNotifications function
    fetchNotifications();
  }, []); // Empty dependency array ensures that this effect runs only once when the component mounts
  const handleBack=()=>{
    navigate("/dashboard");
  }
  return (
    <div className='notifications_header'>
       <button onClick={handleBack}>Back</button>
      <h2>Notifications</h2>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>
              <strong>{notification.message}</strong> - {notification.timestamp}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;

