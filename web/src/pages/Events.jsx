import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Layout from '../layouts/Layout';

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock data
  const events = [
    {
      id: 1,
      name: 'Summer Solstice Festival',
      date: 'Aug 24, 2024',
      location: 'London, UK',
      status: 'confirmed',
      artists: [
        { id: 1, name: 'Artist 1', avatar: 'A1' },
        { id: 2, name: 'Artist 2', avatar: 'A2' },
        { id: 3, name: 'Artist 3', avatar: 'A3' },
      ],
      totalArtists: 5,
      assignedArtists: 3,
    },
    {
      id: 2,
      name: 'Neon Nights Warehouse',
      date: 'Sep 02, 2024',
      location: 'Berlin, DE',
      status: 'action-needed',
      artists: [
        { id: 4, name: 'Artist 4', avatar: 'A4' },
      ],
      totalArtists: 4,
      assignedArtists: 1,
    },
    {
      id: 3,
      name: 'Underground Session',
      date: 'Jul 15, 2024',
      location: 'Paris',
      status: 'confirmed',
      artists: [
        { id: 5, name: 'Artist 5', avatar: 'A5' },
        { id: 6, name: 'Artist 6', avatar: 'A6' },
      ],
      totalArtists: 2,
      assignedArtists: 2,
    },
  ];

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past Productions' },
    { id: 'drafts', label: 'Drafts' },
  ];

  return (
    <Layout>
      <TopBar title="Events" onSearch={() => {}} onNotification={() => {}} />
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
          {events.map((event) => (
            <Link key={event.id} to={`/events/${event.id}/slots`}>
              <div className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        event.status === 'confirmed'
                          ? 'bg-status-confirmed'
                          : 'bg-status-action-needed'
                      }`}
                    ></span>
                    <span
                      className={`text-xs font-medium ${
                        event.status === 'confirmed'
                          ? 'text-status-confirmed'
                          : 'text-status-action-needed'
                      }`}
                    >
                      {event.status === 'confirmed' ? 'CONFIRMED' : 'ACTION NEEDED'}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>

                <h3 className="font-bold text-xl mb-3">{event.name}</h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>DATE</span>
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>LOCATION</span>
                    <span className="font-medium">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center -space-x-2">
                    {event.artists.slice(0, 3).map((artist, idx) => (
                      <div
                        key={artist.id}
                        className="w-10 h-10 rounded-full bg-purple-200 border-2 border-white flex items-center justify-center text-purple-700 font-medium text-sm"
                      >
                        {artist.avatar}
                      </div>
                    ))}
                    {event.artists.length > 3 && (
                      <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-700 font-medium text-xs">
                        +{event.artists.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 ml-4">
                    <div className="text-xs text-gray-500 mb-1">ROSTER FILLED</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-accent h-2 rounded-full"
                          style={{ width: `${(event.assignedArtists / event.totalArtists) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-purple-accent">
                        {event.assignedArtists}/{event.totalArtists} Artists
                      </span>
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

export default Events;
