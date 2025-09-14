import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center text-2xl font-medium p-5">
          <Link href="/"> Learuma AI</Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
