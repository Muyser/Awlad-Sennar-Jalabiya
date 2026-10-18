import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { toast } from "@/components/ui/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل إرسال طلب إعادة تعيين كلمة المرور");
      }

      setSent(true);
      toast({
        title: "تم الإرسال بنجاح",
        description: "تحقق من بريدك الإلكتروني للحصول على رابط إعادة التعيين.",
      });
    } catch (err) {
      setError(err.message || "حدث خطأ ما أثناء الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="نسيت كلمة المرور"
      subtitle="سنرسل لك رابطاً لإعادة تعيينها"
      footer={
        <Link to="/login" className="text-[#f28c28] font-medium hover:underline inline-flex items-center">
          <ArrowLeft className="w-4 h-4 ml-1" /> العودة لتسجيل الدخول
        </Link>
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-600 text-sm text-right rtl border border-red-500/20">
          {error}
        </div>
      )}

      {sent ? (
        <p className="text-sm text-[#1a2c6b]/80 text-center rtl">
          إذا كان هناك حساب مرتبط بهذا البريد الإلكتروني، ستتلقى رابطاً لإعادة تعيين كلمة المرور خلال لحظات.
        </p>
      ) : (
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
                className="pr-10 pl-4 h-12 border-[#1a2c6b]/15 text-[#1a2c6b] focus:border-[#f28c28] focus:ring-[#f28c28] rounded-xl text-left dir-ltr"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-12 font-medium bg-[#1a2c6b] text-white hover:bg-[#1a2c6b]/90 rounded-xl shadow-md transition-colors" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin text-[#f28c28]" />
                جاري الإرسال...
              </>
            ) : (
              "إرسال رابط الإعادة"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}