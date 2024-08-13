import React, { useEffect, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import BASE_URL from "../backend/config/config";

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [filterBy, setFilterBy] = useState("all"); // Default: show all notifications

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, filterBy]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}api/notifications/all`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications.");
      }

      const data = await response.json();
      setNotifications(data.notifications);
      setError(null);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to fetch notifications. Please try again later.");
    }
  };

  const filterNotifications = () => {
    switch (filterBy) {
      case "today":
        filterByToday();
        break;
      case "yesterday":
        filterByYesterday();
        break;
      case "thisWeek":
        filterByThisWeek();
        break;
      default:
        setFilteredNotifications(notifications); // Show all notifications
        break;
    }
  };

  const filterByToday = () => {
    const today = new Date();
    const filtered = notifications.filter((notification) => {
      const notificationDate = new Date(notification.date);
      return (
        notificationDate.getDate() === today.getDate() &&
        notificationDate.getMonth() === today.getMonth() &&
        notificationDate.getFullYear() === today.getFullYear() &&
        notification.type === "added_money"
      );
    });
    setFilteredNotifications(filtered);
  };

  const filterByYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const filtered = notifications.filter((notification) => {
      const notificationDate = new Date(notification.date);
      return (
        notificationDate.getDate() === yesterday.getDate() &&
        notificationDate.getMonth() === yesterday.getMonth() &&
        notificationDate.getFullYear() === yesterday.getFullYear() &&
        notification.type === "withdrew_money"
      );
    });
    setFilteredNotifications(filtered);
  };

  const filterByThisWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the current week
    const filtered = notifications.filter((notification) => {
      const notificationDate = new Date(notification.date);
      return (
        notificationDate >= startOfWeek &&
        notificationDate <= today &&
        notification.type === "joined_room"
      );
    });
    setFilteredNotifications(filtered);
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationContainer}>
      <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={require("../assets/avatar/avatar_2.png")}
        />
        <Text style={styles.userId}>{item.user_id}</Text>
      </View>
      <FlatList
        data={item.Notifications}
        renderItem={({ item: notification }) => (
          <View style={styles.notification}>
            <Text style={styles.notificationText}>{notification.notification}</Text>
            <Text style={styles.notificationDetail}>
              {getNotificationType(notification)}
            </Text>
            <Text style={styles.notificationDetail}>
              {new Date(notification.date).toLocaleString()}
            </Text>
            {notification.amount && (
              <Text style={styles.notificationDetail}>Amount: ${notification.amount}</Text>
            )}
            {notification.room_id && (
              <Text style={styles.notificationDetail}>Room ID: {notification.room_id}</Text>
            )}
            {notification.room_name && (
              <Text style={styles.notificationDetail}>Room Name: {notification.room_name}</Text>
            )}
          </View>
        )}
        keyExtractor={(notification, index) => index.toString()}
      />
    </View>
  );

  const getNotificationType = (notification) => {
    switch (notification.type) {
      case "added_money":
        return "Added money";
      case "withdrew_money":
        return "Withdrew money";
      case "joined_room":
        return "Joined a new room";
      default:
        return notification.type;
    }
  };

  const handleFilterChange = (filter) => {
    setFilterBy(filter);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.mainHeader}>
          <Text style={styles.title}>Notifications</Text>
          <TouchableOpacity onPress={() => alert("Search functionality")}>
            <Image
              source={require("../assets/search.png")}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filterBy === "all" && styles.activeFilter]}
            onPress={() => handleFilterChange("all")}
          >
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterBy === "today" && styles.activeFilter]}
            onPress={() => handleFilterChange("today")}
          >
            <Text style={styles.filterText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterBy === "yesterday" && styles.activeFilter]}
            onPress={() => handleFilterChange("yesterday")}
          >
            <Text style={styles.filterText}>Yesterday</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterBy === "thisWeek" && styles.activeFilter]}
            onPress={() => handleFilterChange("thisWeek")}
          >
            <Text style={styles.filterText}>This Week</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={filteredNotifications.length > 0 ? filteredNotifications : notifications}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  notificationContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  notification: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  notificationText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  notificationDetail: {
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 16,
    color: "#fff",
  },
  activeFilter: {
    backgroundColor: "#555", // Darker background for active filter
  },
});

export default NotificationScreen;
