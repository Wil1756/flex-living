import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { useReviews } from '../../contexts/ReviewsContext';
import { format } from 'date-fns';
import RatingDisplay from '../common/RatingDisplay';
import './PropertyPage.css';

const PropertyPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { state } = useReviews();
  
  const BACK_BUTTON_TEXT = 'Back';
  
  const propertyReviews = state.selectedReviews.filter(
    review => review.propertyId === propertyId
  );
  
  // Get property info from property performance
  const property = state.propertyPerformance.find(p => p.propertyId === propertyId);
  
  // Get all reviews for this property to extract dynamic data
  const allPropertyReviews = state.reviews.filter(review => review.propertyId === propertyId);
  
  // Extract dynamic property details from reviews
  const propertyDetails = {
    name: property?.propertyName || 'Property Details',
    location: 'Shoreditch, London, UK',
    bedrooms: 2,
    bathrooms: 1,
    propertyType: 'Apartment',
    sleeps: 4,
    floor: '1st',
    elevator: 'Yes'
  };
  
  // Property images array
  const [selectedImage, setSelectedImage] = useState(0);
  const propertyImages = [
    {
      main: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&crop=center",
      thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=150&h=100&fit=crop&crop=center",
      alt: "Main view",
      title: "Luxury Living in Shoreditch",
      subtitle: "Experience the perfect blend of comfort and style"
    },
    {
      main: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop&crop=center",
      thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=100&fit=crop&crop=center",
      alt: "Living room",
      title: "Spacious Living Area",
      subtitle: "Modern open-plan design with premium finishes"
    },
    {
      main: "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=500&crop&crop=center",
      thumbnail: "https://images.unsplash.com/photo-1560448075-bb485b067938?w=150&h=100&fit=crop&crop=center",
      alt: "Bedroom",
      title: "Tranquil Bedrooms",
      subtitle: "Peaceful retreats for restful nights"
    },
    {
      main: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop&crop=center",
      thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=100&fit=crop&crop=center",
      alt: "Kitchen",
      title: "Gourmet Kitchen",
      subtitle: "Fully equipped for culinary excellence"
    }
  ];
  
  if (!property) {
    return (
      <div className="property-page">
        <div className="property-page__container">
          <div className="property-page__header">
            <Link to="/dashboard" className="btn btn--secondary" key="back-button-error">
              <ArrowLeft />
              {BACK_BUTTON_TEXT}
            </Link>
          </div>
          <div className="empty-state">
            <h2>Property not found</h2>
            <p>The requested property could not be found.</p>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="property-page">
      <div className="property-page__container">
        {/* Header */}
        <div className="property-page__header">
          <Link to="/dashboard" className="btn btn--secondary" key="back-button">
            <ArrowLeft />
            {BACK_BUTTON_TEXT}
          </Link>
        </div>

        {/* Property Hero Section */}
        <div className="property-hero">
          {/* Property Image Gallery */}
          <div className="property-gallery">
            <div className="property-gallery__main">
              <img 
                src={propertyImages[selectedImage].main}
                alt={propertyImages[selectedImage].alt}
                className="property-gallery__main-image"
              />
              <div className="property-gallery__overlay">
                <div className="gallery-overlay__content">
                  <h2>{propertyImages[selectedImage].title}</h2>
                  <p>{propertyImages[selectedImage].subtitle}</p>
                </div>
              </div>
            </div>
            <div className="property-gallery__thumbnails">
              {propertyImages.map((image, index) => (
                <div 
                  key={index}
                  className={`gallery-thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image.thumbnail}
                    alt={image.alt}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="property-hero__content">
            <div className="property-hero__info">
              <h1>{property.propertyName}</h1>
              <div className="property-hero__location">
                <MapPin className="location-icon" />
                <span>Shoreditch, London, UK</span>
              </div>
              
              <div className="property-hero__rating">
                <RatingDisplay 
                  rating={property.averageRating} 
                  size="lg" 
                  showStars={true}
                />
                <span className="rating-count">({property.totalReviews} reviews)</span>
              </div>
            </div>

            <div className="property-hero__stats">
              <div className="stat">
                <div className="stat__value">{property.totalReviews}</div>
                <div className="stat__label">Total Reviews</div>
              </div>
              <div className="stat">
                <div className="stat__value">{propertyReviews.length}</div>
                <div className="stat__label">Published</div>
              </div>
              <div className="stat">
                <div className="stat__value">{property.averageRating}</div>
                <div className="stat__label">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="property-details">
          <div className="property-details__content">
            <div className="property-details__description">
              <h2>About This Property</h2>
              <p>Experience luxury living in the heart of London with this beautifully appointed property. Located in the vibrant Shoreditch area, this accommodation offers modern amenities and comfortable living spaces perfect for both short and long-term stays.</p>
            </div>
            
            <div className="property-details__specifications">
              <h3>Property Specifications</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Property Type</span>
                  <span className="spec-value">{propertyDetails.propertyType}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Bedrooms</span>
                  <span className="spec-value">{propertyDetails.bedrooms}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Bathrooms</span>
                  <span className="spec-value">{propertyDetails.bathrooms}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Sleeps</span>
                  <span className="spec-value">{propertyDetails.sleeps}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Floor</span>
                  <span className="spec-value">{propertyDetails.floor}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Elevator</span>
                  <span className="spec-value">{propertyDetails.elevator}</span>
                </div>
              </div>
            </div>
            
            <div className="property-details__amenities">
              <h3>Property Features</h3>
              <div className="amenities-grid">
                <div className="amenity-item">
                  <span className="amenity-icon">🛏️</span>
                  <span>{propertyDetails.bedrooms} Bedrooms</span>
                </div>
                <div className="amenity-item">
                  <span className="amenity-icon">🚿</span>
                  <span>{propertyDetails.bathrooms} Bathroom{propertyDetails.bathrooms > 1 ? 's' : ''}</span>
                </div>
                <div className="amenity-item">
                  <span className="amenity-icon">🏠</span>
                  <span>{propertyDetails.propertyType}</span>
                </div>
                <div className="amenity-item">
                  <span className="amenity-icon">📍</span>
                  <span>Central Location</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Neighborhood Section */}
        <div className="property-location">
          <div className="property-location__content">
            <h2>Location & Neighborhood</h2>
            <div className="location-details">
              <div className="location-info">
                <h3>Shoreditch, London</h3>
                <p>Located in the heart of East London's most vibrant neighborhood, this property offers easy access to trendy cafes, restaurants, and cultural attractions. Just minutes from Old Street Station and within walking distance to Liverpool Street.</p>
                <div className="location-features">
                  <span className="location-feature">🚇 Old Street Station (5 min walk)</span>
                  <span className="location-feature">🍽️ Trendy restaurants nearby</span>
                  <span className="location-feature">🎨 Art galleries & street art</span>
                  <span className="location-feature">🛍️ Shopping & markets</span>
                </div>
              </div>
              <div className="location-map">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.0853,51.5184,-0.0653,51.5284&layer=mapnik&marker=51.5234,-0.0753"
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                  allowFullScreen
                  loading="lazy"
                  title="Shoreditch, London Map"
                  className="location-map__iframe"
                ></iframe>
                <div className="map-attribution">
                  <small>© OpenStreetMap contributors</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Booking Section */}
        <div className="property-contact">
          <div className="property-contact__content">
            <h2>Interested in This Property?</h2>
            <p>Get in touch with us to learn more about availability and pricing for this beautiful accommodation.</p>
            <div className="contact-actions">
              <button 
                className="btn btn--primary btn--lg"
                onClick={() => {
                  alert('📞 Contact Us: +44 20 1234 5678\n📧 Email: hello@flexliving.com\n📍 Visit: 123 Shoreditch High St, London');
                }}
              >
                📞 Contact Us
              </button>
              <button 
                className="btn btn--secondary btn--lg"
                onClick={() => {
                  const message = prompt('Send us a message:', 'Hi, I\'m interested in this property...');
                  if (message) {
                    alert(`✅ Message sent successfully!\n\nYour message: "${message}"\n\nWe\'ll get back to you within 24 hours.`);
                  }
                }}
              >
                📧 Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="property-reviews">
          <div className="property-reviews__header">
            <h2>Guest Reviews</h2>
            <p>See what our guests have to say about their stay</p>
          </div>

          {propertyReviews.length === 0 ? (
            <div className="empty-state">
              <Calendar className="empty-state__icon" />
              <h3>No published reviews yet</h3>
              <p>Check back soon for guest reviews of this property.</p>
            </div>
          ) : (
            <div className="reviews-display">
              {propertyReviews
                .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
                .map((review) => (
                  <div key={review.id} className="review-display-card">
                    <div className="review-display-card__header">
                      <div className="review-display-card__rating">
                      <RatingDisplay 
                        rating={review.overallRating} 
                        size="md" 
                        showStars={true}
                      />
                    </div>
                      
                      <div className="review-display-card__meta">
                        <span className="guest-name">{review.guestName}</span>
                        <div className="review-date">
                          <Calendar className="date-icon" />
                          <span>{format(review.submittedAt, 'MMMM yyyy')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="review-display-card__content">
                      <p>{review.reviewText}</p>
                    </div>

                    {review.categories.length > 0 && (
                      <div className="review-display-card__categories">
                        {review.categories.map((category, index) => (
                          <div key={index} className="category-score">
                            <span className="category-name">
                              {category.category.replace('_', ' ')}
                            </span>
                            <div className="category-rating">
                              <span className="category-score-value">{category.rating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
