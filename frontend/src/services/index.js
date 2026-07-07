import api from './api';

export const listingsService = {
  getAll: (params) => api.get('/listings', { params }),
  getById: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post('/listings', data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
  getMyListings: () => api.get('/listings/host/me'),
};

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const bookingsService = {
  create: (data) => api.post('/bookings', data),
  getMy: () => api.get('/bookings/my'),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getListingBookings: (listingId) => api.get(`/bookings/listing/${listingId}`),
};

export const reviewsService = {
  create: (data) => api.post('/reviews', data),
  getByListing: (listingId) => api.get(`/reviews/listing/${listingId}`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const wishlistService = {
  getAll: () => api.get('/wishlists'),
  toggle: (listingId) => api.post(`/wishlists/${listingId}`),
  check: (listingId) => api.get(`/wishlists/check/${listingId}`),
};

export const uploadService = {
  upload: (files) => {
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
