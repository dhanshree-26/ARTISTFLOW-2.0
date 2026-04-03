import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Layout from '../layouts/Layout';

const EventSlots = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const event = {
    id: id,
    name: 'Summer Solstice Festival',
    venue: 'Crystal Lake Amphitheater',
    date: 'June 21, 2024',
    time: '4:00 PM',
  };

  const slots = [
    {
      id: 1,
      number: 1,
      type: 'Headliner',
      artist: {
        name: 'Aura Skies',
        genre: 'Electronic • Ambient',
        avatar: 'AS',
      },
      status: 'confirmed',
    },
    {
      id: 2,
      number: 2,
      type: 'Main Support',
      artist: {
        name: 'Julian Gray',
        genre: 'Acoustic Soul',
        avatar: 'JG',
      },
      status: 'pending',
    },
    {
      id: 3,
      number: 3,
      type: 'Opening Act',
      artist: null,
    },
    {
      id: 4,
      number: 4,
      type: 'Late Night Set',
      artist: null,
    },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="text-xs text-gray-500 uppercase mb-1">Upcoming Event</div>
          <h1 className="text-3xl font-serif mb-3">{event.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.venue}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {event.date} • {event.time}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif">Event Slots</h2>
            <span className="text-sm text-gray-500">4 total slots</span>
          </div>

          <div className="space-y-4">
            {slots.map((slot, index) => (
              <div key={slot.id} className="relative">
                {index < slots.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300"></div>
                )}
                <div className="card">
                  <div className="text-xs text-gray-500 uppercase mb-3">
                    Slot {slot.number.toString().padStart(2, '0')} • {slot.type.toUpperCase()}
                  </div>
                  {slot.artist ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">
                          {slot.artist.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-lg">{slot.artist.name}</div>
                          <div className="text-sm text-gray-500">{slot.artist.genre}</div>
                        </div>
                      </div>
                      <span
                        className={`badge ${
                          slot.status === 'confirmed' ? 'badge-confirmed' : 'badge-pending'
                        }`}
                      >
                        {slot.status.toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-500">Assign an Artist</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full btn-primary py-4 text-lg">Publish Schedule</button>
      </div>
    </Layout>
  );
};

export default EventSlots;
