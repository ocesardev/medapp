import mongoose from "mongoose";

const Schema = mongoose.Schema;

const appointmentSchema = new Schema ({
    date: {
        type: Date,
        required: [true, 'Appointment date is required.']
    },
    doctorId: {
        type: String,
        required: [true, 'DoctorID is required.'],
        validate: {
            validator: async function (v) {
                if (!mongoose.Types.ObjectId.isValid(v)) return false;
                const exists = await mongoose.model("Doctor").exists({ _id: v });
                return !!exists;
            },
            message: props => `DoctorID ${props.value} not found.`
        }
    },
    pacientId: {
        type: String,
        required: [true, 'PacientID is required.'],
        validate: {
            validator: async function (v) {
                if (!mongoose.Types.ObjectId.isValid(v)) return false;
                const exists = await mongoose.model("Pacient").exists({ _id: v });
                return !!exists;
            },
            message: props => `PacientID ${props.value} not found.`
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const appointment = mongoose.model('Appointment', appointmentSchema);

export default appointment;