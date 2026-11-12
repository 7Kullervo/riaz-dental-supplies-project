import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import { ForgotForm } from "@/components/AuthForms";
export default function ForgotPage({ searchParams }: { searchParams: { expired?: string } }) {
  return (
    <AuthCard title="Reset your password" text="Enter your admin email and we will send you a link to choose a new password.">
      {searchParams.expired && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">That reset link is invalid or has expired. Please request a new one.</p>}
      <ForgotForm />
      <p className="mt-4 text-center text-sm"><Link href="/admin/login" className="text-brand hover:underline">Back to sign in</Link></p>
    </AuthCard>
  );
}
