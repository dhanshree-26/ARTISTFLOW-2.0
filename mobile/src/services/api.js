import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android emulator: use 10.0.2.2 to reach host machine's localhost. iOS simulator uses localhost.
const API_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:4000/api' : 'http://localhost:4000/api';
const API_URL = API_BASE; // Change to production URL when deploying

export const api = {
  async request(endpoint, options = {}) {
    const token = await AsyncStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  // Auth methods (same as web)
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async googleLogin(token, platform = 'ios') {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token, platform }),
    });
  },

  async getMe() {
    return this.request('/auth/me');
  },

  // Events
  async getEvents(params = {}) {
    const { status, date_from, date_to } = params;
    const searchParams = new URLSearchParams();
    if (status != null && status !== '') searchParams.append('status', status);
    if (date_from != null && date_from !== '') searchParams.append('date_from', date_from);
    if (date_to != null && date_to !== '') searchParams.append('date_to', date_to);
    const qs = searchParams.toString();
    return this.request(`/events${qs ? `?${qs}` : ''}`);
  },

  async getEvent(id) {
    return this.request(`/events/${id}`);
  },

  async getEventSlots(eventId) {
    return this.request(`/slots/events/${eventId}/slots`);
  },

  // Inquiries
  async getInquiries(params = {}) {
    const { type, status } = params;
    const searchParams = new URLSearchParams();
    if (type != null && type !== '') searchParams.append('type', type);
    if (status != null && status !== '') searchParams.append('status', status);
    const qs = searchParams.toString();
    return this.request(`/inquiries${qs ? `?${qs}` : ''}`);
  },

  async getInquiry(id) {
    return this.request(`/inquiries/${id}`);
  },

  async createInquiry(body) {
    const { recipient_id, subject, message, event_id, tags } = body;
    const payload = { recipient_id, subject, message };
    if (event_id != null) payload.event_id = event_id;
    if (tags != null && tags.length) payload.tags = tags;
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
