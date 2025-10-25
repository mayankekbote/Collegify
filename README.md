# EduPath - College Finder Application

A comprehensive college finder application that helps Maharashtra engineering students discover the perfect college based on their MHT-CET percentile, category, and preferences.

## Features

### 🎯 Smart College Matching
- **AI-Powered Recommendations**: Advanced algorithm that matches students with colleges based on percentile, category, region, and branch preferences
- **Real-time College Search**: Dynamic filtering and sorting based on match percentage
- **Detailed College Information**: Complete details including fees, packages, cutoffs, and images

### 🧭 Branch Discovery Quiz
- **Interactive Quiz System**: 8-question comprehensive quiz to discover ideal engineering branch
- **Personalized Results**: Detailed branch recommendations with match percentages
- **Branch Insights**: Complete descriptions and career prospects for each branch

### 👤 User Management
- **Student Registration/Login**: Secure authentication system
- **Profile Management**: Complete profile with MHT-CET scores and preferences
- **Dashboard**: Personalized dashboard with quick actions and quiz history

### ⚙️ Admin Panel
- **College Management**: Full CRUD operations for college data
- **Real-time Updates**: Live data management with search and filter capabilities
- **Bulk Operations**: Efficient management of large college databases

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **Tailwind CSS** with custom animations
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MySQL** database with connection pooling
- **JWT** authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

### Design
- **Glass-morphism UI** with backdrop blur effects
- **Animated Background** with floating elements
- **Responsive Design** for all devices
- **Modern Color Scheme** with gradient effects

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd edupath-college-finder
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE collegify;
USE collegify;
```

#### Create Tables
```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','student') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  mht_cet_cutoff FLOAT DEFAULT NULL,
  other_info JSON DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Quiz results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  answers JSON,
  suggested_branches JSON,
  score FLOAT,
  taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Colleges table (use your existing structure)
-- Make sure your colleges table has these columns:
-- id, college_name, branch, cutoff_percentile, category, region, fees, median_package, image_urls
```

### 4. Environment Configuration
```bash
cd server
cp .env.example .env
```

Edit `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=collegify
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### 5. Create Admin User
```sql
INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin', 'admin@edupath.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- Default password: password (please change in production)
```

### 6. Start Development Server
```bash
npm run dev
```

The application will run on:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Usage Guide

### For Students

1. **Registration**: Sign up with name, email, and password
2. **Profile Setup**: Add MHT-CET percentile and preferences
3. **College Search**: Use the College Finder with your details
4. **Branch Quiz**: Take the quiz to discover ideal engineering branch
5. **Dashboard**: View personalized recommendations and history

### For Admins

1. **Login**: Use admin credentials to access admin panel
2. **College Management**: Add, edit, or delete college information
3. **Data Import**: Bulk manage college data
4. **User Management**: Monitor user activities and profiles

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Colleges
- `GET /api/colleges` - Get all colleges
- `POST /api/colleges/search` - Search colleges with filters
- `POST /api/colleges` - Add new college (Admin)
- `PUT /api/colleges/:id` - Update college (Admin)
- `DELETE /api/colleges/:id` - Delete college (Admin)

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Quiz
- `POST /api/quiz/submit` - Submit quiz results
- `GET /api/quiz/results` - Get user's quiz history

## College Matching Algorithm

The application uses a sophisticated matching algorithm that considers:

1. **Cutoff Match (40% weight)**: Direct comparison with college cutoff
2. **Category Match (30% weight)**: Exact category matching
3. **Region Preference (20% weight)**: Location-based matching
4. **Branch Preference (10% weight)**: Specialization matching

Match scores are calculated and colleges are ranked accordingly.

## Branch Recommendation System

The quiz system maps student responses to engineering branches:

- **Computer Engineering**: Software development, programming focus
- **Electronics & Telecom**: Hardware, circuits, communication systems
- **Civil Engineering**: Construction, infrastructure, structural design
- **Mechanical Engineering**: Manufacturing, automotive, industrial processes
- **Electrical Engineering**: Power systems, electrical machines, automation

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin and student role separation
- **Input Validation**: Server-side validation for all endpoints
- **CORS Protection**: Configured for secure cross-origin requests

## Deployment

### Production Build
```bash
npm run build
```

### Environment Variables (Production)
- Set strong JWT secret
- Configure production database
- Enable HTTPS
- Set proper CORS origins

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and queries:
- Email: support@edupath.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

---

**Designed and Developed with Excellence by Tabish & Team**