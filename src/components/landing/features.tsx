import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Features() {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Transform Your E-Commerce Content
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our AI-powered platform helps you create compelling product
              descriptions, engaging social media content, and effective
              marketing materials in seconds.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Product Descriptions</CardTitle>
              <CardDescription>
                Generate SEO-friendly product descriptions from images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
                <div className="space-y-2 text-center">
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
                    className="h-10 w-10 mx-auto text-gray-500"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                  <p className="text-sm">
                    Upload a product image and get an SEO-optimized description
                    instantly
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Social Media Content</CardTitle>
              <CardDescription>
                Create platform-specific social posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
                <div className="space-y-2 text-center">
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
                    className="h-10 w-10 mx-auto text-gray-500"
                  >
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                  <p className="text-sm">
                    Generate tailored content for Instagram, Facebook, TikTok,
                    and more
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Marketing Materials</CardTitle>
              <CardDescription>
                Create email campaigns and ad copy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[180px] items-center justify-center rounded-md border border-dashed p-4">
                <div className="space-y-2 text-center">
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
                    className="h-10 w-10 mx-auto text-gray-500"
                  >
                    <rect width="16" height="13" x="4" y="5" rx="2" />
                    <path d="m22 5-10 8L2 5" />
                    <path d="M4 19h16" />
                    <path d="M18 13v6" />
                    <path d="M6 13v6" />
                  </svg>
                  <p className="text-sm">
                    Develop compelling email campaigns and ad copy that converts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
