export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a2c6b]/5 px-4 rtl text-right">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1a2c6b] mb-4 shadow-lg shadow-[#1a2c6b]/20">
            <Icon className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a2c6b]">{title}</h1>
          {subtitle && <p className="text-[#1a2c6b]/60 mt-2 text-sm">{subtitle}</p>}
        </div>
        <div className="bg-white rounded-2xl shadow-xl shadow-[#1a2c6b]/5 border border-[#1a2c6b]/10 p-8">
          {children}
        </div>
        {footer && (
          <div className="text-center text-sm text-[#1a2c6b]/70 mt-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}