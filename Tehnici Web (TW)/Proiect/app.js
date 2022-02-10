const express = require('express');/*include modulul express
memorand in variabila express obiectul asociat modulului(exportat de modul)*/
var app = express();
//const bodyParser = require('body-parser');
const session = require('express-session');
const formidable = require('formidable');
const fs = require('fs');
const util = require('util');
const nodemailer = require("nodemailer");
const crypto = require('crypto');

// initializari socket.io
const http = require('http');
const socket = require('socket.io');
const server = new http.createServer(app);  
var  io = socket(server);
io = io.listen(server);//asculta pe acelasi port ca si serverul


var conexiune_index
io.on("connection", (socket) => {  
	console.log("Magic In!");
	conexiune_index=socket
	socket.on('disconnect', () => {conexiune_index=null;console.log('Magic Out!')});
});


function getJson(numeFis)
{
	let textFis = fs.readFileSync(numeFis);//pun continutul fisierului useri.json in rawdata
	return JSON.parse(textFis);//obtin obiectul asociat json-ului
}

function saveJson(obJson, numeFis)
{
	let data = JSON.stringify(obJson);//transform in JSON
	fs.writeFileSync(numeFis, data);//scriu JSON-ul in fisier (inlocuind datele vechi)
}


serverPass="tralala";


// pentru folosirea ejs-ului 
app.set('view engine', 'ejs');


app.use(express.static(__dirname));

//setez folderele statice (cele in care nu am fisiere generate prin node)
app.use('/css', express.static('css'));
app.use('/uploads', express.static('uploads'));


//setez o sesiune
app.use(session({
  secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
  resave: true,
  saveUninitialized: false
}));


async function trimiteMail(username, email) 
{
	let transporter = nodemailer.createTransport(
	{
		service: 'gmail',

		secure: false,
		auth: 
		{
			user: "", //mailul site-ului (de aici se trimite catre user)
			pass: "" 
		},
	    tls: 
		{
			rejectUnauthorized: false//pentru gmail
		}
	});

	//trimitere mail
	let info = await transporter.sendMail(
	{
		from: '"Admin" <@example.com>',
		to: email,
		subject: "~ Moderator Nou ~", 
		text: "Welcome, "+username, 
		html: "<p>Accio, "+username+"</p>" 
	});

	console.log("Message sent: %s", info.messageId);
}


// cand se face o cerere get catre pagina de index 
app.get('/', function(req, res) 
{
	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
    res.render('html/index', {user: req.session.username});
});


app.get('/logout', function(req, res) 
{
    req.session.destroy();  //distrug sesiunea cand se intra pe pagina de logout
	res.render('html/logout');	
});


app.post('/', function(req, res) 
{
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) 
	{
		jsfis = getJson('moderatori.json');
		var cifru = crypto.createCipher('aes-128-cbc', 'mypassword');  //creez un obiect de tip cifru cu algoritmul aes
		var encrParola = cifru.update(fields.parola, 'UTF8', 'hex');  //cifrez parola
		
		encrParola += cifru.final('hex');  //inchid cifrarea (altfel as fi putut adauga text nou cu update ca sa fie cifrat
		
		let user = jsfis.useri.find(function(x){
			//caut un user cu acelasi nume dat in formular si aceeasi cifrare a parolei
			return (x.username == fields.username && x.parola == encrParola);
		});
		
		
		if(user)
		{
			console.log(user);
			console.log(user.parola);
			console.log(encrParola);
			req.session.username=user;   //setez userul ca proprietate a sesiunii
		}
		
		console.log(req.session.username);
		
		/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
		res.render('html/detalii', {user: req.session.username});
	});
});


app.get('/vrajitori', function(req, res) 
{
	let rawdata = fs.readFileSync('vrajitori.json');
	let jsfis = JSON.parse(rawdata);
	console.log(jsfis.vrajitori);
	
	res.render('html/vrajitori', {vrajitori:jsfis.vrajitori,user: req.session.username});
});


app.get('/inregistrare_vrajitori', function(req, res) 
{
	console.log(req.session.username);
    res.render('html/inregistrare_vrajitori', {user: req.session.username});
});


app.post('/inregistrare_vrajitori', (req, res) => 
{
	var form = new formidable.IncomingForm(); // obiect de tip form cu care parsez datele venite de la utilizator
	form.parse(req, function(err, fields, files) 
	{
      //parsarea datelor
	  
		console.log('Fișier Încărcat: ' + files.poza.path); //verific calea buna in consola
		var calePoza=(files.poza && files.poza.name!="") ? files.poza.name : ""; //verific daca exista poza (poza este numele campului din form
		
		let rawdata = fs.readFileSync('vrajitori.json'); //citesc fisierul si pun tot textul in rawdata
		
		let jsfis = JSON.parse(rawdata); //parsez textul si obtin obiectul asocita JSON-ului

		jsfis.vrajitori.push({id:jsfis.lastId, nume:fields.nume, prenume:fields.prenume, casa: fields.casa, poza: calePoza});//adaug elementul nou
		jsfis.lastId++;//incrementez id-ul ca sa nu am doi studenti cu acelasi id
		
		saveJson(jsfis,'vrajitori.json')
		res.render('html/inregistrare_vrajitori', {user: req.session.username, rsstatus:"ok"});
    });

	form.on('fileBegin', function (name, file)
	{
		file.path = __dirname + '/uploads/' + file.name; //inainte de upload setez calea la care va fi uploadat
		console.log("Director: "+ file.path);
    });

    form.on('file', function (name, file)
	{
		if(file && file.size)
		{
			console.log('S-a încărcat ' + file.name);  //la finalul uploadului afisez un mesaj
		}
    });
});


/*app.get('/inregistrare_moderator', function(req, res) 
{
    res.render('html/inregistrare_moderator', {user: req.session.username});
});*/

app.post('/inregistrare_moderator', (req, res) => 
{
	//var  dateForm = req.body;
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) 
	{
		let rawdata = fs.readFileSync('moderatori.json');
		let jsfis = JSON.parse(rawdata);
		var cifru = crypto.createCipher('aes-128-cbc', 'mypassword');
		var encrParola= cifru.update(fields.parola, 'utf8', 'hex');
		encrParola += cifru.final('hex');
		console.log(fields.parola + " " + encrParola);
		jsfis.moderatori.push({id:jsfis.lastId, username:fields.username, nume:fields.nume, email: fields.email, parola: encrParola, dataInreg: new Date(), rol:'moderator', casa:fields.casa});
		jsfis.lastId++;
		res.render('html/inregistrare_moderator', {user: req.session.username, rsstatus:"ok"});

		saveJson(jsfis,'moderatori.json')
		trimiteMail(fields.username, fields.email).catch((err) => {console.log(err)})
    });
});



app.get('/buton', function(req, res) {
    res.render('html/buton', {user: req.session.username});
});
app.post('/buton', function(req, res) {
	console.log("apasat")
	if(conexiune_index){
		console.log(conexiune_index)
		conexiune_index.emit("buton", { refresh: true });
	}
    res.render('html/buton', {user: req.session.username});

});



app.get('/moderatori', function(req, res) 
{
	let rawdata = fs.readFileSync('moderatori.json');
	let jsfis = JSON.parse(rawdata);
	console.log(jsfis.studenti);

	res.render('html/moderatori',{useri:jsfis.useri,user: req.session.username});
});



app.get('/detalii', function(req, res) {
    res.render('html/detalii', {user: req.session.username});
});
app.get('/bun', function(req, res) {
    res.render('html/bun', {user: req.session.username});
});
app.get('/griff', function(req, res) {
    res.render('html/griff', {user: req.session.username});
});
app.get('/huff', function(req, res) {
    res.render('html/huff'), {user: req.session.username};
});
app.get('/slyh', function(req, res) {
    res.render('html/slyh'), {user: req.session.username};
});
app.get('/rclaw', function(req, res) {
    res.render('html/rclaw'), {user: req.session.username};
});


app.use(function(req,res){
    res.status(404).render('html/404');
});


app.listen(934);
console.log('Pentru a vă începe călătoria în lumea Harry Potter, accesați Platforma 09, 3/4.');