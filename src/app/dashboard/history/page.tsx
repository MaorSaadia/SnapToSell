"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

// Mock data for content history
const mockHistory = [
  {
    id: "1",
    date: "2023-06-10T14:30:00Z",
    productName: "Ergonomic Office Chair",
    contentType: "Product Description",
    preview:
      "Elevate your home office with our Ergonomic Desk Chair. Designed with premium materials and adjustable lumbar support...",
  },
  {
    id: "2",
    date: "2023-06-08T09:15:00Z",
    productName: "Wireless Headphones",
    contentType: "Social Media Post",
    preview:
      "🎧 Experience music like never before with our new Wireless Headphones! Crystal clear sound, 24-hour battery life, and...",
  },
  {
    id: "3",
    date: "2023-06-05T16:45:00Z",
    productName: "Smart Watch Pro",
    contentType: "Email Campaign",
    preview:
      "Introducing the Smart Watch Pro - Your personal health assistant. Track your fitness goals, monitor your heart rate...",
  },
];

export default function HistoryPage() {
  const { user } = useAuth();

  console.log(user);

  return (
    <div className="container py-6 px-4 md:px-6 md:py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Content History</h1>
          <p className="text-gray-500">
            View and reuse your previously generated content
          </p>
        </div>

        <div className="space-y-6">
          {mockHistory.length > 0 ? (
            mockHistory.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {item.productName}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {item.contentType}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{item.preview}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="text-xs text-primary hover:text-primary/80 font-medium">
                      View Full Content
                    </button>
                    <span className="text-gray-300">|</span>
                    <button className="text-xs text-primary hover:text-primary/80 font-medium">
                      Regenerate
                    </button>
                    <span className="text-gray-300">|</span>
                    <button className="text-xs text-primary hover:text-primary/80 font-medium">
                      Download
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-gray-500">
                You haven&apos;t generated any content yet. Go to the{" "}
                <a
                  href="/dashboard/generate"
                  className="text-primary hover:text-primary/80"
                >
                  Generate Content
                </a>{" "}
                page to create your first content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
