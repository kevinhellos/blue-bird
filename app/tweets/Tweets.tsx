"use client"

import { useEffect, useOptimistic } from "react";
import Likes from "./Likes"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Tweets({ tweets }: {
    tweets: TweetWithAuthor[]
}) {

    const [optimisticTweets, addOptimisticTweet] = 
    useOptimistic<TweetWithAuthor[], TweetWithAuthor>(
        tweets,
        (currentOptimisticTweets, newTweet) => {
            const newOptmisticTweets = [
                ...currentOptimisticTweets
            ];
            const index = newOptmisticTweets.findIndex(tweet => tweet.id === newTweet.id);
            newOptmisticTweets[index] = newTweet;
            return newOptmisticTweets;
        }
    );

    const supabase = createClientComponentClient();
    const router = useRouter();

    useEffect(() => {
        const channel = supabase.channel("realtime tweets").on
        (
            "postgres_changes", {
                event: "*",
                schema: "public",
                table: "tweets",
            }, (payload) => {
                // console.log({ payload });
                router.refresh();
            }
        )
        .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [supabase, router]);

    return optimisticTweets.map(tweet => (
        <div 
            className="border border-gray-800 border-t-0 px-4 py-8 flex hover:bg-gray-800"
            key={tweet.id}>

          <div className="h-12 w-12">
            <Image
                src={tweet.author.avatar_url}
                alt="Tweet user avatar"
                width={48}
                height={48}
                className="rounded-full"
            />
          </div>

          <div className="ml-4">
            <p>
                <span className="font-bold">{tweet.author.name}</span>
                <span className="text-sm ml-2 text-gray-400">
                    @{tweet.author.username}
                </span>
            </p>
            <p>{tweet.title}</p>
            <Likes
                tweet={tweet}
                addOptimisticTweet={addOptimisticTweet}
            />
          </div>
            
        </div>
    ));
}