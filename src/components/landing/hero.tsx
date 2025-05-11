import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Turn Product Images into Compelling Content
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                AI-powered content generation for e-commerce. Create product
                descriptions, social media posts, and marketing materials in
                seconds.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                asChild
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center mt-8 lg:mt-0">
            <div className="relative w-full h-[300px] md:h-[350px] lg:h-[500px] overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 p-1">
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-black/90 rounded-lg m-[1px]">
                <div className="p-4 text-center">
                  <div className="mb-4 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-12 w-12 mx-auto"
                    >
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Product Image</h3>
                  <div className="mt-6 p-4 border border-dashed rounded-lg">
                    <p className="text-sm text-gray-500">
                      AI-Generated Content:
                    </p>
                    <p className="mt-2 text-left text-sm md:text-base">
                      &ldquo;Elevate your home office with our Ergonomic Desk
                      Chair. Designed with premium materials and adjustable
                      lumbar support, this chair provides all-day comfort for
                      peak productivity.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
