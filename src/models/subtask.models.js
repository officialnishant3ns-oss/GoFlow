import mongoose from "mongoose"

const subtaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },

        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        }
    },
    { timestamps: true }
);

const Subtask = mongoose.model("Subtask", subtaskSchema)
export default Subtask