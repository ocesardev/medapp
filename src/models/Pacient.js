import mongoose from "mongoose";

const Schema = mongoose.Schema;

const pacientSchema = new Schema ({
    name: {
        type: String,
        required: [true, 'Pacient name is required']
    },
    birthDate: {
        type: Date,
        required: [true, 'Pacient BirthDate is required.']
    },
    email: {
        type: String,
        required: [true, 'E-mail is required.'],
        unique: true,
        validate: {
            validator: function (v) {
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required.'],
        validate: {
            validator: function (v) {
                return /\d{2} 9\d{4}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number. Please use the following format 99 91234-4567 `
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const pacient = mongoose.model('Pacient', pacientSchema);

export default pacient;