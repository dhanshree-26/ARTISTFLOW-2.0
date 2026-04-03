import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TopBar from '../components/TopBar';
import Layout from '../layouts/Layout';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock data
  const revenue = { amount: 42800, change: 12 };
  const activeItems = 7;
  const nextEvent = {
    name: 'Ethereal Jazz Trio',
    venue: 'The Velvet Lounge, Brooklyn',
    date: 'OCT 16',
    time: '21:00 – 23:30',
  };
  const inquiry = {
    title: 'Metropolis Gala 2024',
    description: 'Headline set requested for the annual arts benefit. Creative freedom on repertoire.',
    isNew: true,
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const today = new Date();
  const currentDay = today.getDate();
  const isCurrentMonth = today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();

  const calendarDays = [];
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-serif mb-1">Welcome back,</h1>
          <h2 className="text-3xl font-serif text-purple-accent">{user?.name || 'User'}.</h2>
          <p className="text-sm text-gray-500 mt-2">• System optimized • 2 schedules pending</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card relative overflow-hidden">
            <div className="text-xs text-gray-500 uppercase mb-2">Gross Revenue</div>
            <div className="text-3xl font-bold mb-1">${(revenue.amount / 1000).toFixed(1)}k</div>
            <div className="text-sm text-green-600">+{revenue.change}%</div>
            <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M0,100 L100,0" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="card">
            <div className="text-xs text-gray-500 uppercase mb-2">Active</div>
            <div className="text-3xl font-bold mb-1">{activeItems.toString().padStart(2, '0')}</div>
            <div className="text-sm text-gray-600">View activity</div>
          </div>
        </div>

        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-medium">Schedule</div>
              <div className="text-xs text-gray-500">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
              >
                <span className="text-gray-600">&lt;</span>
              </button>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
              >
                <span className="text-gray-600">&gt;</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs text-gray-500 font-medium py-2">
                {day}
              </div>
            ))}
            {calendarDays.map((day, i) => (
              <div
                key={i}
                className={`aspect-square flex items-center justify-center text-sm ${
                  day === currentDay && isCurrentMonth
                    ? 'bg-purple-accent text-white rounded-full'
                    : day
                    ? 'text-gray-700 hover:bg-gray-100 rounded'
                    : ''
                }`}
              >
                {day}
                {day === 19 || day === 20 ? (
                  <span className="absolute bottom-1 w-1 h-1 bg-purple-accent rounded-full"></span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-serif">Next Spotlight</h3>
            <span className="badge badge-new">LIVE TONIGHT</span>
          </div>
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex flex-col items-center justify-center">
                <div className="text-xs font-bold uppercase">{nextEvent.date.split(' ')[0]}</div>
                <div className="text-xl font-bold">{nextEvent.date.split(' ')[1]}</div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">{nextEvent.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {nextEvent.venue}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {nextEvent.time}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card relative">
          {inquiry.isNew && (
            <span className="absolute top-3 right-3 badge badge-new">NEW</span>
          )}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="text-xs text-gray-500 uppercase">Performance Inquiry</div>
          </div>
          <h4 className="font-bold text-lg mb-2">{inquiry.title}</h4>
          <p className="text-sm text-gray-600 mb-4">{inquiry.description}</p>
          <div className="flex gap-3">
            <button className="btn-primary flex-1">Accept Inquiry</button>
            <button className="btn-outline flex-1">Review Details</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
