import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GenerateContentPage() {
  return (
    <div className="container py-6 px-4 md:px-6 md:py-8">
      <div className="flex flex-col gap-6 md:gap-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Generate Content</h1>
          <p className="text-gray-500">
            Upload a product image and get AI-generated descriptions and social
            media content
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="order-1">
            <CardHeader>
              <CardTitle>Upload Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-12 flex flex-col items-center justify-center">
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
                    className="h-8 w-8 md:h-10 md:w-10 text-gray-400 mb-3 md:mb-4"
                  >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                  <p className="text-sm text-gray-500 mb-2 text-center">
                    Drag and drop your product image here
                  </p>
                  <p className="text-xs text-gray-400 mb-4 text-center">
                    Supports: JPG, PNG, WEBP (Max 5MB)
                  </p>
                  <Button size="sm">Browse Files</Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="product-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Product Name
                    </label>
                    <input
                      id="product-name"
                      name="product-name"
                      type="text"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                      placeholder="e.g. Ergonomic Office Chair"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    >
                      <option value="">Select a category</option>
                      <option value="fashion">Fashion & Apparel</option>
                      <option value="electronics">Electronics</option>
                      <option value="home">Home & Kitchen</option>
                      <option value="beauty">Beauty & Personal Care</option>
                      <option value="sports">Sports & Outdoors</option>
                      <option value="toys">Toys & Games</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <Button className="w-full">Generate Content</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="order-2">
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500">
                  Upload a product image and fill in the details to generate
                  content
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
