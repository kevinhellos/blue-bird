"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image";

export default function GithubButton() {

    const handleSignIn = async () => {
        const supabase  = createClientComponentClient<Database>();
        await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: `${location.origin}/auth/callback`
            }
        })
        // console.log("CLicked");
    }

    return(
        <button
            onClick={handleSignIn}
            className="hover:bg-gray-800 p-5 px-8 rounded-xl flex"
        >
            <Image
                src="/github-mark-white.png"
                alt="Github logo"
                width={30}
                height={30}
                className="mr-5"
            />
            <span className="mt-1 text-lg">Continue with Github</span>
        </button>
    )
}