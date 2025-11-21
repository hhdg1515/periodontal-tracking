"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface XRayUploaderProps {
  visitId: string;
}

interface UploadedFile {
  file: File;
  preview: string;
  type: string;
  status: "uploading" | "success" | "error";
}

export function XRayUploader({ visitId }: XRayUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: "bitewing_right", // Default type
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload
    newFiles.forEach((uploadedFile, index) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.file === uploadedFile.file ? { ...f, status: "success" as const } : f
          )
        );
      }, 1000 + index * 500);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".dcm"],
    },
    multiple: true,
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
              or click to select files (PNG, JPG, JPEG, DICOM)
            </p>
          </>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">Uploaded Files ({files.length})</h3>
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
                    disabled={uploadedFile.status === "uploading"}
                  >
                    <option value="bitewing_right">Bitewing Right</option>
                    <option value="bitewing_left">Bitewing Left</option>
                    <option value="periapical">Periapical</option>
                    <option value="panoramic">Panoramic</option>
                  </select>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {uploadedFile.status === "uploading" && (
                    <div className="text-sm text-gray-500">Uploading...</div>
                  )}
                  {uploadedFile.status === "success" && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadedFile)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <Button
            className="w-full"
            disabled={files.some((f) => f.status === "uploading")}
          >
            Save X-Rays to Visit
          </Button>
        </div>
      )}
    </div>
  );
}
