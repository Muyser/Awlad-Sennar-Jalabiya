import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";

export default function AdminRoute() {
  const { isAuthenticated, isLoadingAuth, authChecked, authError, user } = useAuth();

  // التحقق من وجود التوكن أو الحساب التجريبي
  const hasToken = !!localStorage.getItem("admin_token");
  const isMockAdmin = localStorage.getItem("muyser_admin_logged") === "true";

  if (isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#FFFFFF]">
        <div className="w-8 h-8 border-4 border-[#1a2c6b]/15 border-t-[#f28c28] rounded-full animate-spin" />
      </div>
    );
  }

  if (authError?.type === "user_not_registered") return <UserNotRegisteredError />;
  
  // إذا لم يكن هناك توكن ولا حساب تجريبي، يتم توجيهه إلى صفحة تسجيل الدخول
  if (!isAuthenticated && !hasToken && !isMockAdmin) {
    return <Navigate to="/login" replace />;
  }

  // السماح بالدخول إذا كان يملك توكن أو إذا كان الـ role يساوى admin
  const isAuthorized = isMockAdmin || hasToken || (user && user.role === "admin") || user;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] text-center p-6">
        <div>
          <span className="text-[#f28c28] text-3xl">◆</span>
          <h1 className="font-heading text-2xl font-bold text-[#1a2c6b] mt-3">صلاحية الإدارة مطلوبة</h1>
          <p className="text-[#1a2c6b]/60 mt-2 max-w-sm">هذا الحساب لا يملك صلاحية الوصول لوحة التحكم الخاصة بـ "أولاد سنار جلابية".</p>
          <a href="/" className="inline-block mt-5 text-sm font-medium text-[#f28c28] hover:underline">العودة للرئيسية ←</a>
        </div>
      </div>
    );
  }

  return <Outlet />;
}