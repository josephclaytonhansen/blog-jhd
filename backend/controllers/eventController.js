import asyncHandler from "../middleware/asyncHandler.js"
import Event from "../models/event.js"

const getEvents = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send('Not authorized')
    }
    const events = await Event.find({})
    res.json(events)
})
const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
    if (event) {
        res.json(event)
    } else {
        res.status(404).send('Event not found')
    }
})
const createEvent = asyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'user' || req.user.role === 'unverified-user') {
            return res.status(403).send('Not authorized')
        } else {
            const event = new Event({
                title: req.body.title,
                description: req.body.description,
                link: req.body.link,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                allDay: req.body.allDay,
                location: req.body.location,
                landingPage: req.body.landingPage,
                landingPageLink: req.body.landingPageLink,
                image: req.body.image,
                video: req.body.video,
                emailNotificationSubscribers: [],
                emailNotification: req.body.emailNotification,
                addToCalendar: req.body.addToCalendar,
            })
            await event.save()
            res.json(event)
        }
    } else {
        return res.status(403).send('Not authorized')
    }
})
const updateEvent = asyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'user' || req.user.role === 'unverified-user') {
            return res.status(403).send('Not authorized')
        } else {
            const event = await Event.findById(req.params.id)
            if (event) {
                event.title = req.body.title || event.title
                event.description = req.body.description || event.description
                event.link = req.body.link || event.link
                event.startDate = req.body.startDate || event.startDate
                event.endDate = req.body.endDate || event.endDate
                event.startTime = req.body.startTime || event.startTime
                event.endTime = req.body.endTime || event.endTime
                event.allDay = req.body.allDay || event.allDay
                event.location = req.body.location || event.location
                event.landingPage = req.body.landingPage || event.landingPage
                event.landingPageLink = req.body.landingPageLink || event.landingPageLink
                event.image = req.body.image || event.image
                event.video = req.body.video || event.video
                event.emailNotification = req.body.emailNotification || event.emailNotification
                event.addToCalendar = req.body.addToCalendar || event.addToCalendar
                await event.save()
                res.json(event)
            } else {
                res.status(404).send('Event not found')
            }
        }
    } else {
        return res.status(403).send('Not authorized')
    }
})
const deleteEvent = asyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'user' || req.user.role === 'unverified-user') {
            return res.status(403).send('Not authorized')
        } else {
            const event = await Event.findById(req.params.id)
            if (event) {
                await event.remove()
                res.json({ message: 'Event removed' })
            } else {
                res.status(404).send('Event not found')
            }
        }
    } else {
        return res.status(403).send('Not authorized')
    }
})
const getEventsByDate = asyncHandler(async (req, res) => {
    const events = await Event.find({
        startDate: {
            $gte: req.query.startDate,
            $lt: req.query.endDate
        }
    })
    res.json(events)
})
const bannerEvent = asyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'user' || req.user.role === 'unverified-user') {
            return res.status(403).send('Not authorized')
        } else {
            const event = await Event.findById(req.params.id)
            if (event) {
                event.banner = req.body.banner
                event.bannerContent = req.body.bannerContent
                event.bannerPosition = req.body.bannerPosition
                event.bannerPageUrls = req.body.bannerPageUrls
                await event.save()
                res.json(event)
            } else {
                res.status(404).send('Event not found')
            }
        }
    } else {
        return res.status(403).send('Not authorized')
    }
})

export {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
    bannerEvent
}