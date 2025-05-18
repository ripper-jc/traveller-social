import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

// Mock data for trending travelers
const trendingTravelers = [
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
]

// Mock data for trending locations
const trendingLocations = [
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
]

export function TrendingPanel() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Popular Travelers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingTravelers.map((traveler) => (
            <Link key={traveler.id} to={`/profile/${traveler.id}`}>
              <div className="flex items-center space-x-3 rounded-md p-2 transition-colors hover:bg-muted">
                <img
                  src={traveler.image || "/placeholder.svg"}
                  alt={traveler.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{traveler.name}</p>
                  <p className="text-xs text-muted-foreground">{traveler.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trending Destinations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingLocations.map((location) => (
            <Link key={location.id} to={`/search?q=${encodeURIComponent(location.name)}`}>
              <div className="overflow-hidden rounded-md transition-transform hover:scale-[1.02]">
                <div className="relative h-24 w-full">
                  <img
                    src={location.image || "/placeholder.svg"}
                    alt={location.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-sm font-medium text-white">{location.name}</p>
                    <p className="text-xs text-white/80">{location.postCount} posts</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

