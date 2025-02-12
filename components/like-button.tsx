"use client";

import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LikeButtonProps {
    className?: string;
    useButton?: boolean;
    file: {
        file_code: string;
        filecode?: string;
        title: string;
        [key: string]: any;
    };
}

interface IconButtonProps {
    className?: string;
    liked: boolean;
    onLike: () => void;
}

const LButton = ({ className, liked, onLike }: any) => {
    return (
        <Button
            className={cn(
                className,
                liked
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-secondary hover:bg-secondary"
            )}
            onClick={onLike}
        >
            {liked ? (
                <HeartFilledIcon className="size-4 mr-1 mb-0.5"></HeartFilledIcon>
            ) : (
                <HeartIcon className="size-4 mr-1 mb-0.5"></HeartIcon>
            )}
            {liked ? "Liked" : "Like"}
        </Button>
    );
};

const LIcon = ({ className, liked, onLike }: IconButtonProps) => {
    return (
        <div className={cn(className, "cursor-pointer")} onClick={onLike}>
            {liked ? (
                <HeartFilledIcon className="size-3.5 mb-0.5 text-red-500"></HeartFilledIcon>
            ) : (
                <HeartIcon className="size-3.5 mb-0.5"></HeartIcon>
            )}
        </div>
    );
};

const LikeButton = ({ className, useButton = false, file }: LikeButtonProps) => {
    const file_code = file.file_code || file.filecode;
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("liked_" + file_code)) {
            setLiked(true);
        }
    }, [file_code]);

    const onLike = () => {
        if (liked) {
            localStorage.removeItem("liked_" + file_code);

            toast.success(file.title + " removed from liked videos", {
                className: "!bg-red-500 !border-0",
            });

            setLiked(false);
        } else {
            const searializedFile = JSON.stringify({
                liked_on: Date.now(),
                ...file,
                file_code, // Moved after spread to avoid overwrite
            });
            localStorage.setItem("liked_" + file_code, searializedFile);

            toast.success(file.title + " added to liked videos", {
                className: "!bg-green-500 !border-0",
            });

            setLiked(true);
        }
    };

    if (useButton) {
        return (
            <Button
                variant={liked ? "default" : "ghost"}
                size="sm"
                className={cn(
                    "group transition-all duration-200",
                    liked && "bg-red-500 hover:bg-red-600",
                    className
                )}
                onClick={onLike}
            >
                {liked ? (
                    <HeartFilledIcon className="size-4 mr-1 group-hover:scale-110 transition-transform" />
                ) : (
                    <HeartIcon className="size-4 mr-1 group-hover:scale-110 transition-transform" />
                )}
                <span className="sr-only">{liked ? "Unlike" : "Like"} video</span>
            </Button>
        );
    }

    return <LIcon className={className} liked={liked} onLike={onLike}></LIcon>;
};

export default LikeButton;
