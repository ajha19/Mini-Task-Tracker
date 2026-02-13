import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description: string;
    status: 'pending' | 'completed';
    dueDate: Date;
    owner: mongoose.Schema.Types.ObjectId;
}

const TaskSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
        dueDate: { type: Date },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    },
    { timestamps: true }
);

// Index for faster queries on owner and status
TaskSchema.index({ owner: 1, status: 1 });

const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;
