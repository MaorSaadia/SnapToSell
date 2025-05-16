"use client";

// Will need to install date-fns: npm install date-fns
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Star, Copy, Clock } from "lucide-react";

interface ContentHistoryItem {
  id: string;
  contentType: string;
  platform?: string | null;
  tone: string;
  createdAt: string;
  generatedContent: string;
  keywords: string[];
  isFavorite?: boolean;
}

interface ContentHistoryListProps {
  history: ContentHistoryItem[];
  onToggleFavorite: (id: string) => void;
}

export default function ContentHistoryList({ 
  history, 
  onToggleFavorite 
}: ContentHistoryListProps) {
  // Handle copying content to clipboard
  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return "Invalid date";
    }
  };

  // Get an icon based on content type (commented out as it's currently unused)
  // Will use this in future enhancements
  /* 
  const getContentTypeIcon = (type: string, platform?: string | null) => {
    if (type === "social" && platform) {
      return platform.charAt(0).toUpperCase();
    }
    return "W";
  };
  */

  if (history.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No content generation history yet.</p>
        <p className="text-sm text-gray-400 mt-2">
          Start generating content to see your history here.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead>Content</TableHead>
            <TableHead className="w-[150px]">Keywords</TableHead>
            <TableHead className="w-[120px]">Generated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col gap-1">
                  <Badge variant="outline" className="w-fit capitalize">
                    {item.contentType}
                  </Badge>
                  {item.platform && (
                    <Badge variant="secondary" className="w-fit capitalize">
                      {item.platform}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="w-fit capitalize">
                    {item.tone}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-h-24 overflow-hidden text-ellipsis">
                  {item.generatedContent.substring(0, 150)}
                  {item.generatedContent.length > 150 ? "..." : ""}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{formatTimestamp(item.createdAt)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleFavorite(item.id)}
                    title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        item.isFavorite ? "fill-yellow-400 text-yellow-400" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyContent(item.generatedContent)}
                    title="Copy content"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
