"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface XRayUploaderProps {
  visitId: string;
  onUploadComplete?: () => void;
}

interface UploadedFile {
  file: File;
  preview: string;
  type: string;
  status: "pending" | "uploading" | "success" | "error";
  errorMessage?: string;
}

export function XRayUploader({ visitId, onUploadComplete }: XRayUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: "bitewing_right", // Default type
      status: "pending" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".dcm"],
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB max
  });

  const removeFile = (fileToRemove: UploadedFile) => {
    URL.revokeObjectURL(fileToRemove.preview);
    setFiles((prev) => prev.filter((f) => f !== fileToRemove));
  };

  const updateFileType = (file: UploadedFile, type: string) => {
    setFiles((prev) =>
      prev.map((f) => (f === file ? { ...f, type } : f))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Mock: Simulate upload for all files
      const uploadPromises = files.map(async (uploadedFile) => {
        try {
          // Update status to uploading
          setFiles((prev) =>
            prev.map((f) =>
              f === uploadedFile ? { ...f, status: "uploading" as const } : f
            )
          );

          // Simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 500));

          // Update status to success
          setFiles((prev) =>
            prev.map((f) =>
              f === uploadedFile ? { ...f, status: "success" as const } : f
            )
          );
        } catch (error: any) {
          console.error("Error uploading file:", error);
          // Update status to error
          setFiles((prev) =>
            prev.map((f) =>
              f === uploadedFile
                ? {
                    ...f,
                    status: "error" as const,
                    errorMessage: error.message || "Upload failed",
                  }
                : f
            )
          );
        }
      });

      await Promise.all(uploadPromises);

      // Check if all uploads were successful
      const allSuccess = files.every((f) => f.status === "success");
      if (allSuccess) {
        // Clear files and notify parent
        setFiles([]);
        onUploadComplete?.();
      }
    } catch (error) {
      console.error("Error in upload process:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = files.length > 0 && !isSaving;
  const hasErrors = files.some((f) => f.status === "error");

  return (
    <div>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600 font-medium">Drop the files here...</p>
        ) : (
          <>
            <p className="text-gray-700 font-medium mb-2">
              Drag and drop X-ray images here
            </p>
            <p className="text-sm text-gray-500">
              or click to select files (PNG, JPG, JPEG, DICOM - max 50MB)
            </p>
          </>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">Files to Upload ({files.length})</h3>
          <div className="grid gap-4">
            {files.map((uploadedFile, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                {/* Preview */}
                <img
                  src={uploadedFile.preview}
                  alt="X-ray preview"
                  className="w-20 h-20 object-cover rounded"
                />

                {/* File Info */}
                <div className="flex-1">
                  <p className="font-medium text-sm">{uploadedFile.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  {/* Type Selector */}
                  <select
                    value={uploadedFile.type}
                    onChange={(e) => updateFileType(uploadedFile, e.target.value)}
                    className="mt-2 text-sm border rounded px-2 py-1"
                    disabled={uploadedFile.status !== "pending"}
                  >
                    <option value="bitewing_right">Bitewing Right</option>
                    <option value="bitewing_left">Bitewing Left</option>
                    <option value="periapical">Periapical</option>
                    <option value="panoramic">Panoramic</option>
                  </select>

                  {uploadedFile.status === "error" && uploadedFile.errorMessage && (
                    <p className="text-xs text-red-600 mt-1">
                      {uploadedFile.errorMessage}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {uploadedFile.status === "pending" && (
                    <span className="text-sm text-gray-500">Ready</span>
                  )}
                  {uploadedFile.status === "uploading" && (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  )}
                  {uploadedFile.status === "success" && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {uploadedFile.status === "error" && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  {uploadedFile.status === "pending" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadedFile)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={!canSave}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload X-Rays"
              )}
            </Button>
            {hasErrors && (
              <Button
                variant="outline"
                onClick={() => setFiles(files.filter((f) => f.status !== "success"))}
              >
                Clear Successful
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
