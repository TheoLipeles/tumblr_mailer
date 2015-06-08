
var fs = require("fs");
var ejs = require("ejs");
// Authenticate via OAuth
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: '',
  consumer_secret: '',
  token: '',
  token_secret: ''
});
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('');

// Make the request
client.userInfo(function (err, data) {
    // ...
});

var emailTemplate = fs.readFileSync("email_template.ejs", "utf8");
var csvFile = fs.readFileSync("friend_list.csv", "utf8");
var contacts = csvParse(csvFile);
getLatestPosts();



// parse the csv file
function csvParse(csv) {
	var result = [];
	var lines = csv.split("\n");
	for (var r = 1; r < lines.length; r++) {
		if (lines[r].length > 0) {
			var contact = {};
			for (var key  = 0; key <= 3; key++) {
				contact[lines[0].split(",")[key]] = lines[r].split(",")[key];
			}
			result.push(contact);
		}
	}
	return result;
}

// get latest posts
function getLatestPosts() {
	latestPosts = [];
	client.posts("theolipeles.tumblr.com", function(err, blog){
		for (var post = 0; post < blog.posts.length; post++) {
			var today = new Date();
			var sevenDaysAgo = new Date(parseInt(Date.parse(today)) - 604800000);
			if (parseInt(Date.parse(blog.posts[post].date)) >= parseInt(Date.parse(sevenDaysAgo))) {
				latestPosts.push({
					title: blog.posts[post].title,
					href: blog.posts[post].post_url
				});
			}
		}

		for (var c in contacts) {
			var customizedTemplate = ejs.render(emailTemplate, {
				firstName: contacts[c].firstName,
				numMonthsSinceContact: contacts[c].numMonthsSinceContact
			});
			sendEmail(contacts[c].firstName, contacts[c].emailAddress, "Theo", "theo@lipeles.com", "Hey" + contacts[c].firstName, customizedTemplate);
		}

	});
}


function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
    "html": message_html,
    "subject": subject,
    "from_email": from_email,
    "from_name": from_name,
    "to": [{
            "email": to_email,
            "name": to_name
        }],
    "important": false,
    "track_opens": true,    
    "auto_html": false,
    "preserve_recipients": true,
    "merge": false,
    "tags": [
        "Fullstack_Tumblrmailer_Workshop"
    ]    
	};
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        // console.log(message);
        // console.log(result);   
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
}





// No longer necessary
function replaceVals(htmlStr, contact) {
	var newStr = htmlStr;
	var findAllVar = /((?:[A-Z]+_)+[A-Z]+)/g
	vars = htmlStr.match(findAllVar);
	for (var i = 0; i < vars.length; i++) {
		var newVar = vars[i].toLowerCase().replace(/_(.)/g, function(str, $1) {
			return $1.toUpperCase();
		});
		if (contact[newVar] != null) {
			newStr = newStr.replace(vars[i], contact[newVar]);
		}
	}
	return newStr;
}


















