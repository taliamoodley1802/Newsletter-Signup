const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    }],
  };

  var jsonData = JSON.stringify(data);

  const url = "https://us8.api.mailchimp.com/3.0/lists/e0319a0ebd";

  const options = {
    method: "POST",
    auth: "talia:a5082230218019be95d9e09658173812-us8",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();



});

app.post("/failure", function(req, res) {
  res.redirect("/")
})
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});

// a5082230218019be95d9e09658173812-us8 - api key

//e0319a0ebd - audience id
