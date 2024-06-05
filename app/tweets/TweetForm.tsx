'use client';

import { useState } from "react";
import Image from "next/image";
import { User } from "@supabase/auth-helpers-nextjs";

export default function TweetForm({ user, addTweet }: { user: User, addTweet: (formData: FormData) => Promise<void> }) {
    const [title, setTitle] = useState("");

    const handleChange = (e: any) => {
        setTitle(e.target.value);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        await addTweet(formData);
        setTitle("");
    };

    return (
        <form onSubmit={handleSubmit} className="border border-gray-800">
            <div className="flex py-8 px-4">
                <div className="h-12 w-12">
                    <Image
                        src={user.user_metadata.avatar_url}
                        alt="User avatar"
                        width={48}
                        height={48}
                        className="rounded-full ml-1"
                    />
                </div>
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                    className="bg-inherit flex-1 ml-3 text-xl leading-loose placeholder-gray-500 px-5 font-light"
                    placeholder="What is happening"
                    required
                />
            </div>
        </form>
    );
}