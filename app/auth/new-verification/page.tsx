import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Suspense } from "react";

const NewVerificationPage = () => {
    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 min-h-screen">
            <Suspense>
                <NewVerificationForm />
            </Suspense>
        </div>
    );
};

export default NewVerificationPage;
