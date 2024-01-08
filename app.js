const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/',async (req,res)=>{
  res.sendFile(__dirname+'/index.html');
});
app.post('/', async (req, res) => {
  try {
const na= req.body.n1;
 const  em = req.body.email;
  console.log(req.body);
    res.json({ success: true, message: 'Form submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
