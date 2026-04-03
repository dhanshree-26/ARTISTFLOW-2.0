const SlotItem = ({ slot }) => {
  if (slot.status === 'empty') {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="text-xs text-gray-500 uppercase mb-3">
          Slot {String(slot.slotNumber).padStart(2, '0')} • {slot.type}
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-sm text-gray-600">Assign an Artist</span>
        </div>
      </div>
    )
  }

  const statusColors = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase mb-1">
              Slot {String(slot.slotNumber).padStart(2, '0')} • {slot.type}
            </div>
            <div className="font-semibold text-lg mb-1">{slot.artist.name}</div>
            <div className="text-sm text-gray-600">{slot.artist.genre}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[slot.status]}`}>
            {slot.status.toUpperCase()}
          </span>
          <button className="p-2 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SlotItem

