export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen hero-gradient noise-overlay flex items-center justify-center p-4 relative">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-wine-700/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-gold-500/8 blur-[100px]" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
