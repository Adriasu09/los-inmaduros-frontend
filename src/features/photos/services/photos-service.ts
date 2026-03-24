import apiClient from "@/lib/api/client";
import type { ApiResponse, Photo, PhotoContext } from "@/types";

export interface UploadPhotoData {
  image: File;
  context: PhotoContext;
  routeId?: string;
  routeCallId?: string;
  caption?: string;
}

export async function uploadPhoto(
  data: UploadPhotoData,
): Promise<ApiResponse<Photo>> {
  const formData = new FormData();
  formData.append("image", data.image);
  formData.append("context", data.context);
  if (data.routeId) formData.append("routeId", data.routeId);
  if (data.routeCallId) formData.append("routeCallId", data.routeCallId);
  if (data.caption?.trim()) formData.append("caption", data.caption.trim());

  return apiClient.post<ApiResponse<Photo>>("/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
