import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const EventSlotsScreen = ({ route }) => {
  const { eventId } = route.params;

  const slots = [
    { id: '1', number: 1, type: 'Headliner', artist: 'Aura Skies', genre: 'Electronic • Ambient', status: 'confirmed' },
    { id: '2', number: 2, type: 'Main Support', artist: 'Julian Gray', genre: 'Acoustic Soul', status: 'pending' },
    { id: '3', number: 3, type: 'Opening Act', artist: null, status: 'empty' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>UPCOMING EVENT</Text>
        <Text style={styles.title}>Summer Solstice Festival</Text>
        <Text style={styles.details}>Crystal Lake Amphitheater</Text>
        <Text style={styles.details}>June 21, 2024 • 4:00 PM</Text>
      </View>

      <View style={styles.slotsSection}>
        <View style={styles.slotsHeader}>
          <Text style={styles.slotsTitle}>Event Slots</Text>
          <Text style={styles.slotsCount}>4 total slots</Text>
        </View>

        {slots.map((slot) => (
          <View key={slot.id} style={styles.slotCard}>
            <Text style={styles.slotLabel}>
              SLOT {String(slot.number).padStart(2, '0')} • {slot.type}
            </Text>
            {slot.artist ? (
              <>
                <View style={styles.artistInfo}>
                  <View style={styles.avatar} />
                  <View style={styles.artistDetails}>
                    <Text style={styles.artistName}>{slot.artist}</Text>
                    <Text style={styles.artistGenre}>{slot.genre}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    slot.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      slot.status === 'confirmed' ? styles.statusConfirmedText : styles.statusPendingText,
                    ]}
                  >
                    {slot.status.toUpperCase()}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.emptySlot}>
                <View style={styles.emptyAvatar}>
                  <Text style={styles.plusSign}>+</Text>
                </View>
                <Text style={styles.emptyText}>Assign an Artist</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.publishButton}>
          <Text style={styles.publishButtonText}>Publish Schedule</Text>
        </View>
      </View>
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
  label: {
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  details: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  slotsSection: {
    padding: 20,
  },
  slotsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  slotsTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  slotsCount: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  slotCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  slotLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
  },
  artistDetails: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistGenre: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: '#d1fae5',
  },
  statusPending: {
    backgroundColor: '#e9d5ff',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusConfirmedText: {
    color: '#059669',
  },
  statusPendingText: {
    color: '#7c3aed',
  },
  emptySlot: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  plusSign: {
    fontSize: 40,
    color: '#9ca3af',
  },
  emptyText: {
    fontSize: 12,
    color: '#6b7280',
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  publishButton: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  publishButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventSlotsScreen;

