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
import { ErrorDisplay, InlineError } from "./ui/error-display";
import axiosInstance, { handleApiError } from "@/lib/axios";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    content?: string;
    images?: string;
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal closes
  const handleClose = () => {
    if (!isSubmitting) {
      setContent("");
      setImages([]);
      setError(null);
      setValidationErrors({});
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
      setValidationErrors((prev) => ({
        ...prev,
        images: `You can only upload ${remainingSlots} more image(s). Maximum 5 images per post.`,
      }));
      setTimeout(() => {
        setValidationErrors((prev) => ({ ...prev, images: undefined }));
      }, 3000);
    }

    // Filter valid files
    const validFiles = filesToProcess.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setValidationErrors((prev) => ({
          ...prev,
          images: "Please select only image files.",
        }));
        setTimeout(() => {
          setValidationErrors((prev) => ({ ...prev, images: undefined }));
        }, 3000);
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        setValidationErrors((prev) => ({
          ...prev,
          images: "Please select images smaller than 10MB.",
        }));
        setTimeout(() => {
          setValidationErrors((prev) => ({ ...prev, images: undefined }));
        }, 3000);
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
    setError(null);
    setValidationErrors({});

    // Validate inputs
    const errors: typeof validationErrors = {};

    if (!content.trim()) {
      errors.content = "Please add some text to your post.";
    }

    if (images.length === 0) {
      errors.images = "Please upload at least one image for your post.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
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

      handleClose();
    } catch (error) {
      console.error("Error creating post:", error);
      setError(handleApiError(error));
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
            {error && <ErrorDisplay message={error} />}

            {/* Text Content */}
            <div className="space-y-2">
              <Textarea
                placeholder="Share your travel experience..."
                className="min-h-32 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
              />
              {validationErrors.content && (
                <InlineError message={validationErrors.content} />
              )}
            </div>

            {/* Image Upload Area */}
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Images ({images.length}/5)
                </h3>
              </div>

              {validationErrors.images && (
                <InlineError message={validationErrors.images} />
              )}

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
