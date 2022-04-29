// const http  = require("http")

// const server = http.createServer((req, res)=>{
//     console.log(req.url)
//     // home, about, contact,

//     if(req.url == "/" || req.url == "/home"){
//       res.end("this is home page which wer are accessing")
//     }else if (req.url == "/about")
//     {
//       res.end("this is About page which wer are accessing")
//     }
//     else if (req.url == "/contact")
//     {
//       res.end("this is Contact page which wer are accessing")
//     }
//     else {
//       res.writeHead(404, {"Content-type" : "text/html"})
//       res.end(`<h1 style="color: red">404 page not found</h1>`)
//     }


//     // console.log("we are in the server")

// })

// server.listen(8000,"127.0.0.1",()=>{
//   console.log("port 8000 is runing currently")
// })


const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }))

// test api
app.get('/helloworld', (req, res) => {
  return res.status(200).send("Hello World")
})


// db >> collection >> docs  >> json(Data)

// CRUD
// create
app.post('/api/create', async (req, res) => {
  try {
    console.log(req.body)
    await db.collection('userInfo').doc(`/${Date.now()}/`).create({
      id: Date.now(),
      name: req.body.name,
      mobile: req.body.mobile,
      address: req.body.address,
    })

    return res.status(200).send({ Status: "Sucess", msg: "Data Saved" })

  } catch (error) {
    console.log(error)
    return res.status(200).send({ Status: "Failed", msg: "Data not Saved" })
  }

})

// read
app.get("/api/read", async (req, res) => {
  try {

    const document = db.collection('userInfo');
    let response = [];
    await document.get().then(Snapshot => {
      let docs = Snapshot.docs;
      for (let doc of docs) {
        const selectitem = {
          id: doc.id,
          name: doc.data().name,
          mobile: doc.data().mobile,
          address: doc.data().address,
        }
        response.push(selectitem)
      }
      return response;
    })

    return res.status(200).send(response)

  } catch (error) {
    console.log(error)
    return res.status(200).send("Data Failed to get")
  }

})
// read specific data
app.get("/api/read/:id", async (req, res) => {
  try {

    const document = db.collection('userInfo').doc(req.params.id);
    const userDoc = await document.get();
    const response = userDoc.data();

    return res.status(200).send(response)

  } catch (error) {
    console.log(error)
    return res.status(200).send("Data Failed to get")
  }

})

// update
app.put('/api/update/:manshaId', async (req,res)=>{
  try{
    const document = await db.collection('userInfo').doc(req.params.manshaId).update({
      name : req.body.name,
      address : req.body.address,
      mobile : req.body.mobile,
    });
    return res.status(200).send("Data is updated")
  }
  catch(error){
    console.log(error)
    return res.status(200).send("Data is not updated")
  }
})
  
// detele

app.delete('/api/delete/:id', async (req, res)=>{
  try{
    
      const document = db.collection('userInfo').doc(req.params.id);
      await document.delete();
      
      return res.status(200).send("data is deleted")

  }
  catch(error)
  {
    console.log(error)
    return res.status(200).send("data is not deleted")

  }

})

exports.app = functions.https.onRequest(app)




