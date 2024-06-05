import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";
// import AuthButtonClient from "../auth/auth-button-client";
import GithubButton from "./github-button";

export const dynamic = "force-dynamic";

export default async function Login() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { 
        data: {session}
    } = await supabase.auth.getSession();

    if (session) {
        redirect("/");
    }

    return (
        // <AuthButtonClient session={session}/>
        <div className="flex-1 flex justify-center items-center">
            <GithubButton/>
        </div>
    )
}