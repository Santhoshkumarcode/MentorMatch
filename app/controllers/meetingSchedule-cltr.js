import Meeting from "../models/meeting-schedule-model.js";
import _ from "lodash"

const meeting = {}

meeting.requestMeeting = async (req, res) => {
    const body = req.body
    try {
        const meeting = new Meeting(body)
        meeting.menteeId = req.currentUser.userId
        await meeting.save()
        return res.status(201).json(meeting)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

meeting.respondToRequest = async (req, res) => {
    // const { mentorId } = req.query
    // console.log(mentorId)
    const mentorId = req.params.mentorId
    try {
        const meetings = await Meeting
            .find({ mentorId: mentorId, status: "pending" })
            .populate('mentorId')
            .populate('menteeId')
        if (meetings.length === 0) {
            return res.status(404).json("Meeting not found for this mentor")
        }
        return res.status(200).json(meetings)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}
meeting.getacceptedStudents = async (req, res) => {
    // const { mentorId } = req.query
    // console.log(mentorId)
    const mentorId = req.params.mentorId
    try {
        const meetings = await Meeting
            .find({ mentorId: mentorId, status: "scheduled" })
            .populate('mentorId')
            .populate('menteeId')
        if (meetings.length === 0) {
            return res.status(404).json("No scheduled for you")
        }
        return res.status(200).json(meetings)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

meeting.statusUpdate = async (req, res) => {
    const id = req.params.meetingId
    const body = req.body

    if (body.dates && Array.isArray(body.dates)) {
        body.dates = body.dates.map(date => new Date(date));
    }

    try {
        const meeting = await Meeting.findByIdAndUpdate(id, body, { runValidators: true, new: true })
        if (!meeting) {
            return res.status(404).json('no meeting scheduled')
        }
        return res.status(200).json(meeting)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

meeting.updateMeeting = async (req, res) => {
    const { meetingId, form } = req.body;

    try {
        // Convert date strings to Date objects if they are strings
        if (form.dates && Array.isArray(form.dates)) {
            form.dates = form.dates.map(date => new Date(date));
        }

        const meeting = await Meeting.findByIdAndUpdate(meetingId, form, { runValidators: true, new: true });

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        return res.status(200).json(meeting);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error", error: err });
    }
}


meeting.getMeetingDetails = async (req, res) => {
    const id = req.params.meetingId
    try {
        const meeting = await Meeting.findById(id)
        if (!meeting) {
            return res.status(404).json('Meeting not found')
        }
        return res.status(200).json(meeting)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

meeting.deleteMeeting = async (req, res) => {
    const id = req.params.meetingId
    try {
        const meeting = await Meeting.findByIdAndDelete(id)
        if (!meeting) {
            return res.status(404).json('Meeting not found')
        }
        return res.status(200).json(meeting)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

meeting.getBookingsOfMentee = async (req, res) => {
    const id = req.params.menteeId
    try {
        const meeting = await Meeting.find({ menteeId: id })
        if (meeting.length === 0) {
            return res.status(404).json("No booking available")
        }
        return res.status(200).json(meeting)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

meeting.getMeetingDates = async (req, res) => {
    const mentorId = req.params.mentorId
    try {
        const meetings = await Meeting.find({ mentorId: mentorId }).populate('menteeId').populate('mentorId')
        const events = meetings.map(meeting => {
            return meeting.dates.map(date => ({
                title: meeting.menteeId,
                start: new Date(date)
            }));
        }).flat();

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch meetings" });
    }
}


export default meeting