import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    link: String,
    startDate: Date,
    endDate: Date,
    startTime: String,
    endTime: String,
    allDay: Boolean,
    location: String,
    landingPage: Boolean,
    landingPageLink: String,
    image: String,
    video: String,
    emailNotificationSubscribers: Array,
    emailNotification: Boolean,
    addToCalendar: Boolean,
    banner: Boolean,
    bannerContent: String,
    bannerPosition: String,
    bannerPageUrls: Array,
})

const Event = mongoose.model('events', eventSchema)

export default Event