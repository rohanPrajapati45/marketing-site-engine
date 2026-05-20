import api from '../utils/api';

// Upload image file to backend → Cloudinary
// folder: 'hero' | 'projects' | 'casestudies' | 'solutions' | 'contact' | 'general'
export const uploadImage = async (file, folder = 'general', onProgress) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const res = await api.post('/api/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percent);
      }
    },
  });
  return res.data;
};

// Get all media — optional folder filter
export const getMedia = async (folder = '') => {
  const url = folder ? `/api/media?folder=${folder}` : '/api/media';
  const res = await api.get(url);
  return res.data;
};

// Delete image from Cloudinary + DB
export const deleteMedia = async (id) => {
  const res = await api.delete(`/api/media/${id}`);
  return res.data;
};

// Update alt text
export const updateAlt = async (id, altText) => {
  const res = await api.patch(`/api/media/${id}/alt`, { altText });
  return res.data;
};
