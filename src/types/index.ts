export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  bio?: string;
  createdAt: string;
  postCount: number;
  likeCount: number;
  commentCount: number;
}

export interface Post {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  imageUrls: string[];
  likeCount: number;
  commentCount: number;
  username: string;
  profileImageUrl: string | null;
  likedByCurrentUser: boolean;
}

export interface PostsResponse {
  posts: Post[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: User;
  postId: string;
}
