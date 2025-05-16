"use client";

// Will need to install date-fns: npm install date-fns
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Trash, Star } from "lucide-react";

interface FavoriteItem {
  id: string;
  contentGenerationId: string;
  contentType: string;
  platform?: string | null;
  tone?: string;
  createdAt: string;
  generatedContent: string;
  keywords: string[];
  notes?: string;
}

interface FavoritesListProps {
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
}

export default function FavoritesList({
  favorites,
  onRemoveFavorite
}: FavoritesListProps) {
  // Handle copying content to clipboard
  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (_error) {
      return "Invalid date";
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No saved content yet.</p>
        <p className="text-sm text-gray-400 mt-2">
          Add items to favorites from your content history to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {favorites.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Header with meta information */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="capitalize">
                      {item.contentType}
                    </Badge>
                    {item.platform && (
                      <Badge variant="secondary" className="capitalize">
                        {item.platform}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Saved {formatTimestamp(item.createdAt)}
                </p>
              </div>

              {/* Content */}
              <div>
                <div className="text-sm text-gray-800 whitespace-pre-wrap">
                  {item.generatedContent}
                </div>
              </div>

              {/* Notes if available */}
              {item.notes && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500">Notes:</p>
                  <p className="text-sm text-gray-700 mt-1">{item.notes}</p>
                </div>
              )}

              {/* Keywords */}
              {item.keywords && item.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyContent(item.generatedContent)}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFavorite(item.id)}
                  className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
