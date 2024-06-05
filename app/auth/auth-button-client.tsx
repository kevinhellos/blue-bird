"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function AuthButtonClient( { session } : { session : Session | null} ){
    const supabase = createClientComponentClient();
    const router = useRouter();

    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: `${location.origin}/auth/callback`
            }
        })
        // console.log("CLicked");
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    }

    return session ? (
        <button className="text-md text-gray-400 hover:text-gray-100" onClick={handleSignOut}>Logout</button>
    ) : (
        <button className="text-md text-gray-4000 hover:text-gray-100" onClick={handleSignIn}>Login</button>
    )
}