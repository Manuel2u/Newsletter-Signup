const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("mailchimp-marketing");
require('dotenv').config();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/signup.html")

});


app.post("/", function(req, res) {

  var email = req.body.email;
  var fname = req.body.fname;
  var lname = req.body.lname;


  client.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER,
  });

  const run = async () => {
    const response = await client.lists.batchListMembers(process.env.LIST_ID, {
      update_existing:true,
      members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        }
      }],
    });
    console.log(response);

    if (response.new_members.length !== 0 ) {
      res.sendFile(__dirname + "/success.html");
    }
    else if (response.error_count !== 0) {
        res.sendFile(__dirname + "/failure.html");
    }
    else if (response.updated_members.length !== 0 ) {
        res.sendFile(__dirname + "/updated.html");
    }


    app.post("/failure",function(req,res){
      res.redirect("/");
    });

  };
  run();

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Started server at port 3000");
});
