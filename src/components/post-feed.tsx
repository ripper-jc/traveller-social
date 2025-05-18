import { useState, useEffect } from "react";
import type { Post, PostsResponse } from "../types";
import { PostCard } from "./post-card";
import { Button } from "./ui/button";
import { Clock, Flame } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import axiosInstance from "@/lib/axios";
import { useAuth } from "../lib/auth-provider";

// Mock data for posts
const mockPosts: Post[] = [
  {
    id: "1",
    userId: "1",
    text: "Just arrived in Bali! The beaches here are absolutely stunning. Can't wait to explore more of this paradise island.",
    imageUrls: ["https://via.placeholder.com/800x500"],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    username: "John Traveler",
    profileImageUrl: "https://via.placeholder.com/100",
    likeCount: 24,
    commentCount: 5,
    likedByCurrentUser: false,
  },
  {
    id: "2",
    userId: "2",
    text: "Hiking through the Swiss Alps was an incredible experience. The views were breathtaking at every turn. Highly recommend for any nature lovers!",
    imageUrls: ["https://via.placeholder.com/800x500"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    username: "Sarah Explorer",
    profileImageUrl: "https://via.placeholder.com/100",
    likeCount: 87,
    commentCount: 12,
    likedByCurrentUser: true,
  },
  {
    id: "3",
    userId: "3",
    text: "The street food in Bangkok is out of this world! So many flavors and everything is so affordable. My taste buds are in heaven.",
    imageUrls: ["https://via.placeholder.com/800x500"],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    username: "Mike Foodie",
    profileImageUrl: "https://via.placeholder.com/100",
    likeCount: 56,
    commentCount: 8,
    likedByCurrentUser: false,
  },
];

type FilterType = "latest" | "popular";

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<FilterType>("latest");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const pageSize = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Map filter type to API parameters
        const isNew = filter === "latest";
        const isPopular = filter === "popular";

        // Build the query URL
        const queryParams = new URLSearchParams({
          page: page.toString(),
          size: pageSize.toString(),
          isPopular: isPopular.toString(),
          isNew: isNew.toString(),
        });
        console.log(
          "Fetching posts with query params:",
          queryParams.toString()
        );

        const response = await axiosInstance.get(`/posts?${queryParams}`);
        const responseData: PostsResponse = response.data;

        // If first page, replace posts. Otherwise, append.
        if (page === 0) {
          setPosts(responseData.posts || []);
        } else {
          setPosts((prev) => [...prev, ...(responseData.posts || [])]);
        }

        // Check if there are more posts to load
        setHasMore(responseData.hasNext);
      } catch (error) {
        console.error("Error fetching posts:", error);
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
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [filter, page]);

  // Function to load more posts
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      // Handle not logged in case
      return;
    }

    try {
      // Optimistically update UI
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            const newLikedState = !post.likedByCurrentUser;
            return {
              ...post,
              likeCount: newLikedState
                ? post.likeCount + 1
                : post.likeCount - 1,
              likedByCurrentUser: newLikedState,
            };
          }
          return post;
        })
      );

      // Get the token
      const user_token = localStorage.getItem("user_token");
      await axiosInstance.post(
        `/posts/${postId}/like`,
        {}, // Empty request body
        {
          // Request config with headers
          headers: {
            Authorization: "Bearer " + user_token,
          },
        }
      );
    } catch (error) {
      console.error("Error liking post:", error);

      // Revert changes if request fails
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            const newLikedState = !post.likedByCurrentUser;
            return {
              ...post,
              likeCount: newLikedState
                ? post.likeCount - 1
                : post.likeCount + 1,
              likedByCurrentUser: !newLikedState,
            };
          }
          return post;
        })
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Feed</h2>
        <div className="flex space-x-2">
          <Button
            variant={filter === "latest" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("latest")}
            className="hover:bg-primary/30 transition-all duration-200"
          >
            <Clock className="mr-1 h-4 w-4" />
            Latest
          </Button>
          <Button
            variant={filter === "popular" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("popular")}
            className="hover:bg-primary/30 transition-all duration-200"
          >
            <Flame className="mr-1 h-4 w-4" />
            Popular
          </Button>
        </div>
      </div>

      {isLoading && page === 0 ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-muted/60 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-muted/60 animate-pulse" />
                    <div className="h-3 w-24 rounded bg-muted/60 animate-pulse" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-4 pb-3 space-y-2">
                  <div className="h-4 w-full rounded bg-muted/60 animate-pulse" />
                  <div className="h-4 w-2/3 rounded bg-muted/60 animate-pulse" />
                </div>
                <div className="relative aspect-[16/9] w-full">
                  <div className="h-full w-full bg-muted/60 animate-pulse" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col p-4">
                <div className="flex w-full items-center justify-between border-t pt-2">
                  <div className="flex space-x-4">
                    <div className="h-4 w-20 rounded bg-muted/60 animate-pulse" />
                    <div className="h-4 w-24 rounded bg-muted/60 animate-pulse" />
                  </div>
                </div>
                <div className="mt-2 flex w-full justify-between gap-4">
                  {[1, 2, 3].map((btn) => (
                    <div
                      key={btn}
                      className="h-8 flex-1 rounded bg-muted/60 animate-pulse"
                    />
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))}

          {isLoading && page > 0 && (
            <div className="flex justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}

          {!isLoading && hasMore && (
            <div className="flex justify-center pt-4">
              <Button onClick={loadMore} variant="outline">
                Load More
              </Button>
            </div>
          )}

          {!isLoading && !hasMore && posts.length > 0 && (
            <p className="text-center text-muted-foreground py-4">
              No more posts to load
            </p>
          )}

          {!isLoading && posts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">No posts found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
