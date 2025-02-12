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
    const description = `${file.title} - Duration: ${humanDuration(file.length)}`;
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
        <div className="grid gap-4 max-w-[1920px] mx-auto">
            <iframe
                className="w-full aspect-video rounded-lg shadow-lg"
                src={`https://${upstream}/${file.protected_embed}`}
                scrolling="no"
                frameBorder={0}
                allowFullScreen={true}
            ></iframe>
            <Card className="border-0 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl md:text-2xl font-bold">
                        {file.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <LapTimerIcon className="size-4" />
                            <span>{humanDuration(file.length)}</span>
                        </div>
                        <div className="flex gap-2">
                            <CopyButton className="bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                                <Share1Icon className="size-4 me-2" />
                                Share
                            </CopyButton>
                            <LikeButton
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600"
                                useButton={true}
                                file={file}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <div className="space-y-4 mt-4">
                <h2 className="text-xl font-semibold">Related Videos</h2>
                <SearchCardList query={file.title.split(" ")[0]} />
            </div>
        </div>
    );
}
