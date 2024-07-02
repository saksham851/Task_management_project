const express = require('express');
const { getTasks, createTask, getTask, updateTask, deleteTask } = require('../Controller/taskController');
const router = express.Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.get('/tasks/:id', getTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

module.exports = router;
