import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import assignmentRoutes from './routes/assignments.js';
import pricingRoutes from './routes/pricing.js';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver'; // Import archiver for zipping files
import User from './models/User.js'; // Import User model
import Assignment from './models/Assignment.js'; // Import Assignment model

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define __dirname for ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const UPLOADS_FOLDER = path.join(__dirname, '../uploads'); // Adjusted to point to the uploads folder

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_FOLDER)) {
    fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}

app.use(cors({
    origin: ['http://localhost:5173', 'https://pro-assignment.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(UPLOADS_FOLDER, {
    setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', '*'); // Allow CORS if needed
    }
}));

// Create downloads route for user-specific files
app.get('/download/:userId/:assignmentId', async (req, res) => {
    const userId = req.params.userId; // Get user ID from request parameters
    const assignmentId = req.params.assignmentId; // Get assignment ID from request parameters

    try {
        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Fetch assignment details
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).send('Assignment not found');
        }

        const zipFilename = `${user.name}_${assignment.title}.zip`; // Construct the ZIP filename
        const zipPath = path.join(UPLOADS_FOLDER, zipFilename);

        // Create a zip archive
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            res.download(zipPath, zipFilename, (err) => {
                if (err) {
                    console.error('Download error:', err);
                    res.status(500).send('Error downloading the file');
                }
                // Delete the zip file after sending
                fs.unlinkSync(zipPath);
            });
        });

        archive.on('error', (err) => {
            console.error('Archiver error:', err);
            res.status(500).send('Error creating zip file');
        });

        archive.pipe(output);

        // Add user-specific files to the archive
        fs.readdir(UPLOADS_FOLDER, (err, files) => {
            if (err) {
                console.error('Error reading uploads directory:', err);
                return res.status(500).send('Error reading uploads directory');
            }

            // Filter files based on user ID (assuming files are named like userId_fileName.ext)
            files.forEach(file => {
                if (file.startsWith(`user${userId}_`)) {
                    archive.file(path.join(UPLOADS_FOLDER, file), { name: file });
                }
            });

            archive.finalize();
        });
    } catch (error) {
        console.error('Error in file download:', error);
        res.status(500).send('Error downloading files');
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/pricing', pricingRoutes);


app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});