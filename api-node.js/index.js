var express  = require('express');
var app = express();
var port = process.env.PORT || 5004;
var http = require('http');

var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json()); // parse application/json
app.use(methodOverride('X-HTTP-Method-Override'));

var elections =[];
var e1 = {
    'id': 'BDE',
    'votes': [
      {
        'choix': 1,
        'prenom': 'Adel'
      },
      {
        'choix': 2,
        'prenom': 'Quentin'
      },
      {
        'choix': 2,
        'prenom': 'Fadwa'
      }]
};
	  
elections.push(e1)


app.get('/api/Votes/Elections', function(req, res) {
	
	res.contentType('application/json');
	res.status(200).json(elections);
});

app.param('id', function (req, res, next, id) {
	console.log('Id called in the URL.');
	next();
});

app.get('/api/Votes/Elections/:id', function(req, res) {
	var election = '';
	console.log("id", req.params.id);
	for(i in elections){
		console.log(elections[i]);
		if(elections[i].id === req.params.id){
			election = elections[i];
		}
	}
	
	if(election === ""){
		res.status(404).send("This election does not exist!");
	}else{
		res.contentType('application/json');
		res.status(200).json(election);
	}
});

app.put('/api/Votes/Elections/:id', function(req, res) {
	console.log(req.params);
    var VerifExistence = false;
    for(i in elections){
      if(elections[i].id === req.params.id){
        VerifExistence = true;
        elections[i].votes = [];
      }
    }
    if(VerifExistence === true){
        res.status(200).send(elections);
    }
    else{
      var election = {id: req.params.id, votes:[]};
      elections.push(election); 
      res.status(201).send(elections);
    }
});

app.post('/api/Votes/Elections/:id/Votes', function(req, res) {
  var election = '';
  console.log("id", req.params.id);
  console.log(req.body);
  for(i in elections){
    if(elections[i].id === req.params.id){
      elections[i].votes.push(req.body);
      election = elections[i];
    }
  }
  if(election === ""){
    res.status(404).send("This election does not exist!");
  }
  else{
    res.status(201).json(election);
  }
});

app.delete('*',function(req,res){
  res.status(405).send('Method not allowed!');
});

app.all('*', function(req, res){
   res.status(400).send('This URL does not exist!');
});

app.listen(port);
console.log("App listening on port " + port);
