import { Avatar } from "@nextui-org/react";
import supabase from "../lib/supabaseClient";
import { Suspense } from "react";
import "tailwindcss/tailwind.css";
import Image from "next/image";

const Home = async () => {
  const { data: content, error } = await supabase.from("content").select("*");
  console.log("data", content);
  if (error) {
    console.error(error);
    return (
      <div className="text-center text-red-500">Failed to load content.</div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 space-y-6 animate-fadeIn">
      <Image
        alt="TRAVLRD Logo"
        width={200}
        height={80}
        src="https://cdn.prod.website-files.com/63217423f3f0f6c53321b537/6321751b0caa32a0eaa5408f_default-monochrome-white.svg"
      />
      <div className="flex flex-wrap gap-8 justify-center">
        {content.map((item) => (
          <div
            key={item.id}
            className="w-80 p-4 flex gap-3 bg-white shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 duration-300 rounded-lg overflow-hidden"
          >
            <Avatar
              className="w-20 h-20 text-large rounded-full"
              src={item.image_url}
              radius="full"
            />
            <div className="flex flex-col gap-2">
              <h4 className="text-md font-semibold">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.short_description}</p>
              <div className="p-2 py-1 text-xs rounded-2xl bg-blue-400 w-max text-white">6 perc</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-8">Loading...</div>}>
      <Home />
    </Suspense>
  );
}
