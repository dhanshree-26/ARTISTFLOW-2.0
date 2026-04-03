const ActiveCard = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="text-xs uppercase text-gray-500 mb-2">Active</div>
      <div className="text-4xl font-bold mb-2">07</div>
      <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
        View activity →
      </button>
    </div>
  )
}

export default ActiveCard

