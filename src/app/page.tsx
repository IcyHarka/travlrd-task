import { Card, CardHeader, CardBody } from "@nextui-org/react";
import supabase from "../lib/supabaseClient";
import { Suspense } from "react";
import ImageWithFallback from "./components/ImageWithFallback";
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
          <Card
            key={item.id}
            className="w-80 bg-white shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 duration-300 rounded-lg overflow-hidden"
          >
            <CardHeader className="border-b">
              {item.image_url ? (
                <ImageWithFallback
                  src={item.image_url}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="object-cover w-full h-48"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-48 bg-gray-200">
                  <span className="text-gray-500">No Image Provided</span>
                </div>
              )}
            </CardHeader>
            <CardBody className="p-4">
              <h4 className="text-lg font-bold text-gray-800">{item.title}</h4>
              <p className="text-gray-600 mt-2">{item.short_description}</p>
            </CardBody>
          </Card>
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
