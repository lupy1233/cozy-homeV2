# 🏠 Mobilier Personalizat România

A modern Romanian furniture marketplace platform that connects homeowners with custom furniture manufacturers through a Request for Quote (RFQ) system.

## 🌟 Features

### 🔐 Complete Authentication System

- **User Registration** with email verification
- **Secure Login** with password recovery
- **OAuth Integration** (Google & Apple - ready for implementation)
- **Password Reset** flow with token validation
- **Account Type Selection** (Homeowner vs Architect)

### 🏡 Advanced RFQ Creation

- **Home Management System** with detailed location fields
- **Category Selection** with quantity support (Kitchen, Bedroom, Living Room, etc.)
- **Dynamic Questions** that adapt based on selections
- **Kitchen Specialist Questions** with layout-specific measurements
- **File Upload** capabilities for reference images
- **Progress Tracking** throughout the creation process

### 📊 Professional Dashboard

- **Request Management** with status tracking
- **Offer Comparison** tools
- **Integrated Messaging** system
- **Search Functionality** across all tabs
- **Real-time Statistics** and notifications

### 🎨 Modern UI/UX

- **Responsive Design** optimized for all devices
- **Dark Mode Support** with theme switching
- **Romanian Localization** throughout the application
- **Smooth Animations** and transitions
- **Accessibility Features** built-in

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API
- **Authentication**: Custom implementation (ready for backend integration)
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode

## 📁 Project Structure

```
cozy-home/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── dashboard/          # User dashboard
│   │   ├── rfq/               # RFQ creation and management
│   │   ├── login/             # Authentication pages
│   │   ├── register/
│   │   └── ...
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── rfq/              # RFQ-specific components
│   │   └── ...
│   ├── contexts/             # React contexts
│   ├── data/                 # Static data and configurations
│   └── lib/                  # Utility functions
├── public/                   # Static assets
└── ...
```

## 🛠️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/lupy1233/cozyhomeV1.git
   cd cozyhomeV1
   ```

2. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (when implemented)
DATABASE_URL="your_database_url"

# Authentication (when implemented)
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (when implemented)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# File Upload (when implemented)
CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

## 🎯 Current Status

### ✅ Completed Features

- Complete UI/UX design and implementation
- Authentication flow (frontend only)
- RFQ creation wizard with dynamic questions
- Dashboard with search and filtering
- Home management system
- Responsive design with dark mode
- Romanian localization

### 🚧 In Development

- Backend API integration
- Real authentication system
- Database implementation
- File upload to cloud storage
- Real-time messaging
- Manufacturer dashboard

### 📋 Planned Features

- Payment integration
- Advanced search and filtering
- Rating and review system
- Calendar integration
- Mobile app (React Native)
- Admin panel

## 🧪 Testing

### Demo Accounts

For testing purposes, you can use the auto-login feature:

- **Username**: Ion Popescu
- **Email**: ion.popescu@example.com

### Test Data

The application includes comprehensive mock data for:

- Sample RFQ requests
- Manufacturer offers
- Message conversations
- User profiles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: contact@mobilier.ro
- **Phone**: +40 123 456 789
- **Address**: București, România

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Lucide](https://lucide.dev/) for the icon set

---

**Made with ❤️ for the Romanian furniture industry**
