# Firm System Documentation

## Overview

The Firm System is a separate authentication and management platform for furniture manufacturers to access and respond to RFQ (Request for Quote) requests from homeowners and architects.

## Key Features

### 🔐 Separate Authentication System

- **Independent from client authentication** - Uses custom session management
- **Role-based access** - CEO and Employee roles with different permissions
- **Secure sessions** - 8-hour session timeout with httpOnly cookies
- **Password security** - bcrypt hashing with 12 salt rounds

### 🏢 Firm Management

- **Company profiles** - Complete firm information with specialties
- **Manual verification** - Admin approval required before activation
- **Multi-user support** - CEO can create employee accounts
- **Assignment control** - Toggle between CEO-only and free assignment modes

### 📋 RFQ Marketplace

- **Real-time RFQ feed** - All active RFQs with filtering capabilities
- **Advanced filtering** - By location, category, budget, status, and search
- **Status tracking** - New, Viewed, Redeemed, Hidden, Expired
- **Assignment management** - Track which employee handles which RFQ
- **Pagination** - 10 RFQs per page with navigation

## Database Schema

### New Tables Created

#### `firms`

- Company information and verification status
- Specialties array for category matching
- Location data (county, city)
- Verification and activation flags

#### `firm_users`

- CEO and employee accounts
- Separate from main user authentication
- Role-based permissions (CEO/Employee)
- Password hashing and session management

#### `firm_settings`

- Per-firm configuration
- Assignment mode toggle
- Auto-response messages
- Notification preferences

#### `rfq_assignments`

- Tracks firm interaction with RFQs
- Assignment to specific employees
- Status tracking and notes
- Response messages

#### `firm_sessions`

- Custom session management
- Token-based authentication
- Expiration tracking

## API Endpoints

### Authentication

- `POST /api/firm/auth/login` - Firm user login
- `POST /api/firm/auth/logout` - Session cleanup
- `POST /api/firm/register` - New firm registration

### RFQ Management

- `GET /api/firm/rfqs` - Fetch RFQs with filtering and pagination

## Pages Created

### `/firm/login`

- **Purpose**: Secure login for firm users
- **Features**:
  - Email/password authentication
  - Password visibility toggle
  - Error handling
  - Link to registration
  - Clear separation from client portal

### `/firm/register`

- **Purpose**: Multi-step firm registration
- **Features**:
  - 3-step wizard (Firm Info → CEO Account → Agreements)
  - Form validation at each step
  - Progress indicator
  - Specialty selection
  - Terms acceptance
  - Success confirmation

### `/firm/dashboard`

- **Purpose**: Main RFQ marketplace interface
- **Features**:
  - Company header with user info
  - Advanced search and filtering
  - RFQ cards with detailed information
  - Status badges and urgency indicators
  - Pagination
  - Role-based action buttons

## Security Features

### Authentication

- **Separate cookie domain** - `/firm` path restriction
- **Session validation** - Server-side token verification
- **Password requirements** - Minimum 8 characters
- **Role verification** - CEO/Employee permission checks

### Data Protection

- **RLS policies** - Row-level security on all tables
- **Input validation** - Server-side validation for all inputs
- **SQL injection protection** - Parameterized queries
- **XSS prevention** - Input sanitization

## User Roles & Permissions

### CEO

- **Full access** to all firm RFQs
- **Employee management** - Create/manage employee accounts
- **Settings control** - Configure assignment modes and messages
- **Assignment override** - Can assign RFQs to specific employees
- **Analytics access** - View team performance metrics

### Employee

- **Limited access** - Only assigned or available RFQs
- **RFQ interaction** - View details, redeem, hide RFQs
- **Status updates** - Mark RFQs as viewed/redeemed
- **Response messages** - Send custom responses when redeeming

## Workflow

### Firm Registration

1. **Company Information** - Basic firm details and specialties
2. **CEO Account Creation** - Primary user account setup
3. **Agreement Acceptance** - Terms, privacy, verification understanding
4. **Manual Verification** - Admin review (24-48 hours)
5. **Account Activation** - Email notification when approved

### RFQ Management

1. **RFQ Discovery** - Browse filtered marketplace
2. **Detail Review** - View complete RFQ information
3. **Assignment** - CEO assigns or employee claims
4. **Response** - Custom message when redeeming
5. **Status Tracking** - Monitor progress through pipeline

### Assignment Modes

- **CEO Only** - All RFQs must be assigned by CEO
- **CEO + Employees** - Employees can freely claim available RFQs

## Technical Implementation

### Authentication Flow

```typescript
// Login process
1. Validate credentials against firm_users table
2. Create session token in firm_sessions table
3. Set httpOnly cookie with /firm path
4. Return user and firm data

// Session validation
1. Extract token from cookie
2. Verify token in database
3. Check expiration and user status
4. Update last_accessed timestamp
```

### RFQ Filtering

```sql
-- Database function for efficient filtering
get_firm_rfqs(
  firm_id, county, categories, budget_range,
  status, search_term, limit, offset
)
```

### Security Middleware

```typescript
// Route protection
requireFirmAuth(requiredRole?: 'ceo' | 'employee')
```

## Future Enhancements

### Planned Features

- **Real-time notifications** - WebSocket integration for new RFQs
- **Mobile app** - React Native application
- **Analytics dashboard** - Performance metrics and reporting
- **File attachments** - Portfolio and certification uploads
- **Communication system** - Direct messaging with clients
- **Rating system** - Client feedback and firm ratings

### Technical Improvements

- **Email notifications** - SMTP integration for alerts
- **Audit logging** - Track all user actions
- **API rate limiting** - Prevent abuse
- **Caching layer** - Redis for performance
- **Background jobs** - Queue system for heavy operations

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Getting Started

1. **Run database migrations**:

   ```sql
   -- Execute firm-system-tables.sql
   -- Execute firm-system-policies.sql
   ```

2. **Install dependencies**:

   ```bash
   npm install bcryptjs @types/bcryptjs
   ```

3. **Access firm portal**:
   - Registration: `/firm/register`
   - Login: `/firm/login`
   - Dashboard: `/firm/dashboard`

## Support

For technical issues or feature requests, contact the development team. The firm system is designed to be completely independent from the client portal while sharing the same RFQ database for seamless integration.
