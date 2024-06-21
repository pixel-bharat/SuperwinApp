import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://192.168.1.17:3000/api/notifications/all');

      if (!response.ok) {
        throw new Error('Failed to fetch notifications.');
      }

      const data = await response.json();
      setNotifications(data.notifications);
      setError(null);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications. Please try again later.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationContainer}>
      <Text style={styles.userId}>{item.user_id}</Text>
      <FlatList
        data={item.Notifications} // Assuming 'Notifications' is the correct array name based on your API response
        renderItem={({ item: notification }) => (
          <View style={styles.notification}>
            <Text style={styles.notificationText}>{notification.notification}</Text>
            <Text style={styles.notificationText}>Type: {notification.type}</Text>
            <Text style={styles.notificationText}>Date: {new Date(notification.date).toLocaleString()}</Text>
            {notification.amount && <Text style={styles.notificationText}>Amount: {notification.amount}</Text>}
            {notification.room_id && <Text style={styles.notificationText}>Room ID: {notification.room_id}</Text>}
            {notification.room_name && <Text style={styles.notificationText}>Room Name: {notification.room_name}</Text>}
          </View>
        )}
        keyExtractor={(notification, index) => index.toString()}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#000', // Changed background color to black (#000)
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // Added white color to title text
  },
  notificationContainer: {
    marginBottom: 20,
  },
  userId: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // Added white color to user_id text
  },
  notification: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f0f0f0', // Added background color to notification item
  },
  notificationText: {
    fontSize: 16,
    color: '#333', // Added color to notification text
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default NotificationScreen;
