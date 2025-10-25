const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'soham@305',
  database: process.env.DB_NAME || 'collegify',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
}

testConnection();

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'student']
    );

    const userId = result.insertId;

    // Create student record
    await pool.execute(
      'INSERT INTO students (user_id) VALUES (?)',
      [userId]
    );

    // Generate token
    const token = jwt.sign({ id: userId, email, role: 'student' }, JWT_SECRET);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email, role: 'student' }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// College routes
app.get('/api/colleges', async (req, res) => {
  try {
    const [colleges] = await pool.execute(
      'SELECT * FROM colleges ORDER BY college_name, branch'
    );
    res.json(colleges);
  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/colleges/:id', async (req, res) => {
  try {
    const [colleges] = await pool.execute(
      'SELECT * FROM colleges WHERE id = ?',
      [req.params.id]
    );

    if (colleges.length === 0) {
      return res.status(404).json({ message: 'College not found' });
    }

    res.json(colleges[0]);
  } catch (error) {
    console.error('Get college error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/colleges/search', async (req, res) => {
  try {
    // incoming payload
    const { percentile = 0, category = '', region = '', branch = '' } = req.body;

    // validation
    if (!percentile || isNaN(percentile)) {
      return res.status(400).json({ message: 'Percentile is required and must be a number' });
    }

    // base query: show colleges where user is eligible (cutoff <= user percentile)
    let query = 'SELECT * FROM colleges WHERE cutoff_percentile <= ?';
    const params = [percentile];

    // category filter (only if provided and not empty)
    if (category && category.trim() !== '') {
      // use case-insensitive comparison
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category.trim());
    }

    // region filter (only if provided)
    if (region && region.trim() !== '') {
      query += ' AND LOWER(region) = LOWER(?)';
      params.push(region.trim());
    }

    // branch filter (only if provided)
    if (branch && branch.trim() !== '') {
      query += ' AND LOWER(branch) = LOWER(?)';
      params.push(branch.trim());
    }

    // final ordering: prefer colleges with higher cutoffs (stronger colleges) and then by name
    query += ' ORDER BY cutoff_percentile DESC, college_name ASC';

    // DEBUG: log to server console so you can check what actually ran
    console.log('College search query:', query);
    console.log('Params:', params);

    const [colleges] = await pool.execute(query, params);
    res.json(colleges);
  } catch (error) {
    console.error('Search colleges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/colleges', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      college_name,
      branch,
      cutoff_percentile,
      category,
      region,
      fees,
      median_package,
      image_urls
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO colleges 
       (college_name, branch, cutoff_percentile, category, region, fees, median_package, image_urls) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [college_name, branch, cutoff_percentile, category, region, fees, median_package, image_urls]
    );

    res.status(201).json({
      message: 'College added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Add college error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/colleges/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      college_name,
      branch,
      cutoff_percentile,
      category,
      region,
      fees,
      median_package,
      image_urls
    } = req.body;

    await pool.execute(
      `UPDATE colleges SET 
       college_name = ?, branch = ?, cutoff_percentile = ?, category = ?, 
       region = ?, fees = ?, median_package = ?, image_urls = ?
       WHERE id = ?`,
      [college_name, branch, cutoff_percentile, category, region, fees, median_package, image_urls, req.params.id]
    );

    res.json({ message: 'College updated successfully' });
  } catch (error) {
    console.error('Update college error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/colleges/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM colleges WHERE id = ?', [req.params.id]);
    res.json({ message: 'College deleted successfully' });
  } catch (error) {
    console.error('Delete college error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User profile routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Get student data if user is a student
    if (user.role === 'student') {
      const [students] = await pool.execute(
        'SELECT * FROM students WHERE user_id = ?',
        [user.id]
      );
      
      if (students.length > 0) {
        user.student = students[0];
      }
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { name, student } = req.body;

    // Update user table
    await pool.execute(
      'UPDATE users SET name = ? WHERE id = ?',
      [name, req.user.id]
    );

    // Update student table if user is a student
    if (req.user.role === 'student' && student) {
      const {
        mht_cet_cutoff,
        category,
        preferred_region,
        preferred_branch,
        additional_info
      } = student;

      // Check if student record exists
      const [existingStudent] = await pool.execute(
        'SELECT id FROM students WHERE user_id = ?',
        [req.user.id]
      );

      const otherInfo = JSON.stringify({
        category,
        preferred_region,
        preferred_branch,
        additional_info
      });

      if (existingStudent.length > 0) {
        await pool.execute(
          'UPDATE students SET mht_cet_cutoff = ?, other_info = ? WHERE user_id = ?',
          [mht_cet_cutoff, otherInfo, req.user.id]
        );
      } else {
        await pool.execute(
          'INSERT INTO students (user_id, mht_cet_cutoff, other_info) VALUES (?, ?, ?)',
          [req.user.id, mht_cet_cutoff, otherInfo]
        );
      }
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Quiz routes
app.post('/api/quiz/submit', authenticateToken, async (req, res) => {
  try {
    const { answers, suggested_branches, score } = req.body;

    await pool.execute(
      'INSERT INTO quiz_results (user_id, answers, suggested_branches, score) VALUES (?, ?, ?, ?)',
      [req.user.id, JSON.stringify(answers), suggested_branches, score]
    );

    res.json({ message: 'Quiz results saved successfully' });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/quiz/results', authenticateToken, async (req, res) => {
  try {
    const [results] = await pool.execute(
      'SELECT * FROM quiz_results WHERE user_id = ? ORDER BY taken_at DESC',
      [req.user.id]
    );

    res.json(results);
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EduPath API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});