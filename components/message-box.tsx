"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import React, { ReactNode } from "react";

import Center from "./layouts/center";
import { InfoIcon } from "./icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const MessageBox = ({
    title,
    children,
    variant,
    countdown,
}: {
    title: string;
    children?: ReactNode;
    variant?: "error" | "info";
    countdown?: number;
}) => {
    const router = useRouter();
    const color = variant === "error" ? "text-red-500" : "text-blue-500";
    const [count, setCount] = React.useState(countdown || 0);

    React.useEffect(() => {
        if (countdown) {
            const timer = setTimeout(() => {
                count > 0 && setCount(count - 1);
            }, 1000);

            if (count === 0) {
                router.push("/");
            }
            return () => clearTimeout(timer);
        }
    }, [count, countdown, router]);

    return (
        <Center>
            <Card className="w-full max-w-lg border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex flex-col items-center gap-4 text-2xl">
                        <InfoIcon className={cn("h-12 w-12", color)} />
                        <span className="text-center">{title}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                    {children}
                </CardContent>
                {countdown && (
                    <CardFooter className="flex justify-center">
                        <p className="text-xs text-muted-foreground/60 tracking-wider">
                            Redirecting to home in {count} seconds
                        </p>
                    </CardFooter>
                )}
            </Card>
        </Center>
    );
};

export default MessageBox;
