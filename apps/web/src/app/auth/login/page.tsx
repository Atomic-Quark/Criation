import { AuthShowcasePanel } from "@/components/auth/AuthShowcasePanel";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In | Criation Artisan Commerce",
  description: "Sign in to your Criation account to manage orders, wallet balance, and artisan products.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-zinc-950 text-white selection:bg-indigo-500 overflow-x-hidden">
      <AuthShowcasePanel mode="login" />
      <LoginForm />
    </div>
  );
}
