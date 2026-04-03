const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
          <div className="text-xs text-gray-500 uppercase">{event.date.split(' ')[0]}</div>
          <div className="text-xl font-bold">{event.date.split(' ')[1]}</div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-lg mb-2">{event.name}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{event.time}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard

