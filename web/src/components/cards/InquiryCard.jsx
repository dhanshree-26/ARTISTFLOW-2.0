const InquiryCard = ({ inquiry }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs uppercase text-gray-500 font-medium">Performance Inquiry</span>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">NEW</span>
      </div>
      <h4 className="font-semibold text-lg mb-2">{inquiry.title}</h4>
      <p className="text-sm text-gray-600 mb-4">{inquiry.description}</p>
      <div className="flex gap-3">
        <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition">
          Accept Inquiry
        </button>
        <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
          Review Details
        </button>
      </div>
    </div>
  )
}

export default InquiryCard

