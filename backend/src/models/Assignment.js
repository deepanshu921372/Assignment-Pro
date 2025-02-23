import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  assignmentFile: {
    type: String,
    required: true
  },
  answerKeyFile: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Assignment', assignmentSchema);