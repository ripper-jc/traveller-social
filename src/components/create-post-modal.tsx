import { useState, useRef } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal closes
  const handleClose = () => {
    if (!isSubmitting) {
      setContent("");
      setImages([]);
      onClose();
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 images total
    const remainingSlots = 5 - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.error("Too many images", {
        description: `You can only upload ${remainingSlots} more image(s). Maximum 5 images per post.`,
      });
    }

    // Filter valid files
    const validFiles = filesToProcess.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description: "Please select only image files.",
        });
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please select images smaller than 10MB.",
        });
        return false;
      }

      return true;
    });

    setImages((prev) => [...prev, ...validFiles]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove image at index
  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // Submit post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Content required", {
        description: "Please add some text to your post.",
      });
      return;
    }

    if (images.length === 0) {
      toast.error("Image required", {
        description: "Please upload at least one image for your post.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("text", content);

      // Append each image with the same field name
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Send to API
      await axiosInstance.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created!", {
        description: "Your travel post has been published successfully.",
      });

      handleClose();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error", {
        description: "Failed to create post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Create a New Post</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Text Content */}
            <Textarea
              placeholder="Share your travel experience..."
              className="min-h-32 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />

            {/* Image Upload Area */}
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Images ({images.length}/5)
                </h3>

              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                disabled={isSubmitting}
              />

              {/* Images Preview */}
              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Click to upload images
                  </p>
                  <p className="text-xs text-gray-500">
                    Support JPG, PNG, GIF up to 10MB each (max 5 images)
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-4">
            <div className="flex gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Post"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
