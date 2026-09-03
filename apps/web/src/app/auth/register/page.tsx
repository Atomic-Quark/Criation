import { AuthShowcasePanel } from "@/components/auth/AuthShowcasePanel";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Free Account | Criation Collective",
  description: "Register for free on Criation and receive ₹100 instant wallet credit. Support authentic rural Indian artisans.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-zinc-950 text-white selection:bg-amber-500 overflow-x-hidden">
      <AuthShowcasePanel mode="register" />
      <RegisterForm />
    </div>
  );
}
