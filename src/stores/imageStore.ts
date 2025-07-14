import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UploadedImage, TryOnResult, TryOnRequest, LoadingState } from '../types';
import { imageService } from '../services/imageService';

interface ImageStore extends LoadingState {
  // State
  userImages: UploadedImage[];
  selectedImage: UploadedImage | null;
  tryOnResults: TryOnResult[];
  currentTryOn: TryOnResult | null;
  uploadProgress: number;
  
  // Actions
  setSelectedImage: (image: UploadedImage | null) => void;
  setCurrentTryOn: (result: TryOnResult | null) => void;
  
  // Async actions
  uploadImage: (file: File) => Promise<UploadedImage>;
  fetchUserImages: () => Promise<void>;
  deleteImage: (imageId: string) => Promise<void>;
  processImageForTryOn: (imageId: string) => Promise<UploadedImage>;
  createTryOn: (request: TryOnRequest) => Promise<TryOnResult>;
  fetchTryOnResults: () => Promise<void>;
  updateTryOnAdjustments: (resultId: string, adjustments: TryOnRequest['adjustments']) => Promise<TryOnResult>;
  deleteTryOnResult: (resultId: string) => Promise<void>;
  saveTryOnResult: (resultId: string) => Promise<UploadedImage>;
  shareTryOnResult: (resultId: string) => Promise<string>;
}

export const useImageStore = create<ImageStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      userImages: [],
      selectedImage: null,
      tryOnResults: [],
      currentTryOn: null,
      uploadProgress: 0,
      isLoading: false,
      error: null,

      // Sync actions
      setSelectedImage: (image) => set({ selectedImage: image }),
      
      setCurrentTryOn: (result) => set({ currentTryOn: result }),

      // Async actions
      uploadImage: async (file) => {
        set({ isLoading: true, error: null, uploadProgress: 0 });
        try {
          // Simulate upload progress
          const progressInterval = setInterval(() => {
            set((state) => ({
              uploadProgress: Math.min(state.uploadProgress + 10, 90)
            }));
          }, 200);

          const uploadedImage = await imageService.uploadImage(file);
          
          clearInterval(progressInterval);
          set((state) => ({
            userImages: [...state.userImages, uploadedImage],
            selectedImage: uploadedImage,
            uploadProgress: 100,
            isLoading: false,
          }));

          // Reset progress after a delay
          setTimeout(() => set({ uploadProgress: 0 }), 1000);
          
          return uploadedImage;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to upload image',
            isLoading: false,
            uploadProgress: 0,
          });
          throw error;
        }
      },

      fetchUserImages: async () => {
        set({ isLoading: true, error: null });
        try {
          const images = await imageService.getUserImages();
          set({ userImages: images, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch images',
            isLoading: false,
          });
        }
      },

      deleteImage: async (imageId) => {
        set({ isLoading: true, error: null });
        try {
          await imageService.deleteImage(imageId);
          set((state) => ({
            userImages: state.userImages.filter(img => img.id !== imageId),
            selectedImage: state.selectedImage?.id === imageId ? null : state.selectedImage,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete image',
            isLoading: false,
          });
          throw error;
        }
      },

      processImageForTryOn: async (imageId) => {
        set({ isLoading: true, error: null });
        try {
          const processedImage = await imageService.processImageForTryOn(imageId);
          set((state) => ({
            userImages: state.userImages.map(img => 
              img.id === imageId ? processedImage : img
            ),
            selectedImage: state.selectedImage?.id === imageId ? processedImage : state.selectedImage,
            isLoading: false,
          }));
          return processedImage;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to process image',
            isLoading: false,
          });
          throw error;
        }
      },

      createTryOn: async (request) => {
        set({ isLoading: true, error: null });
        try {
          const result = await imageService.createTryOn(request);
          set((state) => ({
            tryOnResults: [...state.tryOnResults, result],
            currentTryOn: result,
            isLoading: false,
          }));
          return result;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create try-on',
            isLoading: false,
          });
          throw error;
        }
      },

      fetchTryOnResults: async () => {
        set({ isLoading: true, error: null });
        try {
          const results = await imageService.getTryOnResults();
          set({ tryOnResults: results, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch try-on results',
            isLoading: false,
          });
        }
      },

      updateTryOnAdjustments: async (resultId, adjustments) => {
        set({ isLoading: true, error: null });
        try {
          const updatedResult = await imageService.updateTryOnAdjustments(resultId, adjustments);
          set((state) => ({
            tryOnResults: state.tryOnResults.map(result =>
              result.id === resultId ? updatedResult : result
            ),
            currentTryOn: state.currentTryOn?.id === resultId ? updatedResult : state.currentTryOn,
            isLoading: false,
          }));
          return updatedResult;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update adjustments',
            isLoading: false,
          });
          throw error;
        }
      },

      deleteTryOnResult: async (resultId) => {
        set({ isLoading: true, error: null });
        try {
          await imageService.deleteTryOnResult(resultId);
          set((state) => ({
            tryOnResults: state.tryOnResults.filter(result => result.id !== resultId),
            currentTryOn: state.currentTryOn?.id === resultId ? null : state.currentTryOn,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete try-on result',
            isLoading: false,
          });
          throw error;
        }
      },

      saveTryOnResult: async (resultId) => {
        set({ isLoading: true, error: null });
        try {
          const savedImage = await imageService.saveTryOnResult(resultId);
          set((state) => ({
            userImages: [...state.userImages, savedImage],
            isLoading: false,
          }));
          return savedImage;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to save try-on result',
            isLoading: false,
          });
          throw error;
        }
      },

      shareTryOnResult: async (resultId) => {
        set({ isLoading: true, error: null });
        try {
          const { shareUrl } = await imageService.shareTryOnResult(resultId);
          set({ isLoading: false });
          return shareUrl;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to share try-on result',
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    { name: 'image-store' }
  )
);