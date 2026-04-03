import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

const formatTimestamp = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
};

const InquiriesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchInquiries = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (activeTab === 'new') params.status = 'new';
        else if (activeTab === 'archived') params.status = 'archived';
        const res = await api.getInquiries(params);
        if (!cancelled) {
          setInquiries(Array.isArray(res) ? res : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load inquiries');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchInquiries();
    return () => { cancelled = true; };
  }, [activeTab]);

  const getTagStyle = (tag) => {
    const t = String(tag).toUpperCase();
    if (t === 'NEW') return [styles.tag, styles.tagNew];
    if (t === 'RESPONDED' || t === 'ARCHIVED') return [styles.tag, styles.tagResponded];
    return [styles.tag];
  };

  const getTagTextStyle = (tag) => {
    const t = String(tag).toUpperCase();
    if (t === 'NEW') return [styles.tagText, styles.tagNewText];
    if (t === 'RESPONDED' || t === 'ARCHIVED') return [styles.tagText, styles.tagRespondedText];
    return [styles.tagText];
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.appName}>ARTISTFLOW</Text>
          <Text style={styles.title}>Inquiries</Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All Messages
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'new' && styles.activeTab]}
            onPress={() => setActiveTab('new')}
          >
            <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>New</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'archived' && styles.activeTab]}
            onPress={() => setActiveTab('archived')}
          >
            <Text style={[styles.tabText, activeTab === 'archived' && styles.activeTabText]}>
              Archived
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text style={styles.loadingText}>Loading inquiries…</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.inquiriesList}>
            {inquiries.length === 0 ? (
              <Text style={styles.emptyText}>
                No {activeTab === 'all' ? '' : activeTab === 'new' ? 'new ' : 'archived '}inquiries
              </Text>
            ) : (
              inquiries.map((inquiry) => {
                const sender =
                  inquiry.sender_name ??
                  inquiry.sender?.name ??
                  inquiry.from_user?.name ??
                  inquiry.sender ??
                  'Unknown';
                const subject = inquiry.subject ?? inquiry.title ?? '';
                const message =
                  inquiry.message ?? inquiry.body ?? inquiry.preview ?? '';
                const preview = message.length > 60 ? `${message.slice(0, 60)}...` : message;
                const timestamp = formatTimestamp(
                  inquiry.created_at ?? inquiry.updated_at ?? inquiry.timestamp
                );
                const tags = Array.isArray(inquiry.tags) ? inquiry.tags : (inquiry.status ? [inquiry.status] : []);
                const hasUnread = inquiry.is_read === false || inquiry.has_unread === true;

                return (
                  <TouchableOpacity key={inquiry.id} style={styles.inquiryCard}>
                    <View style={styles.avatarContainer}>
                      <View style={styles.avatar} />
                      {hasUnread && <View style={styles.unreadDot} />}
                    </View>
                    <View style={styles.inquiryContent}>
                      <View style={styles.inquiryHeader}>
                        <Text style={styles.senderName}>{sender}</Text>
                        <Text style={styles.timestamp}>{timestamp}</Text>
                      </View>
                      <Text style={styles.subject}>{subject}</Text>
                      <Text style={styles.message}>{preview}</Text>
                      <View style={styles.tagsContainer}>
                        {tags.map((tag, idx) => (
                          <View key={idx} style={getTagStyle(tag)}>
                            <Text style={getTagTextStyle(tag)}>{String(tag).toUpperCase()}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewInquiry')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  appName: {
    fontSize: 10,
    color: '#9ca3af',
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
  inquiriesList: {
    padding: 20,
    paddingBottom: 90,
  },
  inquiryCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
  },
  unreadDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7c3aed',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  inquiryContent: {
    flex: 1,
  },
  inquiryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
  },
  subject: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagNew: {
    backgroundColor: '#e9d5ff',
  },
  tagResponded: {
    backgroundColor: '#d1fae5',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tagNewText: {
    color: '#7c3aed',
  },
  tagRespondedText: {
    color: '#059669',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '300',
    lineHeight: 32,
  },
});

export default InquiriesScreen;

