const express = require('express');
const mongoose = require('mongoose');
const ServicesModel = require('./channelSchema/servicesSchema');
const VolunteerModel = require('./channelSchema/volunteerSchema')
const bodyParser = require('body-parser');
const cors = require("cors");
const admin = require('firebase-admin');
// const volunteerNetwork = require('./configs/volunteer-network-socialworks-firebase-adminsdk-81dab-90c1668275.json');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


console.log(process.env.DB_PASSWORD)

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

app.use(express.static("public"));
app.use(express.json());


// admin.initializeApp({
//     credential: admin.credential.cert(volunteerNetwork)
// });



const URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wtre2xr.mongodb.net/${process.env.DB_MONGONAME}?retryWrites=true&w=majority`
const connectingParams = { useNewUrlParser: true, useUnifiedTopology: true };

//connect with mongodb...
mongoose
    .connect(URL, connectingParams)
    .then(() => console.log('connecting successfully'))
    .catch((err) => ('not connecting', err))


// 1. add new volunteer event in home component from admin panel....
app.post('/addEvent', async (req, res) => {
    console.log(req.body)
    try {
        let servicesModel = new ServicesModel(req.body);
        const result = await servicesModel.save({})
        res.status(200).send(result)
    }
    catch (err) {
        res.status(500).send(err)
    }
});


// 2. load all volunteer events in home page....
app.get('/getEvents', async (req, res) => {
    try {
        const services = await ServicesModel.find({ title: { $regex: req.query.searchTheme, $options: 'i' } })
        res.status(200).send(services)
    }
    catch (err) {
        res.status(500).send(err)
    }
})


// 3. Register as a volunteer...
app.post('/volunteerRegister', async (req, res) => {
    try {
        let volunteerModel = new VolunteerModel(req.body);
        const result = await volunteerModel.save({});
        res.status(200).send(result)
    }
    catch (err) {
        res.status(500).send(err)
    }
});


// 4. get all volunteer's list by admin...
app.get('/volunteersList', async (req, res) => {
    try {
        const result = await VolunteerModel.find({});
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err)
    }
});


// 5. get spific volunteer's registering events by volunteer....
app.get('/registeringEvent', async (req, res) => {
    // const bearer = req.headers.authorization;
    // if (bearer && bearer.startsWith('Bearer ')) {
    //     const idToken = bearer.split(' ')[1];
    //     try {
    //         const decodedToken = await admin.auth().verifyIdToken(idToken);
    //         if (decodedToken.email == req.query.email) {
    try {
        const result = await VolunteerModel.find({ email: req.query.email })
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send(err)
    }
}
    //         } catch (err) {
    //             console.log(err)
    //         };
    //     }
    // }
);


// 6. remove registering event by admin & volunteer...
app.delete('/remove/volunteer', async (req, res) => {
    console.log(req.query.id)
    try {
        const result = await VolunteerModel.deleteOne({ id: req.query._id })
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err)
    }
});


// publishabale key for payment/donation component....
app.get("/config", (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
});



// 
app.post("/create-payment-intent", async (req, res) => {
    console.log(req.body)
    try {
        const paymentIntent = await stripe.paymentIntents.create(req.body);
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        return res.status(400).send({
            error: {
                message: error.message,
            },
        });
    }
});


// stripe demo checkout form(optional)...
// app.post('/create-checkout-session', async (req, res) => {
//     console.log(req.body)
//     const session = await stripe.checkout.sessions.create({
//         line_items: [
//             {
//                 price_data: {
//                     currency: 'usd',
//                     product_data: {
//                         name: 'T-shirt',
//                     },
//                     unit_amount: 2000,
//                 },
//                 quantity: 1,
//             },
//         ],
//         mode: 'payment',
//         success_url: `${process.env.CLIENT_URL}/donation-success`,
//         cancel_url: `${process.env.CLIENT_URL}`,
//     });

//     res.send({ url: session.url });
// });


app.listen(port, () => console.log('listening to port 8000'));