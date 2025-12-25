import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { teamNewsService, type TeamNewsItem } from "@/shared/services/TeamNewsService";
import { Newspaper, Calendar, ExternalLink, Loader2 } from "lucide-react";

interface TeamNewsProps {
  teamName: string;
  className?: string;
}

const TeamNews: React.FC<TeamNewsProps> = ({ teamName, className = "" }) => {
  const [news, setNews] = useState<TeamNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<TeamNewsItem | null>(null);

  useEffect(() => {
    if (teamName) {
      fetchTeamNews();
    }
  }, [teamName]);

  const fetchTeamNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const newsData = await teamNewsService.fetchTeamNews(teamName);
      setNews(newsData);
    } catch (err) {
      setError("Failed to load team news");
      console.error("Error fetching team news:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!teamName) {
    return null;
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Newspaper className="w-5 h-5 mr-2" />
            {teamName} News
            <Badge variant="outline" className="ml-2 text-xs text-amber-600 border-amber-300">
              Example
            </Badge>
          </CardTitle>
          {news.length > 0 && (
            <Badge variant="secondary">{news.length} articles</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
            <p className="text-gray-500">Loading news...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={fetchTeamNews}
              className="text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Try again
            </button>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-8">
            <Newspaper className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">No news available for {teamName}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* News List */}
            <ScrollArea className="h-80 pr-4">
              <div className="space-y-4">
                {news.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${selectedNews?.id === item.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      }`}
                    onClick={() => setSelectedNews(selectedNews?.id === item.id ? null : item)}
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-sm md:text-base line-clamp-2">{item.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.source}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(item.publishedAt)}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Selected News Details */}
            <AnimatePresence>
              {selectedNews && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg">{selectedNews.title}</h3>
                    <a
                      href={selectedNews.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{selectedNews.source}</span>
                    <span>•</span>
                    <span>{formatDate(selectedNews.publishedAt)}</span>
                  </div>
                  {selectedNews.imageUrl && (
                    <img
                      src={selectedNews.imageUrl}
                      alt={selectedNews.title}
                      className="w-full h-48 object-cover rounded-md my-3"
                    />
                  )}
                  <p className="text-sm md:text-base mt-3">{selectedNews.content}</p>
                  <div className="mt-4">
                    <a
                      href={selectedNews.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      Read full article
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamNews;