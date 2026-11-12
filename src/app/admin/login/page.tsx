import AuthCard from "@/components/AuthCard";
import { LoginForm } from "@/components/AuthForms";
export default function LoginPage() {
  return <AuthCard title="Admin sign in" text="Authorised staff only."><LoginForm /></AuthCard>;
}
