import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent, getEventById } from '../controllers/eventController.js';

const router = express.Router();

router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);



export default router;