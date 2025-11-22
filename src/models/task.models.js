import mongoose from "mongoose"

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        dueDate: {
            type: Date,
            default: null,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subtasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subtask",
            }
        ],
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema)
export default Task
