"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function GenerateContentPage() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [format, setFormat] = useState("standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const generateContent = async () => {
    if (!image) {
      setError("Please upload an image");
      return;
    }

    if (!productName) {
      setError("Please enter a product name");
      return;
    }

    if (!category) {
      setError("Please select a category");
      return;
    }

    setError(null);
    setIsGenerating(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("productName", productName);
    formData.append("category", category);
    formData.append("format", format);

    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      setGeneratedContent(data.description);
    } catch (err) {
      setError("Failed to generate content. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

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
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-12 flex flex-col items-center justify-center"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-auto max-h-[200px] object-contain rounded-md mb-4"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 md:h-10 md:w-10 text-gray-400 mb-3 md:mb-4" />
                      <p className="text-sm text-gray-500 mb-2 text-center">
                        Drag and drop your product image here
                      </p>
                      <p className="text-xs text-gray-400 mb-4 text-center">
                        Supports: JPG, PNG, WEBP (Max 5MB)
                      </p>
                      <div className="relative">
                        <input
                          type="file"
                          id="file-upload"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <label htmlFor="file-upload">
                          <Button size="sm" asChild>
                            <span>Browse Files</span>
                          </Button>
                        </label>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="product-name">Product Name</Label>
                    <input
                      id="product-name"
                      name="product-name"
                      type="text"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                      placeholder="e.g. Ergonomic Office Chair"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
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

                  <div>
                    <Label htmlFor="format">Content Format</Label>
                    <select
                      id="format"
                      name="format"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                    >
                      <option value="standard">Standard Description</option>
                      <option value="bullet">Bullet Points</option>
                      <option value="social">Social Media Copy</option>
                    </select>
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <Button
                    className="w-full"
                    onClick={generateContent}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Content"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="order-2">
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line p-4 border rounded-md bg-gray-50">
                    {generatedContent}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedContent);
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 md:py-12">
                  <p className="text-gray-500">
                    Upload a product image and fill in the details to generate
                    content
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
