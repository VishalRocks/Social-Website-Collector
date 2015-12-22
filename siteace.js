Websites = new Mongo.Collection("websites");
Websites.allow({
	insert:function(userId,doc){
		if(Meteor.user()){
			return true;
		}
		else{
			return false;
		}
	},
	remove:function(userId,doc){
		if(Meteor.user()){
			return true;
		}
		else{
			return false;
		}
	},
	update:function(userId,doc){
		if(Meteor.user()){
			return true;
		}
		else{
			return false;
		}
	}
})

Comments = new Mongo.Collection("comments");
Comments.allow({
	insert:function(userId,doc){
		if(Meteor.user()){
			return true;
		}
		else{
			return false;
		}
	}
})
if (Meteor.isClient) {
//routing
	Router.route('/', function () {
  		this.render('Home');
	});
	Router.route('/:_id',function(){
		this.render('website_description',{
			data:function(){
				return Websites.findOne({_id:this.params._id});
			}
		});
	});


	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},{sort: {votes:-1}});
		}
	});


	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
			var currentVotes = Websites.find({_id:website_id},{votes:1}).fetch()[0]["votes"];
			currentVotes+=1;
			Websites.update({_id:website_id},{$set:{votes:currentVotes}});
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			var currentVotes = Websites.find({_id:website_id},{votes:1}).fetch()[0]["votes"];
			currentVotes-=1;
			Websites.update({_id:website_id},{$set:{votes:currentVotes}});
			return false;// prevent the button from reloading the page
		}
	})

	Template.website_description.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
			var currentVotes = Websites.find({_id:website_id},{votes:1}).fetch()[0]["votes"];
			currentVotes+=1;
			Websites.update({_id:website_id},{$set:{votes:currentVotes}});
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			var currentVotes = Websites.find({_id:website_id},{votes:1}).fetch()[0]["votes"];
			currentVotes-=1;
			Websites.update({_id:website_id},{$set:{votes:currentVotes}});
			return false;// prevent the button from reloading the page
		}
	})

	Template.website_description.helpers({
		comments:function(myId){
			console.log("fetching for "+myId);
			return Comments.find({site_id:myId},{sort: {createdOn:1}}).fetch();
		}
	})

	Template.commentForm.events({
		"submit .js-save-comment-form":function(event,myId){
			var comment = event.target.comment.value;
			console.log("Comment is"+comment);
			var email = Meteor.users.find({_id:Meteor.userId()}).fetch()[0]["emails"][0]["address"];
			console.log("email:"+email);
			var createdOn = new Date();
			Comments.insert({
				content: comment,
				createdOn: createdOn,
				email: email,
				site_id: myId["data"]["myId"]
			});
			return false;
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			console.log("The url they entered is: "+url);
			var title = event.target.title.value;
			var description = event.target.description.value;
			var  createdOn = new Date();
			//  put your website saving code in here!	
			Websites.insert({
    			title:title, 
    			url:url, 
    			description:description, 
    			createdOn: createdOn,
    			votes: 0
    		});
			return false;// stop the form submit from reloading the page

		}
	});
}


if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department", 
    		url:"http://www.gold.ac.uk/computing/", 
    		description:"This is where this course was developed.", 
    		createdOn:new Date(),
    		votes: 0
    	});
    	 Websites.insert({
    		title:"University of London", 
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
    		description:"University of London International Programme.", 
    		createdOn:new Date(),
    		votes: 0
    	});
    	 Websites.insert({
    		title:"Coursera", 
    		url:"http://www.coursera.org", 
    		description:"Universal access to the world’s best education.", 
    		createdOn:new Date(),
    		votes: 0
    	});
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
    		createdOn:new Date(),
    		votes: 0
    	});
    }
  });
}
