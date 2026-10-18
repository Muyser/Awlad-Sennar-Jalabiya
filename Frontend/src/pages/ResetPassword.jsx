import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, AlertTriangle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { toast } from "@/components/ui/use-toast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل إعادة تعيين كلمة المرور");
      }

      toast({
        title: "تمت العملية بنجاح",
        description: "تم تحديث كلمة المرور، يمكنك تسجيل الدخول الآن.",
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "حدث خطأ ما أثناء الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        title="رابط إعادة تعيين غير صالح"
        subtitle="رابط إعادة تعيين كلمة المرور هذا مفقود أو غير صالح"
        footer={
          <Link to="/forgot-password" className="text-[#f28c28] font-medium hover:underline">
            اطلب رابطاً جديداً
          </Link>
        }
      >
        <p className="text-sm text-[#1a2c6b]/70 text-center rtl">
          الرابط الذي استخدمته يبدو غير مكتمل. يرجى طلب بريد إلكتروني جديد لإعادة تعيين كلمة المرور.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Lock}
      title="كلمة مرور جديدة"
      subtitle="أدخل كلمة المرور الجديدة أدناه"
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-600 text-sm text-right rtl border border-red-500/20">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 rtl text-right">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#1a2c6b]">كلمة المرور الجديدة</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a2c6b]/50" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pr-10 pl-4 h-12 border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] focus:ring-[#f28c28] rounded-xl text-left dir-ltr"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm" className="text-[#1a2c6b]">تأكيد كلمة المرور</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a2c6b]/50" aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-10 pl-4 h-12 border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] focus:ring-[#f28c28] rounded-xl text-left dir-ltr"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium bg-[#1a2c6b] text-white hover:bg-[#1a2c6b]/90 rounded-xl shadow-md transition-colors" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin text-[#f28c28]" />
              جاري التحديث...
            </>
          ) : (
            "إعادة تعيين كلمة المرور"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}