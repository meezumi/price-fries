# PriceFries - Product Price Tracker

PriceFries is a Next.js-based web application that helps users track product prices, compare items, and receive alerts when prices drop. Built with modern technologies for a seamless shopping experience.

## Features

### Core Features
- **Product Tracking**: Search and track Amazon products with real-time price updates
- **Price Comparison**: Compare up to 4 products side-by-side (responsive table on desktop, card layout on mobile)
- **Watched Products**: Mark products to track later with price notifications
- **User Authentication**: Email-based JWT authentication with 7-day token expiry
- **User Profile**: Manage account settings, change password, and delete account
- **Price History**: View complete price history for tracked products
- **Responsive Design**: Fully mobile-responsive with hamburger menu on mobile devices

### Recent Enhancements (Mobile Responsiveness)
- **Hamburger Menu**: Mobile navigation menu with fixed positioning for easy access
- **Responsive Grid Layout**: Products display in 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop) → 4 columns (large screens)
- **Mobile-Friendly Comparison**: Card-based layout for product comparison on mobile, table view on desktop
- **Responsive Product Details**: Product titles, prices, and buttons scale appropriately across all screen sizes
- **Similar Products Grid**: Responsive grid layout for related products on product detail pages
- **Viewport Meta Configuration**: Proper mobile scaling and viewport settings

### Quick Win Features
1. **Sorting**: Sort products by price (low-high, high-low), newest, or trending
2. **User Profile Page**: View and manage profile information, change password, delete account
3. **Watched Products**: Track products and receive price drop notifications
4. **Product Comparison**: Side-by-side comparison of up to 4 products
5. **Better Error Messages**: Improved email error handling with clear user feedback
6. **Loading Skeletons**: Beautiful loading states for dashboard and data-heavy pages
7. **Product Deletion**: Remove tracked products with confirmation modal
8. **Page Transitions**: Smooth fade animations between pages
9. **Footer Attribution**: Credits and branding

## Tech Stack

- **Frontend**: Next.js 13+ (App Router, Server/Client Components)
- **Styling**: Tailwind CSS with responsive utilities
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (HttpOnly cookies, email-based, 7-day expiry)
- **Email Service**: Resend API
- **Web Scraping**: Custom scraper for Amazon product data
- **Hosting**: Vercel deployment ready

## Project Structure

```
app/
├── page.tsx                    # Home page with product grid
├── layout.tsx                  # Root layout with viewport meta
├── products/[id]/page.tsx     # Product detail page
├── compare/page.tsx            # Product comparison page
├── dashboard/page.tsx          # User dashboard with tracked products
├── profile/page.tsx            # User profile management
├── auth/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── verify/page.tsx
└── api/                        # API routes

components/
├── Navbar.tsx                  # Navigation with hamburger menu on mobile
├── MobileMenu.tsx              # Mobile hamburger menu (fixed positioning)
├── Searchbar.tsx              # Product search
├── ProductCard.tsx             # Reusable product card
├── PriceInfoCard.tsx          # Price information card
├── HeroCarousel.tsx           # Hero section carousel
├── Modal.tsx                   # Reusable modal component
├── DeleteProductButton.tsx     # Product deletion with confirmation
├── PageTransition.tsx          # Page fade animation
├── Footer.tsx                  # Footer with attribution
├── Loaders.tsx                 # Loading skeletons

lib/
├── actions/index.ts            # Server-side data fetching
├── utils.ts                    # Utility functions
├── mongoose.ts                 # Database connection
├── models/product.model.ts     # Product schema
├── scraper/index.ts            # Web scraping logic
└── nodemailer/index.ts         # Email configuration

types/
└── index.ts                    # TypeScript type definitions
```

## Responsive Breakpoints

- **Mobile**: < 640px (1 column products, hamburger menu)
- **Tablet**: 640px - 1024px (2 columns products)
- **Desktop**: 1024px - 1280px (3 columns products)
- **Large Desktop**: > 1280px (4 columns products)

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MongoDB connection string
- Resend API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd price-fries
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
MONGODB_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Components

### MobileMenu (`components/MobileMenu.tsx`)
Fixed-position hamburger menu that displays on screens < 640px with:
- Compare link with badge count
- User email display (if authenticated)
- Settings/Profile link
- Login/Register or Logout options
- Dynamic positioning relative to navbar
- Backdrop overlay for closing

### Product Grid (`app/page.tsx`)
CSS Grid layout that adapts to screen size:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Large: 4 columns

### Comparison Page (`app/compare/page.tsx`)
Dual layout system:
- Desktop (md+): Table layout for side-by-side comparison
- Mobile (<md): Card layout showing each product's details

### Product Details (`app/products/[id]/page.tsx`)
Full-width title section with:
- Responsive product title
- Action buttons (Add to Cart, Bookmark, Share)
- Price information with discount display
- Related products in responsive grid

## Testing

### Mobile Responsiveness Testing Guide

See [RESPONSIVE_TESTING_GUIDE.md](./RESPONSIVE_TESTING_GUIDE.md) for comprehensive testing checklist:
- Screen size reference table (320px - 1536px+)
- Page-by-page testing checklist
- Responsive utilities reference
- Debugging tips

### Browser Testing
Use DevTools (F12 → Ctrl+Shift+M) to test:
- iPhone SE (320px)
- iPhone 12 (375px)
- Galaxy S10 (425px)
- iPad Mini (640px)
- iPad (768px)
- iPad Pro (1024px)

## Authentication Flow

1. User registers with email
2. Verification token sent via Resend API
3. User verifies email
4. JWT token generated (7-day expiry)
5. Token stored in HttpOnly cookie
6. Protected routes redirect unauthenticated users

## Database Models

### User
- Email (unique)
- Password (hashed)
- Watched products
- Account creation date

### Product
- Amazon product ID
- Title, description
- Current and original price
- Category
- Image URL
- Discount percentage

### VerificationToken
- Email
- Token
- Expiry date

## Deployment

### Deploy on Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

```bash
vercel deploy
```

## Future Enhancements

- [ ] Multi-platform product tracking (not just Amazon)
- [ ] Price drop notifications via email
- [ ] Browser extension for quick product tracking
- [ ] Advanced analytics and price trends
- [ ] Wishlist sharing with friends
- [ ] Mobile app (React Native)
- [ ] Real-time price alerts with WebSocket

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT Authentication](https://jwt.io/)
- [Resend Email API](https://resend.com/)

## License

This project is open source and available under the MIT License.

## Support

For issues and feature requests, please open an issue on GitHub or contact the development team.

