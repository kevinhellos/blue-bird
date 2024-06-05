import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
// import Image from "next/image";
import TweetForm from "./TweetForm";

export const dynamic = "force-dynamic";

export default function NewTweet({ user }: {user: User}) {

    const addTweet = async (formData: FormData) => {
        "use server";
        const title = String(formData.get("title"));
        const supabase = createServerActionClient<Database>({ cookies });
        // const { data: { user } } = await supabase.auth.getUser();

        // if (user) {
            await supabase
            .from("tweets")
            .insert({ title, user_id: user.id });
            revalidatePath("/");
        // }
        // console.log("Form submitted...");
    }

    return (
        // <form action={addTweet} className="border border-gray-800">
        //     <div className="flex py-8 px-4">
        //         <div 
        //             className= "h-12 w-12">
        //             <Image
        //                 src={user.user_metadata.avatar_url}
        //                 alt="User avatar"
        //                 width={48}
        //                 height={48}
        //                 className="rounded-full"
        //             />
        //         </div>
        //         <input 
        //             type="text" 
        //             name="title" 
        //             className=
        //             "bg-inherit flex-1 ml-3 text-xl leading-loose placeholder-gray-500 px-5 font-light" 
        //             placeholder="What is happening"
        //             required
        //         />
        //     </div>
        // </form>
        <TweetForm
            user={user} 
            addTweet={addTweet}
        />
    )
};