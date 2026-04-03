const RevenueCard = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-100 rounded-full -ml-10 -mb-10 opacity-50"></div>
      <div className="absolute bottom-0 left-4 w-16 h-16 bg-purple-200 rounded-full -ml-8 -mb-8 opacity-50"></div>
      <div className="absolute bottom-0 left-8 w-12 h-12 bg-purple-300 rounded-full -ml-6 -mb-6 opacity-50"></div>
      
      <div className="relative z-10">
        <div className="text-xs uppercase text-gray-500 mb-2">Gross Revenue</div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-bold">$42.8k</span>
          <span className="text-green-600 font-semibold">+12%</span>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4">
        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
    </div>
  )
}

export default RevenueCard

