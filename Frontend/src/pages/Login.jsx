import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { safeReturnTo } from "@/lib/authReturnTo";
import { toast } from "@/components/ui/use-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }

      // حفظ الـ token في localStorage
      if (data.token || data.access_token) {
        localStorage.setItem("admin_token", data.token || data.access_token);
      }

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك مجدداً في لوحة التحكم.",
      });

      // استخدام useNavigate للانتقال السلس إلى لوحة التحكم أو الصفحة المطلوبة
      const destination = returnTo !== "/" ? returnTo : "/admin";
      navigate(destination, { replace: true });

    } catch (err) {
      setError(err.message || "حدث خطأ ما أثناء الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="مرحباً بعودتك"
      subtitle="سجل الدخول إلى حسابك لمتابعة إدارة المتجر"
      footer={
        <>
          ليس لديك حساب؟{" "}
          <Link
            to={"/register" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "")}
            className="text-[#f28c28] font-medium hover:underline"
          >
            أنشئ حساباً جديداً
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-sm bg-destructive/10 text-destructive text-sm text-right rtl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rtl text-right">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#1a2c6b]">البريد الإلكتروني</Label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a2c6b]/50" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pr-10 pl-4 h-12 border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm text-left dir-ltr"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[#1a2c6b]">كلمة المرور</Label>
            <Link to="/forgot-password" className="text-xs text-[#f28c28] hover:underline font-medium">
              نسيت كلمة المرور؟
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a2c6b]/50" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10 pl-4 h-12 border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] rounded-sm text-left dir-ltr"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium bg-[#1a2c6b] text-[#FFFFFF] hover:bg-[#2a3fae] rounded-sm shadow-sm transition-colors cursor-pointer" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin text-[#f28c28]" />
              جاري تسجيل الدخول...
            </>
          ) : (
            "تسجيل الدخول"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}