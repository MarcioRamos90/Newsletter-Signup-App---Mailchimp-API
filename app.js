const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// static folder
app.use(express.static(path.join(__dirname, "public")));

// Signup Route
app.post("/signup", (req, res) => {
  const { firstName, lastName, email } = req.body;

  // very simple validation of if fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect("/fail.html");
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    // your url https://<user-id>.api.mailchimp.com/3.0/lists/<unique-id>
    // get your unique id here https://<your-id>.admin.mailchimp.com/lists/settings
    // To know mor check this link https://developer.mailchimp.com/documentation/mailchimp/guides/get-started-with-mailchimp-api-3/
    url: "https://<user-id>.api.mailchimp.com/3.0/lists/<unique-id>",
    method: "POST",
    headers: {
      // get your api key here https://<user-id>.admin.mailchimp.com/account/api/
      Authorization: "auth <yourt api key>"
    },
    body: postData
  };

  request(options, (err, response, body) => {
    if (err) {
      res.redirect("/fail.html");
    } else {
      if (response.statusCode === 200) {
        res.redirect("/success.html");
      } else {
        res.redirect("/fail.html");
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`app runing on port ${PORT}`));
