import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth/auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./tweets/NewTweet";
import Tweets from "./tweets/Tweets";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id)")
    .order("created_at", { ascending: false });
    ;

  const tweets = 
    data?.map((tweet) => ({
    ...tweet,
    author: Array.isArray(tweet.author) ? tweet.author[0]: tweet.author,
    user_has_liked_tweet: !!tweet.likes.find(
      (like) => like.user_id === session.user.id
    ),
    likes: tweet.likes.length,
  })) ?? [];

  return (
    <div className="w-full max-w-xl mx-auto mt-1">
      <div className="flex justify-between py-4 px-6 border-gray-800 border-t-0">
        <h1 className="text-2xl font-semibold flex">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mt-1 mr-3">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
          </svg>
          Bluebird
        </h1>
        <AuthButtonServer />
      </div>

      <NewTweet
        user={session.user}
      />
      <Tweets
        tweets={tweets}
      />
    </div>
  );
}