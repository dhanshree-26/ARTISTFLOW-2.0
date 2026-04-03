import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Layout from '../layouts/Layout';

const Inquiries = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data
  const inquiries = [
    {
      id: 1,
      sender: 'Aura Skies',
      subject: 'Summer Solstice Festival',
      message: "Hello! We've been tracking Aura's latest EP and would love to discu...",
      time: '2m ago',
      tags: ['NEW', 'FESTIVAL'],
      hasUnread: true,
    },
    {
      id: 2,
      sender: 'The Echo Chamber',
      subject: 'Press Kit Update & Tour',
      message: 'Attached our updated EPK for th...',
      time: '4h ago',
      tags: ['RESPONDED'],
      hasUnread: false,
    },
    {
      id: 3,
      sender: 'Julian Gray',
      subject: 'North American Tour Contract',
      message: 'Regarding the recent contract draft, we had a few questions...',
      time: '5h ago',
      tags: ['NEW', 'PRIORITY'],
      hasUnread: true,
    },
    {
      id: 4,
      sender: 'Luna Park',
      subject: 'Merchandise Proposal 2024',
      message: 'We have the new mockups for th...',
      time: 'Yesterday',
      tags: [],
      hasUnread: false,
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Messages' },
    { id: 'new', label: 'New' },
    { id: 'archived', label: 'Archived' },
  ];

  const getTagClass = (tag) => {
    const classes = {
      NEW: 'badge-new',
      RESPONDED: 'badge-responded',
      PRIORITY: 'badge-priority',
      FESTIVAL: 'bg-gray-100 text-gray-700',
    };
    return classes[tag] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Layout>
      <TopBar title="Inquiries" onSearch={() => {}} onNotification={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Link key={inquiry.id} to={`/inquiries/${inquiry.id}`}>
              <div className="card hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {inquiry.sender.charAt(0)}
                      </span>
                    </div>
                    {inquiry.hasUnread && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-accent rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="font-bold">{inquiry.sender}</div>
                        <div className="font-medium text-gray-900">{inquiry.subject}</div>
                      </div>
                      <div className="text-xs text-gray-500">{inquiry.time}</div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{inquiry.message}</p>
                    <div className="flex gap-2 flex-wrap">
                      {inquiry.tags.map((tag, idx) => (
                        <span key={idx} className={`badge ${getTagClass(tag)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Inquiries;
