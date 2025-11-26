import Task from "../models/task.models"
import Subtask from "../models/subtask.models"
import asynchandler from "../utils/asynchandler"


const CreateTask = asynchandler(async (req,res) => {
    const{title,description,priority,dueDate,subtasks} = req.body
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
export {CreateTask}