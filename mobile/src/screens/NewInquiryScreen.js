import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { api } from '../services/api';

const NewInquiryScreen = ({ navigation, route }) => {
  const { recipient_id, recipient_name, event_id: paramEventId } = route?.params ?? {};
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [eventId, setEventId] = useState(paramEventId ?? null);
  const [loading, setLoading] = useState(false);

  const hasRecipient = !!recipient_id;
  const displayRecipientName = recipient_name ?? (hasRecipient ? 'Selected recipient' : null);

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Alert.alert('Missing subject', 'Please enter a subject.');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Missing message', 'Please enter a message.');
      return;
    }
    if (!hasRecipient) {
      Alert.alert(
        'Recipient required',
        'Please select a recipient. Recipient picker is coming soon (TODO).'
      );
      return;
    }

    setLoading(true);
    try {
      await api.createInquiry({
        recipient_id,
        subject: subject.trim(),
        message: message.trim(),
        ...(eventId && { event_id: eventId }),
      });
      Alert.alert('Sent', 'Your inquiry was sent successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to send inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.appName}>ARTISTFLOW</Text>
          <Text style={styles.title}>New Inquiry</Text>
        </View>
      </View>

      <View style={styles.recipientCard}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.recipientLabel}>SENDING TO</Text>
          <Text style={styles.recipientName}>
            {displayRecipientName ?? 'Select recipient (TODO)'}
          </Text>
          {!hasRecipient && (
            <Text style={styles.recipientNote}>Recipient picker coming soon.</Text>
          )}
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>SUBJECT</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Booking for Coachella 2024"
          value={subject}
          onChangeText={setSubject}
          editable={!loading}
        />

        <Text style={styles.label}>SELECT EVENT (OPTIONAL)</Text>
        <View style={styles.selectContainer}>
          <TextInput
            style={styles.select}
            placeholder="Choose a scheduled event..."
            editable={false}
          />
          <Text style={styles.selectArrow}>⌄</Text>
        </View>

        <Text style={styles.label}>MESSAGE</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Write your inquiry here with as much detail as possible..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={8}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Sending…' : 'Submit Inquiry'}
          </Text>
          {!loading && <Text style={styles.submitArrow}>→</Text>}
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },
  backButton: {
    fontSize: 24,
    color: '#000000',
  },
  appName: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
  },
  recipientLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: '600',
  },
  recipientNote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 10,
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textarea: {
    height: 200,
    textAlignVertical: 'top',
  },
  selectContainer: {
    position: 'relative',
  },
  select: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#9ca3af',
  },
  selectArrow: {
    position: 'absolute',
    right: 16,
    top: 12,
    fontSize: 20,
    color: '#9ca3af',
  },
  submitButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitArrow: {
    color: '#ffffff',
    fontSize: 20,
  },
});

export default NewInquiryScreen;

