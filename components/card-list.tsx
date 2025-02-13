import MessageBox from "./message-box";
import Paginate from "./paginate";
import React, { Suspense } from "react";
import VideoCard from "./video-card";
import doodstream from "@/lib/doodstream";

const CardSkeleton = () => (
    <div className="animate-pulse">
        <div className="bg-gray-200 h-[110px] md:h-[150px] lg:h-[180px] rounded-none md:rounded-t-md"></div>
        <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
);

const CardList = async ({
    page,
    per_page,
    fld_id,
}: {
    page: number;
    per_page: number;
    fld_id: string | undefined;
}) => {
    const data = await doodstream.listFiles({ page, per_page, fld_id });

    if (!data.result.results) {
        return (
            <MessageBox title="No videos found" variant="info">
                <p className="text-center">
                    This Channel doesn&apos;t have any videos yet.
                </p>
            </MessageBox>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-2 gap-0 md:grid-cols-3 md:gap-3 xl:grid-cols-4">
                <Suspense fallback={[...Array(per_page)].map((_, i) => <CardSkeleton key={i} />)}>
                    {data.result.files.map((video: any) => {
                        return (
                            <VideoCard
                                key={video.file_code}
                                video={video}
                            ></VideoCard>
                        );
                    })}
                </Suspense>
            </div>
            <Paginate total={data.result.total_pages} current={page}></Paginate>
        </div>
    );
};

export default CardList;
