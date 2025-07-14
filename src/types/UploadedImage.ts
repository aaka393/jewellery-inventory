export interface UploadedImage {
  id: string;
  userId: string;
  originalUrl: string;
  processedUrl?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  metadata?: {
    width: number;
    height: number;
    faceDetected: boolean;
    neckPosition?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

export interface TryOnResult {
  id: string;
  userId: string;
  productId: string;
  userImageId: string;
  resultImageUrl: string;
  adjustments: {
    scale: number;
    rotation: number;
    position: {
      x: number;
      y: number;
    };
  };
  createdAt: string;
}

export interface TryOnRequest {
  userImageId: string;
  productId: string;
  adjustments?: {
    scale?: number;
    rotation?: number;
    position?: {
      x: number;
      y: number;
    };
  };
}