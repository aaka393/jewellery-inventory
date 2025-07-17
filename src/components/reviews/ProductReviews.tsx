import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, User, Calendar, CheckCircle } from 'lucide-react';
import { Review } from '../../types';
import { apiService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await apiService.getProductReviews(productId);
      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert('Please login to submit a review');
      return;
    }

    try {
      setSubmitting(true);
      await apiService.addProductReview(productId, {
        userId: user.id,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
      });
      
      setNewReview({ rating: 5, title: '', comment: '' });
      setShowAddReview(false);
      await loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Customer Reviews</h3>
          {isAuthenticated && (
            <button
              onClick={() => setShowAddReview(!showAddReview)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Write a Review
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
          </div>
          <span className="text-gray-600">({reviews.length} reviews)</span>
        </div>
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">Write a Review for {productName}</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Summarize your review"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Share your experience with this product"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting || !newReview.comment.trim()}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddReview(false)}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      {review.isVerifiedPurchase && (
                        <span className="flex items-center text-green-600 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
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
              </div>
              
              {review.title && (
                <h5 className="font-semibold text-gray-800 mb-2">{review.title}</h5>
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
              
              <div className="flex items-center space-x-4 text-sm">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-600">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Helpful ({review.helpfulCount || 0})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;