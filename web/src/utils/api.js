const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
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

  // Auth
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(email, password, name, role) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  },

  async googleLogin(token, platform = 'web') {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token, platform }),
    });
  },

  async getCurrentUser() {
    return this.request('/auth/me');
  },

  // Events
  async getEvents(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/events?${params}`);
  },

  async getEvent(id) {
    return this.request(`/events/${id}`);
  },

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  async updateEvent(id, eventData) {
    return this.request(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(eventData),
    });
  },

  async deleteEvent(id) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Slots
  async getEventSlots(eventId) {
    return this.request(`/slots/events/${eventId}/slots`);
  },

  async assignSlot(eventId, slotData) {
    return this.request(`/slots/events/${eventId}/slots`, {
      method: 'POST',
      body: JSON.stringify(slotData),
    });
  },

  async updateSlot(slotId, slotData) {
    return this.request(`/slots/${slotId}`, {
      method: 'PATCH',
      body: JSON.stringify(slotData),
    });
  },

  // Inquiries
  async getInquiries(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/inquiries?${params}`);
  },

  async getInquiry(id) {
    return this.request(`/inquiries/${id}`);
  },

  async createInquiry(inquiryData) {
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  },

  // Availability
  async getAvailability(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/availability?${params}`);
  },

  async setAvailability(availabilityData) {
    return this.request('/availability', {
      method: 'POST',
      body: JSON.stringify(availabilityData),
    });
  },
};
