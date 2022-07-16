const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("mailchimp-marketing");


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
    apiKey: "3b610b2b3d11d3ead389b496555f6418-us18",
    server: "us18",
  });

  const run = async () => {
    const response = await client.lists.batchListMembers("b528f69856", {
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
