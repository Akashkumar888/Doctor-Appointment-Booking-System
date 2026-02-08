# Admin - Doctor Appointment Booking System

🔗 Live Demo
👤 Patient Frontend

🌐 Live URL:
➡ https://doctor-appointment-booking-system-frontend-vrv5co5a4.vercel.app

🛠 Admin Dashboard

🌐 Live URL:
➡ https://doctor-appointment-booking-system-a-theta.vercel.app

Admin panel for managing doctors, appointments, and system operations with separate doctor portal.

## Overview

The admin application provides two interfaces:

1. **Admin Panel**: System administrators manage doctors, appointments, and platform operations
2. **Doctor Portal**: Doctors manage their profiles, availability, and patient appointments

Both interfaces are built with React and styled with Tailwind CSS.

## Tech Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Routing**: React Router 7.9.3
- **HTTP Client**: Axios 1.12.2
- **Styling**: Tailwind CSS 4.1.13
- **Notifications**: React Toastify 11.0.5
- **State Management**: React Context API
- **Development**: Node.js with npm

## Project Structure

```
admin/
├── src/
│   ├── api/
│   │   └── axios.js                 # Axios API client configuration
│   ├── assets/
│   │   └── assets.js                # Static assets and constants
│   ├── components/
│   │   ├── Navbar.jsx               # Top navigation bar
│   │   └── Sidebar.jsx              # Left sidebar navigation
│   ├── context/
│   │   ├── AdminContext.jsx         # Admin state management
│   │   ├── AppContext.jsx           # Shared app context
│   │   └── DoctorContext.jsx        # Doctor state management
│   ├── pages/
│   │   ├── Login.jsx                # Admin/Doctor login
│   │   ├── Admin/
│   │   │   ├── AddDoctor.jsx        # Add new doctor form
│   │   │   ├── AllAppointments.jsx  # View all appointments
│   │   │   ├── Dashboard.jsx        # Admin dashboard
│   │   │   └── DoctorsList.jsx      # List and manage doctors
│   │   └── Doctor/
│   │       ├── DoctorAppointments.jsx # Doctor's appointments
│   │       ├── DoctorDashBoard.jsx    # Doctor's dashboard
│   │       └── DoctorProfile.jsx      # Doctor's profile
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles
├── public/                          # Static assets
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
├── .env                             # Environment variables
└── vercel.json                      # Vercel deployment config
```

## Installation

### Prerequisites
- Node.js v14+ with npm
- Backend server running on localhost:5000
- Admin credentials set up in database

### Steps

1. Navigate to admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (see Configuration)

4. Start development server:
```bash
npm run dev
```

Admin app runs on `http://localhost:5174`

## Configuration

Create a `.env` file in the admin directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

### Build for Production
```bash
npm run build    # Creates optimized build
npm run preview  # Preview production build locally
```

## Features

### Admin Panel Features

#### Dashboard
- Overview statistics (total doctors, users, appointments)
- Recent appointments list
- Revenue tracking
- System health metrics
- Quick action buttons

#### Doctor Management
**Add Doctor**
- Form to add new doctors
- Input fields: name, email, password, speciality
- Degree, experience, fees input
- Profile image upload
- Address/location setup
- Success notification on completion

**Doctors List**
- Display all doctors in table format
- Doctor details: name, speciality, fees
- Edit doctor information
- Delete doctor from system
- Filter and search functionality
- Sort by various fields

**Edit Doctor**
- Update doctor details
- Modify speciality and fees
- Change availability status
- Update address information
- Save changes with validation

#### Appointment Management
**All Appointments**
- View all system appointments
- Display: patient name, doctor name, date, time
- Appointment status tracking
- Payment status
- Cancellation history
- Filter by date range
- Export/print functionality

#### Admin Login
- Email and password authentication
- Secure session management
- Role-based access control
- Remember me option

### Doctor Portal Features

#### Doctor Login
- Email and password authentication
- Role-based access to doctor features
- Session persistence
- Secure logout

#### Doctor Dashboard
- Overview of personal statistics
- Upcoming appointments
- Appointment requests
- Weekly schedule summary
- Quick stats: total appointments, completed, cancelled

#### Doctor Appointments
- View all personal appointments
- Appointment details: patient name, date, time, contact
- Accept/Reject appointment requests
- Mark appointment as completed
- View appointment history
- Filter and search

#### Doctor Profile
- View personal profile information
- Edit profile details: name, speciality, degree
- Update experience and fees
- Modify availability and address
- Upload/change profile picture
- Update professional information

## State Management

### AdminContext
```javascript
{
  admin: {
    id: String,
    email: String,
    token: String
  },
  doctors: Array,
  appointments: Array,
  statistics: {
    totalDoctors: Number,
    totalAppointments: Number,
    totalRevenue: Number,
    totalUsers: Number
  }
}
```

### DoctorContext
```javascript
{
  doctor: {
    id: String,
    name: String,
    email: String,
    speciality: String,
    fees: Number,
    image: String,
    token: String
  },
  appointments: Array,
  availableSlots: Array,
  statistics: {
    totalAppointments: Number,
    completedAppointments: Number,
    cancelledAppointments: Number
  }
}
```

## Components

### Navbar
- Admin/Doctor branding
- Logout button
- User profile icon
- Notification bell (if implemented)
- Responsive mobile menu

### Sidebar
- Navigation menu
- Dashboard link
- Doctor management (admin only)
- Appointments link
- Profile link
- Settings link
- Logout option
- Collapsible on mobile

## API Integration

### Authentication
```javascript
POST /admin/login
Body: { email, password }
Response: { token, admin }

POST /doctor/login
Body: { email, password }
Response: { token, doctor }

POST /admin/logout
POST /doctor/logout
```

### Admin APIs
```javascript
GET /admin/doctors              # Get all doctors
POST /admin/add-doctor          # Add new doctor
PUT /admin/doctor/:id           # Edit doctor
DELETE /admin/doctor/:id        # Delete doctor
GET /admin/appointments         # Get all appointments
GET /admin/dashboard            # Dashboard stats
```

### Doctor APIs
```javascript
GET /doctor/profile             # Get doctor profile
PUT /doctor/profile             # Update profile
GET /doctor/appointments        # Get doctor's appointments
PUT /doctor/appointment/:id     # Update appointment status
POST /doctor/logout             # Logout
```

## Authentication Flow

### Admin Login
1. Admin enters email and password
2. Frontend sends POST to `/admin/login`
3. Backend verifies credentials
4. Backend returns JWT token
5. Token stored in localStorage
6. Redirects to admin dashboard

### Doctor Login
1. Doctor enters email and password
2. Frontend sends POST to `/doctor/login`
3. Backend verifies credentials
4. Backend returns JWT token
5. Token stored in localStorage
6. Redirects to doctor dashboard

## Styling

### Tailwind CSS
- Responsive design utilities
- Dark/professional color scheme
- Clean table styling
- Form component styling
- Modal and alert styling
- Animation utilities

### Layout
- Sidebar + Main content layout
- Responsive grid system
- Mobile-first approach
- Touch-friendly interface

## Page Descriptions

### Admin Pages

**Login Page**
- Email and password input fields
- Submit button
- Error message display
- "Remember me" checkbox
- Link to help/support

**Dashboard**
- Key metrics cards
- Charts and graphs
- Recent activity section
- Quick action buttons
- System status overview

**Add Doctor**
- Form with validation
- File upload for image
- Address fields
- Success/error notifications
- Cancel button

**Doctors List**
- Table view of all doctors
- Edit and delete buttons
- Search and filter options
- Pagination
- Bulk actions (if implemented)

**All Appointments**
- Appointments table
- Status indicators
- Payment status
- Date and time display
- Filter options

### Doctor Pages

**Doctor Login**
- Same as admin login
- Doctor-specific styling

**Doctor Dashboard**
- Personal statistics
- Upcoming appointments preview
- Schedule overview
- Quick stats

**Doctor Appointments**
- Appointments table/list
- Accept/Reject buttons
- Complete appointment button
- View details option
- Filter by status

**Doctor Profile**
- Profile information display
- Edit form
- Image upload
- Save changes button
- Success notifications

## Error Handling

- Toast notifications for errors
- Form validation messages
- Network error handling
- Graceful error fallbacks
- Error logging

## Performance Optimization

- Code splitting with Vite
- Lazy loading of routes
- Image optimization
- CSS optimization
- Efficient re-renders

## Security Features

- JWT-based authentication
- Role-based access control
- Password hashing on backend
- Secure token storage
- CORS protection
- Input validation

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables
4. Deploy automatically

### Environment Variables
```env
VITE_API_URL=https://your-backend-url.com/api
```

### Live Demo
- **Frontend (Patient)**: https://doctor-appointment-booking-system-frontend-bvsgdjcnn.vercel.app/
- **Admin Panel**: https://doctor-appointment-booking-system-admin-otgdqp0n0.vercel.app/

## Development Tips

### Running in Development Mode
```bash
npm run dev    # Fast refresh with HMR
```

### Code Quality
```bash
npm run lint   # ESLint check
```

### Testing
- Test authentication flows
- Test form submissions
- Test API integration
- Test error handling

## Common Issues & Solutions

### Login Not Working
- Verify backend API URL
- Check credentials
- Clear browser cache/localStorage
- Verify JWT secret on backend

### Cannot Add Doctor
- Check file upload size
- Verify image format
- Check required fields
- Review backend validation

### Appointment Operations Failing
- Verify doctor exists
- Check appointment ID
- Verify backend endpoint
- Check authorization token

### Image Upload Issues
- Check Cloudinary configuration
- Verify file size (max 5MB recommended)
- Check MIME types
- Browser permissions

## Best Practices

### For Admins
- Regularly backup doctor list
- Verify doctor information
- Monitor appointment patterns
- Track system performance

### For Doctors
- Keep profile information updated
- Set accurate availability
- Respond to appointment requests promptly
- Complete appointments on time

## Contributing

1. Create a feature branch
2. Follow code style
3. Test thoroughly before submitting
4. Write clear commit messages
5. Submit pull request

## Available Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint check
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC License

## Support

For issues and questions, create a GitHub issue or contact the development team.

## Future Enhancements

- Advanced analytics and reporting
- Doctor performance metrics
- Patient feedback and ratings
- Automated appointment reminders
- Multi-language support
- Dark mode
- API documentation portal
- Bulk import/export features
- Custom report generation
