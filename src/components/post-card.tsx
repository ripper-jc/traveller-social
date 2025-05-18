import type React from "react";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import type { Post } from "../types";
// import { timeAgo } from "../lib/utils"

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    onLike(post.id);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      console.log("Adding comment:", commentText);
      setCommentText("");
      setIsCommenting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="px-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.userId}`}>
            <img
              src={post.profileImageUrl || "/placeholder.svg"}
              alt={post.username}
              className="h-10 w-10 rounded-full object-cover"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${post.userId}`}
              className="font-medium hover:underline"
            >
              {post.username}
            </Link>
            {/* <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 pb-3">
          <p className="whitespace-pre-line">{post.text}</p>
        </div>
        <Link to={`/post/${post.id}`}>
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src={post.imageUrls[0] || "/placeholder.svg"}
              alt="Post image"
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        </Link>
      </CardContent>
      <CardFooter className="flex flex-col p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex space-x-4">
            <span className="text-sm text-muted-foreground">
              {post.likeCount} likes
            </span>
            <span className="text-sm text-muted-foreground">
              {post.commentCount} comments
            </span>
          </div>
        </div>
        <div className="mt-2 flex w-full border-t pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={handleLike}
          >
            <Heart
              className={`mr-1 h-4 w-4 ${
                post.likedByCurrentUser ? "fill-red-500 text-red-500" : ""
              }`}
            />
            Like
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => setIsCommenting(!isCommenting)}
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>

        {isCommenting && (
          <form onSubmit={handleComment} className="mt-3 w-full">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button type="submit" size="sm">
                Post
              </Button>
            </div>
          </form>
        )}
      </CardFooter>
    </Card>
  );
}
