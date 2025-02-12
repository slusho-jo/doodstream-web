"use client";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../ui/navigation-menu";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";

import { HamburgerMenuIcon, HeartIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SITENAME } from "@/lib/constants";
import SearchDialog from "../search/search-dialog";
import SearchInput from "../search/search-input";
import { cn } from "@/lib/utils";
import doodstream from "@/lib/doodstream";
import { usePathname } from "next/navigation";

interface FolderType {
    fld_id: string;
    name: string;
    total_files: number;
    code: string;
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
    title: string;
    videoCount: number;
}

const SideNav = ({ folders }: { folders: FolderType[] }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <HamburgerMenuIcon
                    className="size-6"
                    role="menu"
                    aria-label="Open Menu"
                ></HamburgerMenuIcon>
            </SheetTrigger>
            <SheetContent side={"left"}>
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription className="flex flex-row justify-around underline">
                        <Link href="/about" role="menuitem">
                            <SheetClose>About</SheetClose>
                        </Link>
                        <Link href="/liked" role="menuitem">
                            <SheetClose>My Likes</SheetClose>
                        </Link>
                        <Link href="/" role="menuitem">
                            <SheetClose>Home</SheetClose>
                        </Link>
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4 my-4">
                    {folders.map((folder: any) => {
                        return (
                            <Link
                                href={`/c/${folder.fld_id}`}
                                key={folder.code}
                                className="w-full"
                                role="menuitem"
                            >
                                <SheetClose className="flex flex-col transition-colors bg-accent text-accent-foreground px-2 py-1 rounded-md w-full">
                                    <h1 className="text-xl font-semibold">
                                        {folder.name}
                                    </h1>
                                    <span className="text-[0.65rem] uppercase text-muted-foreground">
                                        {folder.total_files} videos
                                    </span>
                                </SheetClose>
                            </Link>
                        );
                    })}
                </div>
            </SheetContent>
        </Sheet>
    );
};

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
    ({ className, title, children, videoCount, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className
                        )}
                        role="menuitem"
                        {...props}
                    >
                        <div className="text-sm font-semibold leading-none">
                            {title}
                        </div>
                        <span className="text-[0.65rem] uppercase text-muted-foreground">
                            {videoCount} videos
                        </span>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    }
);
ListItem.displayName = "ListItem";

const NavMenu = ({ folders }: { folders: FolderType[] }) => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Channels</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[300px] md:grid-cols-2">
                            {folders.map((folder: any) => (
                                <ListItem
                                    key={folder.fld_id}
                                    title={folder.name}
                                    videoCount={folder.total_files}
                                    href={`/c/${folder.fld_id}`}
                                ></ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

const Breadcrumb = () => {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    const [videoTitle, setVideoTitle] = useState<string>("");
    
    // Don't show breadcrumb on home page
    if (pathname === '/') return null;
    
    useEffect(() => {
        const fetchVideoTitle = async (videoId: string) => {
            try {
                const data = await doodstream.getFile({ file_code: videoId });
                if (data.status === 200) {
                    setVideoTitle(data.result[0].title);
                }
            } catch (error) {
                console.error("Error fetching video title:", error);
            }
        };

        // If this is a video page, fetch the title
        if (segments[0] === 'v' && segments[1]) {
            fetchVideoTitle(segments[1]);
        }
    }, [segments]);

    // Custom labels for different routes
    const getLabel = (segment: string, index: number) => {
        switch(segment) {
            case 'v':
                return 'Video';
            case 'c':
                return 'Channel';
            case 'liked':
                return 'Liked Videos';
            default:
                // For video pages, show the title
                if (segments[index - 1] === 'v') {
                    return videoTitle || 'Loading...';
                }
                // For channel IDs, still show shortened ID
                if (segments[index - 1] === 'c') {
                    return segment.substring(0, 8) + '...';
                }
                return segment;
        }
    };

    return (
        <nav aria-label="Breadcrumb" className="py-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
                <Link href="/" className="hover:text-foreground transition-colors">
                    Home
                </Link>
                {segments.map((segment, index) => (
                    <React.Fragment key={segment}>
                        <span className="text-muted-foreground/50">/</span>
                        <span className={cn(
                            "max-w-[300px] truncate",
                            index === segments.length - 1 
                                ? "text-foreground font-medium" 
                                : "hover:text-foreground transition-colors"
                        )}>
                            {getLabel(segment, index)}
                        </span>
                    </React.Fragment>
                ))}
            </div>
        </nav>
    );
};

const NavbarContent = ({ folders }: { folders: FolderType[] }) => {
    return (
        <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-6">
                    <div className="md:hidden">
                        <SideNav folders={folders} />
                    </div>
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tight hover:text-primary transition-colors"
                    >
                        {SITENAME}
                    </Link>
                </div>
                
                <div className="flex flex-1 items-center justify-end gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/liked"
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                            <HeartIcon className="h-4 w-4" />
                            Liked Videos
                        </Link>
                        <NavMenu folders={folders} />
                    </div>
                    <SearchInput className="hidden md:block w-full max-w-sm" />
                    <SearchDialog />
                </div>
            </div>
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <Breadcrumb />
            </div>
        </div>
    );
};

const Navbar = async () => {
    const data = await doodstream.listFolders({ fld_id: "" });
    const folders = data.result.folders;

    return <NavbarContent folders={folders} />;
};

export default Navbar;
