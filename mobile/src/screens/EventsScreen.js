import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const statusToDisplay = (status) => {
  if (status === 'upcoming') return { label: 'UPCOMING', isGreen: true };
  if (status === 'completed') return { label: 'COMPLETED', isGreen: false };
  if (status === 'cancelled') return { label: 'CANCELLED', isGreen: false };
  return { label: (status || '').toUpperCase(), isGreen: status === 'confirmed' };
};

// API fields used: id, event_name, venue, date, time, status, total_slots (optional: event_slots for roster count)
const EventsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        if (activeTab === 'upcoming') {
          res = await api.getEvents({ status: 'upcoming' });
        } else if (activeTab === 'past') {
          res = await api.getEvents({ status: 'completed' });
        } else {
          res = await api.getEvents();
          if (!cancelled && Array.isArray(res)) {
            res = res.filter((e) => e.status === 'draft');
          }
        }
        if (!cancelled) {
          setEvents(Array.isArray(res) ? res : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load events');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchEvents();
    return () => { cancelled = true; };
  }, [activeTab]);

  const displayEvents = events;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.studioLabel}>MANAGEMENT STUDIO</Text>
        <Text style={styles.title}>Events</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past Productions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'drafts' && styles.activeTab]}
          onPress={() => setActiveTab('drafts')}
        >
          <Text style={[styles.tabText, activeTab === 'drafts' && styles.activeTabText]}>
            Drafts
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={styles.loadingText}>Loading events…</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <View style={styles.eventsList}>
          {displayEvents.length === 0 ? (
            <Text style={styles.emptyText}>
              No {activeTab === 'upcoming' ? 'upcoming' : activeTab === 'past' ? 'past' : 'draft'} events
            </Text>
          ) : (
            displayEvents.map((event) => {
              const { label: statusLabel, isGreen } = statusToDisplay(event.status);
              const totalSlots = event.total_slots ?? 0;
              const assignedCount = event.event_slots?.length ?? event.assigned_slots ?? '—';
              return (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCard}
                  onPress={() =>
                    navigation.navigate('EventSlots', { eventId: event.id, event })
                  }
                >
                  <View style={styles.eventHeader}>
                    <View style={styles.statusContainer}>
                      <View
                        style={[
                          styles.statusDot,
                          isGreen ? styles.statusGreen : styles.statusOrange,
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          isGreen ? styles.statusGreenText : styles.statusOrangeText,
                        ]}
                      >
                        {statusLabel}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.eventName}>{event.event_name}</Text>
                  <Text style={styles.eventDate}>DATE {formatDate(event.date)}</Text>
                  <Text style={styles.eventLocation}>LOCATION {event.venue}</Text>
                  <View style={styles.rosterContainer}>
                    <Text style={styles.rosterLabel}>ROSTER FILLED</Text>
                    <Text style={styles.rosterCount}>
                      {assignedCount}/{totalSlots} Artists
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  studioLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    paddingBottom: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#000000',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
  },
  emptyText: {
    padding: 20,
    fontSize: 14,
    color: '#6b7280',
  },
  eventsList: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusGreen: {
    backgroundColor: '#10b981',
  },
  statusOrange: {
    backgroundColor: '#f97316',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusGreenText: {
    color: '#059669',
  },
  statusOrangeText: {
    color: '#ea580c',
  },
  eventName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  eventDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  rosterContainer: {
    marginTop: 12,
  },
  rosterLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  rosterCount: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '600',
  },
});

export default EventsScreen;

