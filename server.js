const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const sqlite3 = require('sqlite3')
const nodemailer = require('nodemailer')
const db = new sqlite3.Database("./tabella.db")
let upload = multer()
let app = express()


app.set('views', './views')
app.set('view engine', 'ejs')

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(upload.array())
app.use(express.static(__dirname + '/public'))

app.post("/", function(req,res){
    let nome = req.body["quest1"]
    let cognome = req.body["quest2"]
    let steamid = req.body["quest3"]
    let email = req.body["quest4"]
    console.log(email)
    inviaEmail(email,nome,cognome)
    res.send("tutto ok")
    db.run(`INSERT INTO iscrizioni(nome,cognome,steamid, email) VALUES(?,?,?,?)`, 
    [nome, cognome, steamid, email],
    function(error){
        console.log("Dati inseriti con successo");
    }
);
});

app.get('/' , function(req,res){
    res.render('index')
})

app.listen(8080)


/* Funzioni */
function inviaEmail(email,nome,cognome){
    console.log(email)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: 'mattycarly02@gmail.com',
            pass: '07081276MA'
        }
    });

    let mailOptions = {
        from: 'mattycarly02@gmail.com',
        to: email,
        subject: 'Credenziali Server Assetto Corsa',
        text: "Ciao " + nome + " " + cognome + "\n" +
              "Grazie per esserti registrato all' evento! \n" + 
              "Ecco qui i dati di accesso al server:\n" + 
              "Nome Server: Qlash Time Attack \n" +
              "Password Server: password \n"+
              "Se non dovessi riuscire ad accedere, contatta lo staff su Discord!" 
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email inviata: ' + info.response);
        }
    }); 
}