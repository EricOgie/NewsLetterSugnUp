const express = require('express');
const https = require('https');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const baseRoot = "/";
const baseRoute = __dirname;
const mailChinpUrl = "https://us1.api.mailchimp.com/3.0/lists/e07c4bcfca"

// https://<dc>.api.mailchimp.com/3.0/lists/{list_id}.

//-------------------------- BUILD AUTH OPTION OBJECT-------------------------------
const option = {
  method: "POST",
  auth: "oneticha:1e1a20bc751fae2891ffbc5a12f020f5-us1"
};

//------------------------------------- STACTIC AND BODYPARSER SETUP------------------------------------------------//

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//-------------------------------------APP SERVICE ON BASE ROOT-----------------------------------------------------//

app.get(baseRoot, (req, res) => {
  res.sendFile(`${baseRoute}/signup.html`);
});

//-------------------------------------INTERCEPT POST INPUTE-----------------------------------------------------//

app.post(baseRoot, (req, res) => {

  //-----CREATE MAILING MEMEBER OBJECT----
  var userData = {
    members:[
      {
      email_address: req.body.email,
      status: "subscribed",
      merge_fields: {
        FNAME: req.body.fName,
        LNAME: req.body.lName
      }
    }
  ]

  };
//-----SERIALIZE USER DATA -----------------------//
var serializedUserDater = JSON.stringify(userData);

//------BUILD REQUEST TO ADD TO MAILCHIMP---------------//

const request = https.request(mailChinpUrl, option, (httpResponse)=>{

if(httpResponse.statusCode === 200){

  res.sendFile(`${baseRoute}/success.html`);

}else{

  res.sendFile(`${baseRoute}/failure.html`);
}

  var statusCode = httpResponse.statusCode;
  console.log("HTTP RES =" + httpResponse.statusCode);
  httpResponse.on("data", (returnedData)=>{

  })
});

request.write(serializedUserDater);
request.end();
console.log(serializedUserDater);

});

app.post("/failure", (req, res)=>{
  res.redirect(baseRoot);
});


app.listen(port, console.log(`Server Listening on port ${port}`));








// MAILCHIMP API
// 1e1a20bc751fae2891ffbc5a12f020f5-us1

// MAILCHIMP AUDIENCE required
// e07c4bcfca
