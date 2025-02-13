import {
    CalendarIcon,
    CubeIcon,
    DownloadIcon,
    LapTimerIcon,
    RocketIcon,
    Share1Icon,
} from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata, ResolvingMetadata } from "next";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { humanDuration, humanSize } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import CopyButton from "@/components/copy-button";
import LikeButton from "@/components/like-button";
import Link from "next/link";
import MessageBox from "@/components/message-box";
import React from "react";
import { SITENAME } from "@/lib/constants";
import SearchCardList from "@/components/search/search-list";
import doodstream from "@/lib/doodstream";

type PageProps = {
    params: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const data = await doodstream.getFile({ file_code: params.id as string });
    if (data.status !== 200) {
        return {
            title: data.msg,
            description: "Something went wrong. Please try again later.",
        };
    }

    const file = data.result[0];
    const title = `${file.title} - ${SITENAME}`;
    const description = `${file.title} - Duration: ${humanDuration(
        file.length
    )} - Views: ${file.views} views - Size: ${humanSize(
        file.size
    )} - Uploaded On ${new Date(file.uploaded + ".000Z").toLocaleString()}`;
    const image = file.splash_img;
    const previousOgImages = (await parent).openGraph?.images || [];
    const previousTwImages = (await parent).twitter?.images || [];

    return {
        title,
        description,
        twitter: {
            title,
            description,
            images: [...previousTwImages, image],
        },
        openGraph: {
            title,
            description,
            images: [...previousOgImages, image],
        },
    };
}

export default async function Video({ params }: PageProps) {
    const data = await doodstream.getFile({ file_code: params.id as string });
    const upstream = await doodstream.getUpstream();

    if (data.status !== 200) {
        return (
            <MessageBox title={data.msg} countdown={30} variant="error">
                <p className="text-center">
                    Something went wrong. Please try again later.
                </p>
            </MessageBox>
        );
    }

    const file = data.result[0];
    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="relative pt-[56.25%]">
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src={`https://${upstream}/${file.protected_embed}`}
                            allowFullScreen
                        />
                    </div>
                    
                    <div className="mt-4">
                        <h1 className="text-2xl font-bold">{file.title}</h1>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-4">
                                <span>{file.views} views</span>
                                <span>•</span>
                                <span>{new Date(file.uploaded + ".000Z").toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <LikeButton file={file} useButton />
                                <CopyButton>Share</CopyButton>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Related Videos</h2>
                    <SearchCardList query={file.title.split(" ")[0]} />
                </div>
            </div>
        </div>
    );
}
