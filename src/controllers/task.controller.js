import Task from "../models/task.models"
import Subtask from "../models/subtask.models"
import asynchandler from "../utils/asynchandler"


const CreateTask = asynchandler(async (req, res) => {
    const { title, description, priority, dueDate, subtasks } = req.body
    if (!title) {
        throw new apierror(400, "Title is required");
    }
    const newtask = await Task.create({
        description: description || "",
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        owner: req.user._id,
        subtasks: Array.isArray(subtasks) ? subtasks : []
    })

    return res.status(201).json(
        new apiresponse(200, newtask, "Task created successfully")
    )
})

const updatetask = asynchandler(async (req, res) => {

    const { TaskId } = req.params
    if (!TaskId) {
        return res.status(400).json({ message: "TaskId is required" })
    }

    const task = await Task.findById(TaskId);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    let updatedData = { ...req.body }

      await task.save();

    return res.status(200).json(
        new apiresponse(200, task, "Task updated successfully")
    )
})
export { CreateTask, updatetask }