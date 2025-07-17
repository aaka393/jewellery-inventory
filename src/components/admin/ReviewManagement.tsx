import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Eye, Calendar, User } from 'lucide-react';
import { Review } from '../../types';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllReviews();
      setReviews(response.result || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerateReview = async (reviewId: string, approved: boolean) => {
    try {
      await adminService.moderateReview(reviewId, approved);
      await loadReviews(); // Refresh the list
    } catch (error) {
      console.error('Error moderating review:', error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'pending') return review.isApproved === undefined;
    if (filter === 'approved') return review.isApproved === true;
    if (filter === 'rejected') return review.isApproved === false;
    return true;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Review Management</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Reviews ({reviews.length})</option>
          <option value="pending">Pending ({reviews.filter(r => r.isApproved === undefined).length})</option>
          <option value="approved">Approved ({reviews.filter(r => r.isApproved === true).length})</option>
          <option value="rejected">Rejected ({reviews.filter(r => r.isApproved === false).length})</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-500">Reviews will appear here for moderation.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          {review.isVerifiedPurchase && (
                            <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {review.title && (
                      <h4 className="font-semibold text-gray-800 mb-2">{review.title}</h4>
                    )}
                    
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    
                    {review.images && review.images.length > 0 && (
                      <div className="flex space-x-2 mb-3">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-500">
                      Product ID: {review.productId} | User ID: {review.userId}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    {/* Status Badge */}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      review.isApproved === true
                        ? 'bg-green-100 text-green-800'
                        : review.isApproved === false
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.isApproved === true
                        ? 'Approved'
                        : review.isApproved === false
                        ? 'Rejected'
                        : 'Pending'
                      }
                    </span>
                    
                    {/* Action Buttons */}
                    {review.isApproved === undefined && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleModerateReview(review.id, true)}
                          className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleModerateReview(review.id, false)}
                          className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                        >
                          <XCircle className="h-3 w-3" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                    
                    {review.isApproved !== undefined && (
                      <button
                        onClick={() => handleModerateReview(review.id, !review.isApproved)}
                        className="text-purple-600 hover:text-purple-800 text-xs"
                      >
                        {review.isApproved ? 'Reject' : 'Approve'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;