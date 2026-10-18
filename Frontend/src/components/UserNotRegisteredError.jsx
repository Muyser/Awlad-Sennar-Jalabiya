const UserNotRegisteredError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-[#1a2c6b]/5 px-4 rtl text-right">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl shadow-[#1a2c6b]/5 border border-[#1a2c6b]/10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-[#f28c28]/10 shadow-lg shadow-[#f28c28]/10">
            <svg className="w-8 h-8 text-[#f28c28]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#1a2c6b] mb-4">الوصول مقيد</h1>
          <p className="text-[#1a2c6b]/70 mb-8 text-sm leading-relaxed">
            أنت لست مسجلاً لاستخدام هذه المنصة. يرجى الاتصال بمسؤول النظام لطلب صلاحيات الوصول.
          </p>
          <div className="p-4 bg-[#1a2c6b]/5 rounded-xl text-sm text-[#1a2c6b]/80 border border-[#1a2c6b]/10">
            <p className="font-semibold mb-2">إذا كنت تعتقد أن هذا خطأ، يمكنك:</p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#1a2c6b]/70">
              <li>التحقق من تسجيل الدخول بالحساب الصحيح</li>
              <li>التواصل مع مسؤول التطبيق للحصول على الصلاحيات</li>
              <li>محاولة تسجيل الخروج ثم تسجيل الدخول مرة أخرى</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;