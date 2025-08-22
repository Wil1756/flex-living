# Flex Living - Reviews Dashboard


🚀 **Live Demo:** [https://flex-living-fawn.vercel.app/dashboard](https://flex-living-fawn.vercel.app/dashboard)


A comprehensive reviews management dashboard for Flex Living properties, enabling managers to assess property performance based on guest reviews from multiple channels.

## 🚀 Features

### Manager Dashboard
- **Property Performance Overview**: Visual cards showing key metrics for each property
- **Advanced Filtering**: Filter reviews by rating, category, channel, status, property, and date range
- **Review Management**: Select/deselect reviews for public display
- **Sorting Options**: Sort by date, rating, guest name, or property
- **Real-time Analytics**: Live performance metrics and trend indicators

### Public Review Display
- **Property-specific Pages**: Dedicated pages for each property showing selected reviews
- **Flex Living Design**: Consistent styling matching the Flex Living brand
- **Review Showcase**: Clean, modern display of approved guest reviews
- **Responsive Design**: Mobile-first approach ensuring great UX across devices

### Multi-channel Integration
- **Hostaway API**: Full integration with normalized review data
- **Google Reviews**: Explored integration with documented limitations
- **Extensible Architecture**: Ready for additional review sources

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **React Router** for client-side routing
- **React Context API** for state management
- **CSS Custom Properties** for consistent theming
- **Lucide React** for modern icons
- **date-fns** for date formatting and manipulation

### Data Layer
- **Hostaway API Integration** with mock data fallback
- **Google Places API** research and implementation guidelines
- **Normalized Data Models** for consistent cross-platform handling
- **Service Layer Architecture** for clean separation of concerns

### Development Tools
- **Create React App** for project scaffolding
- **TypeScript** for enhanced developer experience
- **ESLint** for code quality
- **CSS Modules** approach for component styling

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx           # Main dashboard container
│   │   ├── DashboardHeader.tsx     # Header with stats and actions
│   │   ├── PropertyPerformance.tsx # Property overview cards
│   │   ├── ReviewFilters.tsx       # Advanced filtering component
│   │   ├── ReviewsList.tsx         # Sortable reviews list
│   │   └── Dashboard.css           # Dashboard-specific styles
│   ├── PropertyPage/
│   │   ├── PropertyPage.tsx        # Public property review display
│   │   └── PropertyPage.css        # Property page styles
│   └── common/
│       ├── LoadingSpinner.tsx      # Reusable loading component
│       └── ErrorMessage.tsx        # Error display component
├── contexts/
│   └── ReviewsContext.tsx          # Global state management
├── services/
│   ├── api.ts                      # Main API service layer
│   ├── hostaway.ts                 # Hostaway integration
│   └── google.ts                   # Google Reviews exploration
├── types/
│   └── review.ts                   # TypeScript type definitions
└── App.tsx                         # Main application component
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Flex Living"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Dashboard: http://localhost:3000/dashboard
   - Property Pages: http://localhost:3000/property/{propertyId}

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - Run ESLint

## 🔌 API Integration

### Hostaway Reviews API

**Endpoint**: `GET /api/reviews/hostaway`

**Implementation**: 
- Full integration with mock data fallback
- Handles API authentication and rate limiting
- Normalizes response data to internal format
- Error handling and retry logic

**Sample Response**:
```json
{
  "status": "success",
  "result": [
    {
      "id": 7453,
      "type": "host-to-guest",
      "status": "published",
      "rating": null,
      "publicReview": "Shane and family are wonderful! Would definitely host again :)",
      "reviewCategory": [
        {
          "category": "cleanliness",
          "rating": 10
        }
      ],
      "submittedAt": "2020-08-21 22:45:14",
      "guestName": "Shane Finkelstein",
      "listingName": "2B N1 A - 29 Shoreditch Heights"
    }
  ]
}
```

### Google Reviews Integration

**Status**: ⚠️ **Limited Implementation**

**Key Findings**:

#### Limitations
1. **Text Restrictions**: Google Places API only provides ~200 characters per review
2. **Review Count**: Maximum 5 most recent reviews per location
3. **No Categories**: No category-specific ratings available
4. **Rate Limiting**: 100 requests per 100 seconds per user
5. **Business Verification**: Full reviews require Google My Business API access

#### Alternative Solutions
1. **Google My Business API** (Recommended)
   - Requires business owner verification
   - Provides full review text and business insights
   - Better rate limits and data quality

2. **Third-party Services**
   - ReviewTrackers, Podium, BirdEye
   - Aggregate multiple review sources
   - Professional review management features

3. **Direct Integration**
   - Google Business Profile integration
   - Manual review collection workflows

#### Implementation
```typescript
// Google Reviews Service (limited)
const googleService = new GoogleReviewsService();
const reviews = await googleService.getPropertyReviews(propertyName);

// Integration status
const integrationInfo = googleService.getIntegrationInfo();
console.log(integrationInfo.limitations);
```

**Recommendation**: For production use, implement Google My Business API integration or partner with a dedicated review management platform.

## 🎨 Design System

### Color Palette
```css
:root {
  --primary-color: #2563eb;     /* Primary blue */
  --primary-hover: #1d4ed8;     /* Darker blue for interactions */
  --secondary-color: #64748b;   /* Secondary gray */
  --success-color: #10b981;     /* Success green */
  --warning-color: #f59e0b;     /* Warning orange */
  --error-color: #ef4444;       /* Error red */
  --background-color: #f8fafc;  /* Light background */
  --surface-color: #ffffff;     /* Card/surface white */
  --border-color: #e2e8f0;      /* Border gray */
  --text-primary: #1e293b;      /* Primary text */
  --text-secondary: #64748b;    /* Secondary text */
  --text-muted: #94a3b8;        /* Muted text */
}
```

### Typography Scale
- **H1**: 2.25rem (36px) - Page titles
- **H2**: 1.875rem (30px) - Section headers
- **H3**: 1.5rem (24px) - Subsection headers
- **H4**: 1.25rem (20px) - Card titles
- **Body**: 1rem (16px) - Default text
- **Small**: 0.875rem (14px) - Secondary text


## 🧪 Testing Strategy

### Unit Tests
- Component rendering and behavior
- Service layer functionality
- Data normalization logic
- Error handling scenarios

### Integration Tests
- API integration workflows
- State management operations
- User interaction flows
- Cross-component communication

### E2E Tests
- Complete user workflows
- Dashboard navigation
- Review selection process
- Property page display

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
REACT_APP_HOSTAWAY_API_KEY=your_api_key_here
REACT_APP_HOSTAWAY_ACCOUNT_ID=61148
REACT_APP_GOOGLE_PLACES_API_KEY=your_google_api_key_here
```

### Deployment Options
- **Vercel** (Recommended)

## 📄 License

This project is proprietary software developed for Flex Living. All rights reserved.

---

**Built with ❤️ for Flex Living property management**
