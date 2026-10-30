const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
      {/* Animated Logo */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg glow-primary animate-pulse">
          <span className="text-2xl">💰</span>
        </div>
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary-500/20 to-violet-600/20 blur-lg animate-pulse" />
      </div>
      {/* Spinner */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}

export default LoadingScreen
