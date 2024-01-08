const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
const connectionString = 'mongodb+srv://adm:adm@akshatbhaika.ftmgts2.mongodb.net/';
mongoose.connect(connectionString);
const cafeSchema = new mongoose.Schema({
  n1: String,
  email: String,
});
const bookingSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  person: String,
  date: String,
  time: String,
  message: String
});

const Cafe = mongoose.model('Cafe', cafeSchema);
const Booking = mongoose.model("Booking", bookingSchema);

app.post('/signup', async (req, res) => {
  try {
    const { n1, email } = req.body;
    console.log(req.body);
    const newCafe = new Cafe({ n1, email });
    await newCafe.save();
    res.sendFile(__dirname + '/index.html');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.post('/adm', async (req, res) => {
  if (req.body.n1 == 'akshat' && req.body.pass == 'cafe') {
    const { n1, pass } = req.body;
    console.log(req.body);
    app.set('view engine', 'ejs');
    
    Cafe.find({}).then((x) => { res.render('loged', { x }); });

  } else {
    res.send('<h1>incorrect</h1>');
  }});
  app.post('/adm2', async (req, res) => {
    if (req.body.n1 == 'akshat' && req.body.pass == 'cafe') {
     
      console.log(req.body);
      app.set('view engine', 'ejs');
      
      Booking.find({}).then((m) => { res.render('loged2', { m }); });
  
    } else {
      res.send('<h1>incorrect</h1>');
    }
});
app.post('/del', async (req, res) => {

  await Cafe.deleteOne({ _id: req.body.n1 });

  console.log(req.body);
  await Cafe.find({}).then((x) => { res.render('loged', { x }); });





});
app.post('/book', async (req, res) => {

  await Booking.deleteOne({ name: req.body.n1 });

  console.log(req.body);
 await  Booking.find({}).then((m) => { res.render('loged2', { m }); });





});
app.post('/booking', async (req, res) => {
  // const newCafe = new Cafe({ n1, email });
  //   await newCafe.save();
  const name = req.body.name;
  const phone = req.body.phone;
  const person = req.body.person[0];
  const time = req.body.person[1];
  const date = req.body.reservationdate;
  const message = req.body.message;
  const newbooking = new Booking({name,phone,person,date,time,message});
await newbooking.save();
  console.log(req.body);
  res.sendFile(__dirname + '/index.html');






});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





