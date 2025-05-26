import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Post } from "../types";
import axiosInstance from "@/lib/axios";
import { useAuth } from "../lib/auth-provider";
import { toast } from "sonner"; // Add Sonner import

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [currentPost, setCurrentPost] = useState<Post>(post);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleLike = async () => {
    if (!user) {
      // Handle not logged in case
      return;
    }

    try {
      // Optimistically update UI
      const newLikedState = !currentPost.likedByCurrentUser;
      setCurrentPost({
        ...currentPost,
        likeCount: newLikedState
          ? currentPost.likeCount + 1
          : currentPost.likeCount - 1,
        likedByCurrentUser: newLikedState,
      });

      // Send request to API
      await axiosInstance.post(`/posts/${currentPost.id}/like`);
    } catch (error) {
      console.error("Error liking post:", error);

      // Revert changes if request fails
      setCurrentPost({
        ...currentPost,
        likeCount: currentPost.likedByCurrentUser
          ? currentPost.likeCount - 1
          : currentPost.likeCount + 1,
        likedByCurrentUser: !currentPost.likedByCurrentUser,
      });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError(null);

    if (!commentText.trim()) {
      return;
    }

    if (!user) {
      // Handle not logged in case
      setCommentError("You must be logged in to comment");
      toast.error("Authentication required", {
        description: "You must be logged in to comment",
      });
      return;
    }

    setIsSubmittingComment(true);

    try {
      // Send the comment to the API
      await axiosInstance.post(`/posts/${currentPost.id}/comments`, {
        text: commentText.trim(),
      });

      // Update comment count and reset form
      setCurrentPost({
        ...currentPost,
        commentCount: currentPost.commentCount + 1,
      });

      toast.success("Comment posted successfully");
      setCommentText("");
      setIsCommenting(false);

      // You could also fetch the updated comments here if you wanted to display them
    } catch (error) {
      console.error("Error submitting comment:", error);
      setCommentError("Failed to submit comment. Please try again.");
      toast.error("Comment failed", {
        description: "Failed to submit comment. Please try again.",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };
  return (
    <Card className="cursor-pointer hover:bg-muted/20 transition-all duration-200">
      {" "}
      <CardHeader className="px-4">
        <div className="flex items-center space-x-3">
          <Link
            to={`/profile/${currentPost.userId}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={currentPost.profileImageUrl || "/placeholder.svg"}
                alt={currentPost.username}
              />
              <AvatarFallback>
                {currentPost.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link
              to={`/profile/${currentPost.userId}`}
              className="font-medium hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {currentPost.username}
            </Link>
            {/* <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p> */}
          </div>
        </div>
      </CardHeader>
      <Link to={`/post/${currentPost.id}`} className="block">
        <CardContent className="p-0">
          <div className="px-4 pb-3">
            <p className="whitespace-pre-line">{currentPost.text}</p>
          </div>
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src={currentPost.imageUrls[0] || "/placeholder.svg"}
              alt="Post image"
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        </CardContent>
      </Link>{" "}
      <CardFooter className="flex flex-col p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex space-x-4">
            <span className="text-sm text-muted-foreground">
              {currentPost.likeCount} likes
            </span>
            <span className="text-sm text-muted-foreground">
              {currentPost.commentCount} comments
            </span>
          </div>
        </div>
        <div className="mt-2 flex w-full border-t pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <Heart
              className={`mr-1 h-4 w-4 ${
                currentPost.likedByCurrentUser
                  ? "fill-red-500 text-red-500"
                  : ""
              }`}
            />
            Like
          </Button>{" "}
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              setIsCommenting(!isCommenting);
            }}
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            Comment
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>

        {isCommenting && (
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              handleComment(e);
            }}
            className="mt-3 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-2">
              {commentError && (
                <p className="text-sm text-destructive">{commentError}</p>
              )}{" "}
              <div className="flex items-start space-x-2">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src="/placeholder.svg" alt="Your profile" />
                  <AvatarFallback>
                    {user?.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={commentText}
                    onChange={(e) => {
                      e.stopPropagation();
                      setCommentText(e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    disabled={isSubmittingComment}
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  disabled={isSubmittingComment || !commentText.trim()}
                >
                  {isSubmittingComment ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </CardFooter>
    </Card>
  );
}
