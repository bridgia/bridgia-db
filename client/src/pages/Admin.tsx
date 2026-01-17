import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Mail, LogOut, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.admin.login.useMutation();
  const submissionQuery = trpc.admin.getSubmissions.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginMutation.mutateAsync({ password });
      setIsLoggedIn(true);
      setPassword("");
      toast.success("تم تسجيل الدخول بنجاح");
    } catch (error) {
      toast.error("كلمة المرور غير صحيحة");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword("");
    toast.success("تم تسجيل الخروج");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f3f8] to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-[#e8e3f0]">
            <div className="flex items-center justify-center mb-6">
              <img src="/bridgia-logo.png" alt="Bridgia" className="h-12 w-auto" />
            </div>

            <h1 className="text-2xl font-bold text-center text-[#1a1a1a] mb-2">
              لوحة التحكم
            </h1>
            <p className="text-center text-[#666666] mb-8">
              أدخل كلمة المرور للوصول إلى الرسائل
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="أدخل كلمة المرور"
                    className="w-full px-4 py-2 border border-[#d1cbe5] rounded-lg bg-white text-[#1a1a1a] focus:outline-none focus:border-[#774f9f] focus:ring-1 focus:ring-[#774f9f] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#774f9f]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full bg-[#774f9f] text-white py-2 rounded-lg font-medium hover:bg-[#6a4a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                {isLoading ? "جاري التحقق..." : "دخول"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const submissions = submissionQuery.data || [];

  return (
    <div className="min-h-screen bg-[#f5f3f8]">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#e8e3f0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src="/bridgia-logo.png" alt="Bridgia" className="h-10 w-auto" />
            <h1 className="text-xl font-bold text-[#1a1a1a]">لوحة التحكم</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-[#666666] hover:text-[#774f9f] hover:bg-[#f5f3f8] rounded-lg transition-colors"
          >
            <LogOut size={18} />
            خروج
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">الرسائل الواردة</h2>
          <p className="text-[#666666]">
            إجمالي الرسائل: <span className="font-bold text-[#774f9f]">{submissions.length}</span>
          </p>
        </div>

        {submissionQuery.isLoading ? (
          <div className="text-center py-12">
            <p className="text-[#666666]">جاري تحميل الرسائل...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e8e3f0] p-12 text-center">
            <Mail className="mx-auto mb-4 text-[#d1cbe5]" size={48} />
            <p className="text-[#666666]">لا توجد رسائل حتى الآن</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white rounded-lg border border-[#e8e3f0] p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1a1a1a]">{submission.name}</h3>
                    <p className="text-sm text-[#666666]">
                      {new Date(submission.createdAt).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {submission.company && (
                    <span className="px-3 py-1 bg-[#f5f3f8] text-[#774f9f] text-sm rounded-full">
                      {submission.company}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm text-[#666666] mb-2">البريد الإلكتروني:</p>
                  <a
                    href={`mailto:${submission.email}`}
                    className="text-[#774f9f] hover:text-[#6a4a8a] break-all"
                  >
                    {submission.email}
                  </a>
                </div>

                <div className="bg-[#f5f3f8] rounded-lg p-4">
                  <p className="text-sm text-[#666666] mb-2">الرسالة:</p>
                  <p className="text-[#1a1a1a] whitespace-pre-wrap">{submission.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
