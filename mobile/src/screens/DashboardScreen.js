import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [meRes, eventsRes] = await Promise.all([
          api.getMe(),
          api.getEvents({ status: 'upcoming' }),
        ]);
        if (!cancelled) {
          setEvents(Array.isArray(eventsRes) ? eventsRes : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load dashboard');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const firstEvent = events[0];
  const activeCount = events.length;

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Loading dashboard…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.subtitle}>
              • System optimized • {activeCount} upcoming {activeCount === 1 ? 'event' : 'events'}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>GROSS REVENUE</Text>
          <Text style={styles.statValue}>—</Text>
          <Text style={styles.statChange}>Placeholder</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>ACTIVE</Text>
          <Text style={styles.statValue}>{String(activeCount).padStart(2, '0')}</Text>
          <Text style={styles.statLink}>View activity →</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Next Spotlight</Text>
        <View style={styles.eventCard}>
          {firstEvent ? (
            <>
              <Text style={styles.eventName}>{firstEvent.event_name}</Text>
              <Text style={styles.eventDetails}>{firstEvent.venue}</Text>
              <Text style={styles.eventTime}>
                {formatDate(firstEvent.date)} • {formatTime(firstEvent.time)}
              </Text>
            </>
          ) : (
            <Text style={styles.eventDetails}>No upcoming events</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
  header: {
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  logoutButtonText: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '600',
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'serif',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'serif',
    color: '#7c3aed',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#6b7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  statLink: {
    fontSize: 12,
    color: '#7c3aed',
    marginTop: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default DashboardScreen;

