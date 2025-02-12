"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "../ui/input";
import React from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
    className?: string;
}

const SearchInput = ({ className }: SearchInputProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = React.useState(searchParams.get("q") || "");
    const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = e.target.value.trim();
        if (search === newSearch) return;

        setSearch(newSearch);

        if (timer) {
            clearTimeout(timer);
        }
        setTimer(
            setTimeout(() => {
                executeSearch(newSearch);
            }, 500)
        );
    };

    const executeSearch = (query: string) => {
        const params = new URLSearchParams();
        params.set("q", query);
        router.push("/?" + params.toString());
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        executeSearch(search);
    };

    return (
        <form onSubmit={onSubmit} role="search">
            <label htmlFor="search" className="sr-only">
                Search videos
            </label>
            <Input
                id="search"
                type="search"
                placeholder="Search videos..."
                aria-label="Search videos"
                className={cn("w-full", className)}
                onChange={onChange}
                defaultValue={search}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
            />
        </form>
    );
};

export default SearchInput;
