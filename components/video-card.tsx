import { Card, CardContent } from "./ui/card";
import { humanDuration, naturalTime } from "@/lib/utils";

import { Badge } from "./ui/badge";
import { CalendarIcon } from "@radix-ui/react-icons";
import LikeButton from "./like-button";
import Link from "next/link";
import React from "react";
import Thumbnail from "./thumbnail";

const VideoCard = ({ video }: any) => {
    return (
        <Card className="group overflow-hidden border-0 rounded-none md:border md:rounded-lg transition-all duration-300 hover:shadow-lg">
            <div className="relative aspect-video overflow-hidden">
                <Thumbnail
                    single_img={video.single_img}
                    splash_img={video.splash_img}
                    title={video.title}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Badge className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/75">
                    {humanDuration(video.length)}
                </Badge>
            </div>
            
            <CardContent className="p-3">
                <Link
                    href={`/v/${video.file_code}`}
                    className="block line-clamp-2 text-sm font-medium group-hover:text-primary transition-colors"
                >
                    {video.title}
                </Link>
                
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{video.views} views</span>
                    <div className="flex items-center space-x-2">
                        <span>{naturalTime(video.uploaded + ".000Z")}</span>
                        <LikeButton file={video} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default VideoCard;
