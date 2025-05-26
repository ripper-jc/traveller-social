import { Post } from "../types";

// Mock data for posts
export const mockPosts: Post[] = [
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

// Mock data for trending travelers
export const trendingTravelers = [
  {
    id: "1",
    name: "John Traveler",
    image: "https://via.placeholder.com/100",
    location: "Bali, Indonesia",
  },
  {
    id: "2",
    name: "Sarah Explorer",
    image: "https://via.placeholder.com/100",
    location: "Swiss Alps",
  },
  {
    id: "3",
    name: "Mike Foodie",
    image: "https://via.placeholder.com/100",
    location: "Bangkok, Thailand",
  },
];

// Mock data for trending locations
export const trendingLocations = [
  {
    id: "1",
    name: "Santorini, Greece",
    image: "https://via.placeholder.com/200x100",
    postCount: 1243,
  },
  {
    id: "2",
    name: "Kyoto, Japan",
    image: "https://via.placeholder.com/200x100",
    postCount: 982,
  },
  {
    id: "3",
    name: "Machu Picchu, Peru",
    image: "https://via.placeholder.com/200x100",
    postCount: 756,
  },
];
