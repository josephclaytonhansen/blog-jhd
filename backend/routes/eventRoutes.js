import express from 'express'

import {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
    bannerEvent
} from '../controllers/eventController.js'

const router = express.Router()

router.get('/', getEvents)
router.get('/:id', getEventById)
router.post('/create', createEvent)
router.put('/edit/:id', updateEvent)
router.delete('/delete/:id', deleteEvent)
router.post('/date', getEventsByDate)
router.put('/banner/:id', bannerEvent)

export default router