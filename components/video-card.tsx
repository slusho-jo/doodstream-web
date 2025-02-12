import { Card, CardContent } from "./ui/card";
import { humanDuration, naturalTime } from "@/lib/utils";

import { Badge } from "./ui/badge";
import { CalendarIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import LikeButton from "./like-button";
import Link from "next/link";
import React from "react";
import Thumbnail from "./thumbnail";

interface VideoProps {
    file_code: string;
    title: string;
    views: number;
    length: number;
    uploaded: string;
    single_img: string;
    splash_img: string;
}

const VideoCard = ({ video }: { video: VideoProps }) => {
    return (
        <Card className="group overflow-hidden border-0 rounded-lg md:border-[1px] transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <div className="relative overflow-hidden">
                <Thumbnail
                    single_img={video.single_img}
                    splash_img={video.splash_img}
                    title={video.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm">
                    {humanDuration(video.length)}
                </Badge>
            </div>
            <CardContent className="p-3 md:p-4">
                <Link
                    href={`/v/${video.file_code}`}
                    className="line-clamp-2 text-base md:text-lg font-medium hover:text-primary transition-colors duration-200"
                    aria-label={`Watch ${video.title}`}
                >
                    {video.title}
                </Link>
                <div className="flex flex-row justify-between items-center text-xs md:text-sm mt-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <EyeOpenIcon className="w-3 h-3" /> {video.views}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {naturalTime(video.uploaded + ".000Z")}
                        </span>
                        <LikeButton file={video} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Add loading skeleton for VideoCard
const VideoCardSkeleton = () => {
    return (
        <Card className="border-0 rounded-none md:border-[1px] md:rounded-md">
            <div className="relative">
                <div className="w-full h-[110px] md:h-[150px] lg:h-[180px] bg-muted animate-pulse rounded-none md:rounded-t-md" />
            </div>
            <CardContent className="p-1.5">
                <div className="h-4 bg-muted animate-pulse rounded w-3/4 mb-2" />
                <div className="flex justify-between">
                    <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
                </div>
            </CardContent>
        </Card>
    );
};

interface VideoCardErrorProps {
    error: Error;
}

const VideoCardErrorBoundary = ({ error }: VideoCardErrorProps) => {
    return (
        <Card className="border-0 rounded-none md:border-[1px] md:rounded-md p-4">
            <p className="text-destructive text-sm">Failed to load video</p>
        </Card>
    );
};

export { VideoCard, VideoCardSkeleton, VideoCardErrorBoundary };
export default VideoCard;
