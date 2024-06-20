import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const userId = 'uuidv424401'; // Replace with the actual user ID

  useEffect(() => {
    fetchNotifications();
  }, []);
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://192.168.1.17:3000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });
  
      if (!response.ok) {
        throw new Error('No notifications found for this user.');
      }
  
      const data = await response.json();
      console.log('Fetched notifications:', data);
      setNotifications(data.notifications); // Assuming notifications are nested in 'notifications' field
      setError(null); // Reset error state if the fetch is successful
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications. Please try again later.');
    }
  };
  
  const renderItem = ({ item }) => (
    <View style={styles.notification}>
      <Text style={styles.notificationText}>{item.notification}</Text>
      <Text style={styles.notificationText}>Date: {new Date(item.date).toLocaleString()}</Text>
      {item.amount !== undefined && <Text style={styles.notificationText}>Amount: ${item.amount}</Text>}
      {item.room_id && <Text style={styles.notificationText}>Room ID: {item.room_id}</Text>}
      {item.room_name && <Text style={styles.notificationText}>Room Name: {item.room_name}</Text>}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Adjust background color as needed
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  notification: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  notificationText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default NotificationScreen;
