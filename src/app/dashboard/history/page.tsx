"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Repeat, Eye, Calendar } from "lucide-react";

// Content history type
type ContentHistoryItem = {
  id: string;
  userId: string;
  productName: string;
  contentType: string;
  platform?: string | null;
  tone: string;
  content: string;
  imageBase64?: string | null;
  textPrompt?: string | null;
  generatedAt: string;
  keywords: string[];
};

// Map content type to display text and icon
const contentTypeMap: Record<string, { label: string, color: string }> = {
  website: { label: "Product Description", color: "bg-blue-100 text-blue-800" },
  social: { label: "Social Media Post", color: "bg-purple-100 text-purple-800" },
  video: { label: "Video Script", color: "bg-amber-100 text-amber-800" }
};

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ContentHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ContentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentHistoryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/history");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch content history");
        }
        
        const data = await response.json();
        setHistory(data.contentHistory);
        setFilteredHistory(data.contentHistory);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(history.filter(item => item.contentType === activeFilter));
    }
  }, [activeFilter, history]);

  const handleViewContent = (item: ContentHistoryItem) => {
    setSelectedContent(item);
    setDialogOpen(true);
  };

  const handleDownload = (item: ContentHistoryItem) => {
    const element = document.createElement("a");
    const file = new Blob([item.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${item.productName.replace(/\s+/g, "-").toLowerCase()}-${new Date(item.generatedAt).toISOString().split("T")[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRegenerate = (item: ContentHistoryItem) => {
    window.location.href = `/dashboard/generate?regenerate=${item.id}`;
  };

  // Get a preview of the content (first 100 characters)
  const getContentPreview = (content: string) => {
    return content.length > 100 ? `${content.substring(0, 100)}...` : content;
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const renderSkeleton = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="mb-6">
        <div className="flex gap-4">
          <Skeleton className="h-32 w-32 rounded-md flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    ));
  };

  // Simple function to convert content to markdown for display
  const contentToMarkdown = (content: string) => {
    return content
      .split("\n\n")
      .map(paragraph => `<p>${paragraph}</p>`)
      .join("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar for mobile */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="sm" className="fixed left-4 top-4 z-40">
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <ProductSidebar 
            history={history} 
            onSelect={handleViewContent} 
            selected={selectedContent?.id} 
          />
        </SheetContent>
      </Sheet>

      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-64 border-r bg-white">
        <ProductSidebar 
          history={history} 
          onSelect={handleViewContent} 
          selected={selectedContent?.id} 
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-6 px-4 md:px-6 md:py-8 max-w-6xl mx-auto">
          <div className="flex flex-col gap-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Content History</h1>
                <p className="text-gray-500">
                  Browse, view and reuse your previously generated content
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = '/dashboard/generate'}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Generate New Content
              </Button>
            </header>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Tabs for filtering */}
            <Tabs 
              defaultValue="all" 
              value={activeFilter}
              onValueChange={setActiveFilter}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="all">All Content</TabsTrigger>
                <TabsTrigger value="website">Product Descriptions</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="video">Video Scripts</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeFilter} className="mt-0">
                {loading ? (
                  renderSkeleton()
                ) : filteredHistory.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {filteredHistory.map((item) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {/* Image section */}
                            {item.imageBase64 ? (
                              <div className="relative h-48 md:h-auto md:w-48 bg-gray-100 flex-shrink-0">
                                <Image 
                                  src={item.imageBase64} 
                                  alt={item.productName || 'Product image'}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="hidden md:flex h-auto w-48 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 items-center justify-center">
                                <span className="text-gray-400 text-xs">No image</span>
                              </div>
                            )}
                            
                            {/* Content section */}
                            <div className="flex-1 p-5">
                              <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-3">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900">{item.productName}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full ${contentTypeMap[item.contentType]?.color || "bg-gray-100 text-gray-800"}`}>
                                      {contentTypeMap[item.contentType]?.label || item.contentType}
                                    </span>
                                    {item.platform && (
                                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                        {item.platform}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(item.generatedAt)}
                                </div>
                              </div>
                              
                              <div className="prose prose-sm max-w-none mb-4">
                                <div className="line-clamp-3 text-gray-600">
                                  {getContentPreview(item.content)}
                                </div>
                              </div>
                              
                              {item.keywords && item.keywords.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {item.keywords.slice(0, 5).map((keyword, idx) => (
                                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                      #{keyword}
                                    </span>
                                  ))}
                                  {item.keywords.length > 5 && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                      +{item.keywords.length - 5} more
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex gap-4 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                  onClick={() => handleViewContent(item)}
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1 text-green-600 hover:text-green-800"
                                  onClick={() => handleRegenerate(item)}
                                >
                                  <Repeat className="h-4 w-4" />
                                  Regenerate
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                                  onClick={() => handleDownload(item)}
                                >
                                  <Download className="h-4 w-4" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border rounded-lg bg-white">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      You haven&apos;t generated any content of this type yet. Head over to the{" "}
                      <a
                        href="/dashboard/generate"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Generate Content
                      </a>{" "}
                      page to create your first content.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Content view dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedContent?.productName}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <div className="flex flex-wrap justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {selectedContent && (
                  <span className={`text-xs px-2 py-1 rounded-full ${contentTypeMap[selectedContent.contentType]?.color || "bg-gray-100 text-gray-800"}`}>
                    {contentTypeMap[selectedContent.contentType]?.label || selectedContent.contentType}
                  </span>
                )}
                {selectedContent?.platform && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {selectedContent.platform}
                  </span>
                )}
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {selectedContent?.tone}
                </span>
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {selectedContent && formatDate(selectedContent.generatedAt)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Image column */}
              {selectedContent?.imageBase64 && (
                <div className="md:col-span-1">
                  <div className="sticky top-4">
                    <div className="relative h-64 w-full bg-gray-100 rounded-md overflow-hidden">
                      <Image 
                        src={selectedContent.imageBase64} 
                        alt={selectedContent.productName || 'Product image'}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    {selectedContent.textPrompt && (
                      <div className="mt-4 text-sm">
                        <p className="font-medium mb-1">Original Prompt:</p>
                        <p className="text-gray-600 italic">{selectedContent.textPrompt}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Content column */}
              <div className={`${selectedContent?.imageBase64 ? 'md:col-span-2' : 'md:col-span-3'}`}>
                <ScrollArea className="h-[50vh] rounded-md border">
                  <div className="p-6">
                    <div 
                      className="prose max-w-none" 
                      dangerouslySetInnerHTML={{ 
                        __html: selectedContent ? contentToMarkdown(selectedContent.content) : '' 
                      }} 
                    />
                  </div>
                </ScrollArea>

                {selectedContent?.keywords && selectedContent.keywords.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedContent.keywords.map((keyword, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => selectedContent && handleRegenerate(selectedContent)}
                  >
                    <Repeat className="h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button
                    className="flex items-center gap-1"
                    onClick={() => selectedContent && handleDownload(selectedContent)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Product Sidebar Component
function ProductSidebar({ 
  history, 
  onSelect, 
  selected 
}: { 
  history: ContentHistoryItem[], 
  onSelect: (item: ContentHistoryItem) => void,
  selected: string | undefined
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredItems = searchTerm 
    ? history.filter(item => 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : history;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Products</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-md border border-gray-300 py-2 pl-3 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div 
                key={item.id}
                className={`mb-2 p-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 ${
                  selected === item.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100'
                }`}
                onClick={() => onSelect(item)}
              >
                {item.imageBase64 ? (
                  <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0">
                    <Image 
                      src={item.imageBase64} 
                      alt={item.productName} 
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded bg-gray-200 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-gray-500">No img</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500">
                    {contentTypeMap[item.contentType]?.label || item.contentType}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              {searchTerm ? "No products found" : "No products yet"}
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}