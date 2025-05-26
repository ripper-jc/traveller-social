import { Card, CardContent, CardFooter, CardHeader } from "./card";

export function PostSkeleton() {
  return (
    <Card>
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
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-2 items-start">
      <div className="h-8 w-8 rounded-full bg-muted/60 animate-pulse" />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-muted/60 animate-pulse" />
          <div className="h-3 w-16 rounded bg-muted/60 animate-pulse" />
        </div>
        <div className="h-4 w-full rounded bg-muted/60 animate-pulse" />
      </div>
    </div>
  );
}

export function NavbarSkeleton() {
  return <div className="animate-pulse h-8 w-32 bg-muted rounded-md"></div>;
}

export function LoadingSpinner({
  size = "default",
}: {
  size?: "small" | "default" | "large";
}) {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    default: "h-8 w-8 border-4",
    large: "h-12 w-12 border-4",
  };

  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-primary border-t-transparent`}
    ></div>
  );
}
