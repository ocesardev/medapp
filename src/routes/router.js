import express from "express";
import appointmentController from "./AppointmentController.js";
import doctorController from "./DoctorController.js";
import pacientController from "./PacientController.js";
import prescriptionController from "./PrescriptionController.js";
import doctorService from "../services/DoctorService.js";
import bycript from 'bcrypt';
import verifyToken from "../midleware/authMiddleware.js";
import jwt from 'jsonwebtoken'

let router = express.Router();

router.get(
    '/', function(req, res) {
        console.log('Hello!');
        res.status(200).json({ message: 'Hello!' });
    }
);

// login
router.post('/login', async (req, res) => {
   try {
    const { login, password } = req.body;
    const doctor = await doctorService.getDoctorByLogin(login);
    if (!doctor) {
        return res.status(404).json({error: 'Authentication failed.'});
    }

    const passwordMatch = await bycript.compare(password, doctor.password);
    if (!passwordMatch) {
        return res.status(404).json({error: 'Authentication failed.'});
    }

    const token = jwt.sign({doctorId: doctor._id}, 'you-secret-key', {expiresIn: '1h'});
    res.status(200).json({token});
    
   } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Login failed!'});
   } 
});

router.use("/", verifyToken, appointmentController);
router.use("/", verifyToken, doctorController);
router.use("/", verifyToken, pacientController);
router.use("/", verifyToken, prescriptionController);

export default router;