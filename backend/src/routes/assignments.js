import express from 'express';
import multer from 'multer';
import path from 'path';
import Assignment from '../models/Assignment.js';
import auth from '../middleware/auth.js';
import fs from 'fs';

const router = express.Router();

// Function to get the directory name in ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'));
    }
  }
});

// Create assignment
router.post('/', auth, upload.fields([
  { name: 'assignmentFile', maxCount: 1 },
  { name: 'answerKeyFile', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Files received:', req.files); // Log the received files
    const { title, description, price } = req.body;

    // Check if files are present
    if (!req.files.assignmentFile || !req.files.answerKeyFile) {
      return res.status(400).json({ message: 'Both assignment file and answer key file are required.' });
    }

    const assignment = new Assignment({
      user: req.user.id,
      title,
      description,
      price,
      assignmentFile: req.files.assignmentFile[0].path,
      answerKeyFile: req.files.answerKeyFile[0].path
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all assignments (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const assignments = await Assignment.find().populate('user', 'name email phone address');
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user assignments
router.get('/my', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user.id });
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update assignment status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.body;
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete assignment
router.delete('/:id', auth, async (req, res) => {
  try {
    const assignmentId = req.params.id;

    // Find the assignment in the database
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Delete the assignment from the database first
    await Assignment.findByIdAndDelete(assignmentId);

    // Array to hold file paths for deletion
    const filesToDelete = [];

    // Check if assignmentFile exists
    if (assignment.assignmentFile) {
      const assignmentFilePath = path.join(__dirname, '../', assignment.assignmentFile);
      filesToDelete.push(assignmentFilePath);
    } else {
      console.warn(`No assignment file associated with assignment ID ${assignmentId}.`);
    }

    // Check if answerKeyFile exists
    if (assignment.answerKeyFile) {
      const answerKeyFilePath = path.join(__dirname, '../', assignment.answerKeyFile);
      filesToDelete.push(answerKeyFilePath);
    } else {
      console.warn(`No answer key file associated with assignment ID ${assignmentId}.`);
    }

    // Delete files from the filesystem
    filesToDelete.forEach((filePath) => {
      deleteFile(filePath);
    });

    res.status(200).json({ message: 'Assignment and associated files deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ message: 'Failed to delete assignment' });
  }
});

const deleteFile = (filePath) => {
  // Check if the file exists before attempting to delete
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
      } else {
        console.log(`File deleted: ${filePath}`);
      }
    });
  } else {
    console.warn(`File not found: ${filePath}`);
  }
};

export default router;