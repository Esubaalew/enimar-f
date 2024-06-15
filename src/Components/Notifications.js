import React, { useState, useEffect } from 'react';
import { getAllNotifications } from '../API/notifications';
import { getLoggedInUser } from '../API/auth';
import '../styles/Notifications.css';
import Header from './Header';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [userId, setUserId] = useState(null);
  const accessToken = JSON.parse(localStorage.getItem('user'))?.access;

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const user = await getLoggedInUser(accessToken);
          setUserId(user.id);
          const notificationsData = await getAllNotifications(user.id, accessToken);
          setNotifications(notificationsData);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchUser();
  }, [accessToken]);

  return (
    <>
    <Header />
    <div className="Nnotifications">
      <div className="fancy-header">
        <h1>Notifications</h1>
      </div>
      {notifications.length > 0 ? (
        <ul className="Nnotifications-list">
          {notifications.map(notification => (
            <li key={notification.id} className={`Nnotification-item ${notification.is_read ? 'read' : 'unread'}`}>
              <div className="Nnotification-type">{notification.notification_type}</div>
              <div className="Nnotification-text">{notification.text}</div>
              <div className="Nnotification-date">{new Date(notification.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications available</p>
      )}
    </div>
    </>
  );
};

export default Notifications;
