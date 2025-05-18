import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import { useAuth } from "./lib/auth-provider";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public route component (redirects to home if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route
        path="/"
        element={
            <MainPage />
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <div>Profile Page (To be implemented)</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <div>User Profile Page (To be implemented)</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <div>Create Post Page (To be implemented)</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/post/:postId"
        element={
          <ProtectedRoute>
            <div>Single Post Page (To be implemented)</div>
          </ProtectedRoute>
        }
      />

      {/* Public Routes (accessible only when not logged in) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Fallback route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
