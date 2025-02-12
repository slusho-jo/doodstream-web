"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MessageBox from "@/components/message-box";
import VideoCard from "@/components/video-card";

function getLikedVideos() {
    try {
        const likedVideos = Object.entries(localStorage).filter((key) =>
            key[0].startsWith("liked_")
        );
        const sortedLikedVideos = likedVideos.sort((a, b) => {
            const aFile = JSON.parse(a[1] || "{}");
            const bFile = JSON.parse(b[1] || "{}");

            return bFile.liked_on - aFile.liked_on;
        });

        return sortedLikedVideos.map((video) => JSON.parse(video[1]));
    } catch {
        return [];
    }
}

export default function Liked() {
    const [likedVideos, setLikedVideos] = useState<any[]>([]);

    useEffect(() => {
        setLikedVideos(getLikedVideos());
    }, []);

    if (likedVideos.length === 0) {
        return (
            <MessageBox title="No liked videos found" variant="info">
                <p>Like videos to see them here.</p>
            </MessageBox>
        );
    }
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Liked Videos</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {likedVideos.map((file) => (
                    <VideoCard key={file.file_code} video={file} />
                ))}
            </div>
        </div>
    );
}
