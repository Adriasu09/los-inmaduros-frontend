import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary hover:bg-sky-500",
          },
        }}
      />
    </div>
  );
}
