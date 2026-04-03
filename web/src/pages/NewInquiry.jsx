import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';

const NewInquiry = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    event: '',
    message: '',
  });

  // Mock recipient
  const recipient = {
    name: 'Aura Skies',
    avatar: 'AS',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Submit inquiry:', formData);
    navigate('/inquiries');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <div className="text-xs text-gray-500 uppercase">ArtistFlow</div>
            <h1 className="text-2xl font-serif">New Inquiry</h1>
          </div>
        </div>

        <div className="card mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">{recipient.avatar}</span>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Sending To</div>
              <div className="font-bold text-lg">{recipient.name}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Booking for Coachella 2024"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-accent focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase mb-2">
              Select Event (Optional)
            </label>
            <div className="relative">
              <select
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-accent focus:border-transparent appearance-none bg-white"
              >
                <option value="">Choose a scheduled event...</option>
                <option value="1">Summer Solstice Festival</option>
                <option value="2">Neon Nights Warehouse</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase mb-2">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write your inquiry here with as much detail as possible..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-accent focus:border-transparent resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
          >
            Submit Inquiry
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default NewInquiry;
