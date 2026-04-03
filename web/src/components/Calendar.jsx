import { useState } from 'react'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const month = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()
  const year = currentDate.getFullYear()
  
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const today = new Date().getDate()
  
  // Simple calendar grid - in production, use a proper calendar library
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const days = []
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  
  const hasEvent = (day) => {
    // Mock: days 19 and 20 have events
    return day === 19 || day === 20
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-lg font-serif">Schedule</div>
          <div className="text-sm text-gray-600">{month} {year}</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="text-center text-xs text-gray-500 font-medium py-2">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={idx}></div>
          }
          const isToday = day === today
          const eventDay = hasEvent(day)
          
          return (
            <div
              key={idx}
              className={`text-center py-2 relative ${
                isToday ? 'bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto' : ''
              }`}
            >
              {!isToday && <span className={eventDay ? 'font-semibold' : ''}>{day}</span>}
              {eventDay && !isToday && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"></div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar

