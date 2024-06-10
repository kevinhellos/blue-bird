import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth/auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./tweets/NewTweet";
import Tweets from "./tweets/Tweets";
import Image from "next/image";

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
          <Image
            src={"/bird.png"}
            alt="Blue bird icon"
            width={24}
            height={24}
          />
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
