import { Navbar } from "../components/Navbar";
import { PostFeed } from "../components/post-feed";
import { TrendingPanel } from "../components/trending-panel";
import { BackToTopButton } from "../components/back-to-top-button";

function MainPage() {
  return (
    <>
      <Navbar />
      <main className="container grid grid-cols-1 gap-6 py-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <PostFeed />
        </div>
        <div className="hidden md:block">
          <TrendingPanel />
        </div>
      </main>
      <BackToTopButton />
    </>
  );
}

export default MainPage;
