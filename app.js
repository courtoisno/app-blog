//Import modules
const sequelize = require ('sequelize')
const express = require ('express')
const app = express ()
const bcrypt = require('bcrypt');

// var fr = require ('fs')
const pg = require('pg')
const bodyParser = require('body-parser')
var session = require('express-session');



//Load static files
app.use(express.static('static'))
//Session
app.use(session({
	secret: 'something secret?',
	resave: true,
	saveUninitialized: false
}));

//set up pug
app.set('view engine', 'pug')
app.set ('views', __dirname + '/views')


//<----____________________________ CONNEXION TO DATABASE ____________________________----->

let db = new sequelize('blogging', 'NONO', 'Iceteagreen8051', {
	server:'localhost',
	dialect:'postgres'
})

//<-******************************************* TABLES IN DB WITH SEQUELIZE *******************************************->
//<-******************************************* TABLES IN DB WITH SEQUELIZE *******************************************->
//<-******************************************* TABLES IN DB WITH SEQUELIZE *******************************************->

//Table for user : username and password -> check for userID
let User = db.define('user', {
	username: {type: sequelize.STRING, unique:true}, ////--> If not unique then create a new one
	password: sequelize.STRING, 
	email: {type: sequelize.STRING, unique:true}
})

//table for posts : title + body ---> connect to userID
let Post = db.define('post', {
	title: sequelize.STRING,
	body: sequelize.STRING
})

//table for comments --> Connect to post and user Id
let Comment = db.define('comment', {
	comment: sequelize.STRING
})

//create relations
User.hasMany (Post)
User.hasMany (Comment)
Post.hasMany(Comment)
Post.belongsTo(User)
Comment.belongsTo(Post)
Comment.belongsTo(User)


//<-************************************************ ROUTES *************************************************->
//<-************************************************ ROUTES *************************************************->
//<-************************************************ ROUTES *************************************************->


//ROUTE1 - debug test route
app.get('/ping', (req, res) =>{ 
	res.send('pong')
})

//Route2 - Home page
app.get('/', (req, res)=>{
	res.render('index',{
		message:req.query.message,
		user: req.session.user
	})
	console.log('route ok')
})

//<----____________________________ LOG IN/OUT ____________________________----->

app.post('/login', bodyParser.urlencoded({extended: true}), (req, res) =>{
	//declare variables
	var userName = req.body.Username
	var userPass = req.body.password
	var user = req.session.user


	//function to find user in DB with sql
	User.findOne ({
			where: {
				username: req.body.Username
			}
		}).then ( user => {
			bcrypt.compare(userPass, user.password, function(err, result) {
	    		// Store hash in your password DB.
	    		//check if my input correspond to my db
				if ( result ) {
					req.session.user = user;
					res.redirect('/profile');
				} else {
					res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
				}
			});
			
		}, (error) => {
			res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
		});
	});

//Redirection to The profile page.
app.get('/profile', (req, res) => {
	var user = req.session.user;
	if (user === undefined) {
		res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
	} else {
		Post.findAll({	
			where: { 
				userId: user.id
			},
			include: [User]

		}).then(post => {
			res.render('profile', {
				posts: post,
				user: user
			})
			console.log(post)
		})
	}
});


//LOG out page ! ---> TO FIX LATER !
app.get('/logout', (req, res) => {
	req.session.destroy(function(error) {
		if(error) {
			throw error;
		}
		res.render('logout')
	})
});

//<----____________________________ ADD NEW USERS ____________________________----->


//ADD NEW USERS -> NEWLOGpage
app.get ('/newlog', (req,res) => {
	res.render('newlog')
})

app.post('/login', bodyParser.urlencoded({extended: true}), (req,res) =>{
	var user = req.session.user
	//create new user
	var newUser = {
		username: req.body.name,
		password: req.body.pass,
		email: req.body.mail
	}
	//check if passwords corresponds
	// if (newUser.email !== req.body.mail2 ){
	// 	res.redirect('/message=' + encodeURIComponent("mail doesnt corresponds"))
	// 	console.log("ALLELJUJA")
	// } 
	//ENcrypting the password in the db -> HAVE TO replace hash in password instead of newUser.password
	bcrypt.hash(req.body.pass, 8, function(err, hash) {

		if (err) throw err

		User.findOrCreate ({
			where: {
			username: newUser.username,
			password: hash,
			email: newUser.email
		}
		}).then (user=>{
			//check if username already here or not
			if (newUser.username == user.username){
				res.redirect('/message=' +encodeURIComponent('username already exists'))
			} else {
				console.log(newUser)
			}
		})
	})
 	res.redirect('/')
});


//<----____________________________ POSTS ____________________________----->

// Create post page-> get the page from db witht the form
// app.get('/posts', (req, res) =>{
// 	var user= req.session.user
// 	console.log('im trump')
// 	res.render('posts', {
// 		user: user
// 	})
// })

//POst the post in the database
app.post('/posting', bodyParser.urlencoded({extended: true}), (req, res) =>{
	var user = req.session.user
	//find users first, because the post are inerited from the users
	User.findOne({
		where: { username: user.username }
	}).then( user => {
		//then create post from users
		user.createPost({
			title: req.body.title,
			body: req.body.body
		})

	}).then( () => { 
		res.redirect('/posting')
	})
		
	
}) 	
//Get the whole thing again but this time we want to include users to their post
app.get('/posting', (req,res)=> {
	var user = req.session.user
	console.log('ici')
		Post.findAll({
			include: [User]
		}).then(post => {
			res.render('posting', {
 				posts: post

 			})
		} )
})

app.get('/singlepost', bodyParser.urlencoded({extended: true}), (req,res)=> {
	var user = req.session.user
	if (!user) {
		res.redirect('/')
		return
	}
		Post.findOne({
			where: { 
				id: req.query.id
			},
			include: [User, Comment]
		}).then(post => {
			res.render('singlepost', {
 				posts: [post]

 			})
		} )
})


// //create an other route for CLICK on a post and get the comments
// app.get('/singlepost',bodyParser.urlencoded({extended: true}), (req, res) =>{
// 	var user = req.session.user

// 	Post.findOne({	
// 		where: { 
// 			title: req.body.title
// 		},
// 		include: [User, Comment]
// 	}).then (post => {
// 		console.log(post)
// 			res.render('singlepost', {
//  				posts: [post]
//  			})
// 		})
			

// })

//Post in relation with the AJAX post request
app.post('/singlepost', bodyParser.urlencoded({extended: true}), (req, res) =>{
	console.log(req.body)
	var user = req.session.user

	User.findOne({
			where: { username: user.username },
		}).then( user => {
			//then create post from users
			user.createComment ({
				comment: req.body.comment,
				postId: req.body.postId
			}).then( (comment) => {
				comment.setPost()
				res.send(req.body.comment)
			})
		})

})


//ROUTE for user's OWN POSTS on their profile page
app.get('/ownpost',bodyParser.urlencoded({extended: true}), (req, res) =>{
	var user = req.session.user

	Post.findAll({	
		where: { 
			userId: user.id
		},
		include: [User]

	}).then(post => {
		res.render('profile', {
			posts: [post],
			user: user
		})
		console.log(post)
	})

})


//<----____________________________ COMMENTS ____________________________----->

app.post('/singlepost', bodyParser.urlencoded({extended: true}), (req, res) =>{
	var user = req.session.user
	//find users first, because the post are inerited from the users
	User.findOne({
		where: { username: user.username },
	}).then( user => {
		//then create post from users
		user.createComment ({
			comment: req.body.comment
		})
		console.log(req.body.comment)
	}).then( () => { 
		res.send(req.body.comment)
	})
	
}) 

// app.get('/singlepost', (req, res) =>{
// 	var user= req.session.user
// 	console.log('im trump')
// 	res.render('singlepost')
// })


// app.get('/comment', bodyParser.urlencoded ({extended: true}), (req, res)=>{
// 	var user = req.session.user
// 	Comment.findAll({
// 		include: [User]
// 	}).then(comment=>{
// 		res.render('posting', {
// 			comments: comment,
// 			user: user
// 		})
// 	})
// })



//<----____________________________ SYNC ____________________________----->

//sync to db
// db.sync()
db.sync({force:true}).then (() =>{
	console.log('synced, yay')
	User.create({
		username: "Nono",
		password: "1234",
		email: "nono@no.com"
	}).then( user => {
		user.createPost({
			title: " Coucou" ,
			body: "THIS IS ANNOYIIIIING"
		}).then(post => {
			post.createComment ({
				comment: "stunninnnnng!!!!!!"
			}).then(comment =>{
				comment.setUser(user)
			})
		})

		// user.createPost({
		// 	title: " Bonjour" ,
		// 	body: "Hope your day is beautiful"
		// })
		// user.createPost({
		// title: "Some fun" ,
		// body: "If you kept yelling for 8 years, 7 months and 6 days, you would produce enough sound energy to heat up a cup of tea."

		// })
	})

	User.create({
		username: "Marco",
		password: "7890",
		email: "marco@polo.com"
	}).then( user => {
		user.createPost({
			title: " Bonjour" ,
			body: "Hope your day is beautiful"
		})
		user.createPost({
			title: " Bonjour" ,
			body: "Hope your day is beautiful"
		})
		user.createPost({
		title: "Some fun" ,
		body: "If you kept yelling for 8 years, 7 months and 6 days, you would produce enough sound energy to heat up a cup of tea."

		})
	})
})

//<----____________________________ LISTEN 8000 ____________________________----->

//Listen or not, thats the question. 
app.listen(8000, () =>{
	console.log('Im running so fast its crazy wow im great')
})