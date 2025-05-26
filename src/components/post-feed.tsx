import { useState, useEffect, useRef } from "react";
import type { Post, PostsResponse } from "../types";
import { PostCard } from "./post-card";
import { Button } from "./ui/button";
import { Clock, Flame } from "lucide-react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { useAuth } from "../lib/auth-provider";
import { mockPosts } from "../data/mock-data";
import { PostSkeleton } from "./ui/skeletons"; // Import our new skeleton component
import { LoadingSpinner } from "./ui/skeletons";
import { ErrorDisplay } from "./ui/error-display";

type FilterType = "latest" | "popular";

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<FilterType>("latest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const pageSize = 1; // Increased from 1 to a more practical value
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset page when filter changes
  const handleFilterChange = (newFilter: FilterType) => {
    if (filter !== newFilter) {
      setFilter(newFilter);
      setPage(0); // Reset to first page when changing filters
      setPosts([]); // Clear existing posts to avoid mixing
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Map filter type to API parameters
        const isNew = filter === "latest";
        const isPopular = filter === "popular";

        // Use params object with axiosInstance for cleaner code
        const response = await axiosInstance.get<PostsResponse>("/posts", {
          params: {
            page: page.toString(),
            size: pageSize.toString(),
            isPopular: isPopular.toString(),
            isNew: isNew.toString(),
          },
        });

        const responseData: PostsResponse = response.data;

        // If first page, replace posts. Otherwise, append.
        if (page === 0) {
          setPosts(responseData.posts || []);
        } else {
          setPosts((prev) => [...prev, ...(responseData.posts || [])]);
        }

        // Check if there are more posts to load
        setHasMore(responseData.hasNext);
        setError(null);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(handleApiError(error));

        // Fallback to mock data for development
        if (process.env.NODE_ENV === "development") {
          const filteredPosts = [...mockPosts];

          if (filter === "latest") {
            filteredPosts.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
          } else if (filter === "popular") {
            filteredPosts.sort((a, b) => b.likeCount - a.likeCount);
          }

          setPosts(filteredPosts);
          setError(null); // Clear error if we successfully load mock data
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [filter, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading]);

  const handleRetry = () => {
    setPage(0);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Feed</h2>
        <div className="flex space-x-2">
          <Button
            variant={filter === "latest" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("latest")}
            className="hover:bg-primary/30 transition-all duration-200"
          >
            <Clock className="mr-1 h-4 w-4" />
            Latest
          </Button>
          <Button
            variant={filter === "popular" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("popular")}
            className="hover:bg-primary/30 transition-all duration-200"
          >
            <Flame className="mr-1 h-4 w-4" />
            Popular
          </Button>
        </div>
      </div>

      {error && (
        <ErrorDisplay
          message={error}
          action={{
            label: "Retry",
            onClick: handleRetry,
          }}
        />
      )}

      {isLoading && page === 0 ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {isLoading && page > 0 && (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          )}

          {/* Observer target element - replaces Load More button */}
          {hasMore && <div ref={observerTarget} className="h-8 w-full" />}

          {!isLoading && !hasMore && posts.length > 0 && (
            <p className="text-center text-muted-foreground py-4">
              No more posts to load
            </p>
          )}

          {!isLoading && posts.length === 0 && !error && (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">No posts found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
