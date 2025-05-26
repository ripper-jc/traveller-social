import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { PostCard } from "../components/post-card";
import { TrendingPanel } from "../components/trending-panel";
import { BackToTopButton } from "../components/back-to-top-button";
import axiosInstance from "@/lib/axios";
import type { Post } from "../types";
import { Button } from "../components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardHeader } from "../components/ui/card";

interface SinglePostResponse {
  id: string;
  userId: string;
  text: string;
  imageUrls: string[];
  createdAt: string;
  likeCount: number;
  commentCount: number;
  author?: {
    username: string;
    profileImageUrl: string | null;
  };
  likedByCurrentUser: boolean;
  // The backend may return these directly or nested in author
  username?: string;
  profileImageUrl?: string | null;
}

// Comment interfaces
interface CommentUser {
  username: string;
  profileImageUrl: string | null;
}

interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  user: CommentUser;
}

interface CommentsResponse {
  comments: Comment[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get<SinglePostResponse>(
          `/posts/${postId}`
        );
        // Transform the response to match our Post type
        const postData: Post = {
          id: response.data.id,
          userId: response.data.userId,
          text: response.data.text,
          imageUrls: response.data.imageUrls,
          createdAt: response.data.createdAt,
          likeCount: response.data.likeCount,
          commentCount: response.data.commentCount,
          username:
            response.data.username ||
            response.data.author?.username ||
            "Unknown User",
          profileImageUrl:
            response.data.profileImageUrl !== undefined
              ? response.data.profileImageUrl
              : response.data.author?.profileImageUrl || null,
          likedByCurrentUser: response.data.likedByCurrentUser,
        };

        setPost(postData);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(
          "Failed to load post. The post may have been deleted or you may not have permission to view it."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // Fetch comments when post ID changes or page changes
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      setIsLoadingComments(true);
      setCommentsError(null);

      try {
        const response = await axiosInstance.get<CommentsResponse>(
          `/posts/${postId}/comments?page=${page}&size=10`
        );

        const newComments = response.data.comments;

        // If first page, replace comments. Otherwise, append.
        if (page === 0) {
          setComments(newComments);
        } else {
          setComments((prev) => [...prev, ...newComments]);
        }

        setHasMoreComments(response.data.hasNext);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setCommentsError("Failed to load comments. Please try again later.");
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchComments();
  }, [postId, page]);

  // Handler for submitting a new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim() || !postId) return;

    setIsSubmittingComment(true);

    try {
      await axiosInstance.post(`/posts/${postId}/comments`, {
        text: commentText.trim(),
      });

      // Refresh comments
      setPage(0);
      setCommentText("");

      // Update comment count in post
      if (post) {
        setPost({
          ...post,
          commentCount: post.commentCount + 1,
        });
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      setCommentsError("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handler to load more comments
  const loadMoreComments = () => {
    if (!isLoadingComments && hasMoreComments) {
      setPage((prev) => prev + 1);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <>
      <Navbar />
      <main className="container grid grid-cols-1 gap-6 py-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="flex items-center gap-1 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Post</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-lg text-muted-foreground">{error}</p>
              <Button className="mt-4" onClick={handleGoBack}>
                Go back
              </Button>
            </div>
          ) : post ? (
            <div className="space-y-6">
              <PostCard post={post} />

              {/* Comments section */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Comments ({post.commentCount})
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Comment form */}
                  <form
                    onSubmit={handleSubmitComment}
                    className="flex items-start gap-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="Your profile" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        className="w-full rounded-full border border-input px-4 py-2 pr-10 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={isSubmittingComment}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
                        disabled={!commentText.trim() || isSubmittingComment}
                        type="submit"
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send comment</span>
                      </Button>
                    </div>
                  </form>

                  {commentsError && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {commentsError}
                    </div>
                  )}

                  {/* Comments list */}
                  {comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex gap-2 items-start"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                comment.user.profileImageUrl ||
                                "/placeholder.svg"
                              }
                              alt={comment.user.username}
                            />
                            <AvatarFallback>
                              {comment.user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">
                                {comment.user.username}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.text}</p>
                          </div>
                        </div>
                      ))}

                      {hasMoreComments && (
                        <div className="pt-2 flex justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={loadMoreComments}
                            disabled={isLoadingComments}
                          >
                            {isLoadingComments
                              ? "Loading..."
                              : "Load more comments"}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : isLoadingComments ? (
                    <div className="py-4 flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground text-sm py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-lg text-muted-foreground">Post not found</p>
              <Button className="mt-4" onClick={handleGoBack}>
                Go back
              </Button>
            </div>
          )}
        </div>
        <div className="hidden md:block">
          <TrendingPanel />
        </div>
      </main>
      <BackToTopButton />
    </>
  );
}

export default PostPage;
