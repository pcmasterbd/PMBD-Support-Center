"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/lib/actions/new-verification";
import { Card, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return;
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Something went wrong!");
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader className="flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">Email Verification</h1>

                <div className="flex items-center w-full justify-center">
                    {!success && !error && (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p>Verifying your email...</p>
                        </div>
                    )}
                    {success && (
                        <div className="p-3 bg-emerald-500/15 text-emerald-500 rounded-md flex items-center gap-x-2 text-sm text-center">
                            <p>{success}</p>
                        </div>
                    )}
                    {error && (
                        <div className="p-3 bg-destructive/15 text-destructive rounded-md flex items-center gap-x-2 text-sm text-center">
                            <p>{error}</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center w-full">
                    <Button variant="link" asChild>
                        <Link href="/login">
                            Back to login
                        </Link>
                    </Button>
                </div>
            </CardHeader>
        </Card>
    );
};
