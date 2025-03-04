function test(user, context, callback) {
    let nameSpace = "website.elephant.spartahack.com";
  
    // ---
    // let count = 0;
    let CB = (err, response, body, cb) => {
        console.log(++count, "\n----->>>>\n", response, "\n----->>>>\n");
        if (response && response.statusCode === 200) {
          context.idToken[nameSpace + "pt"] = body.auth_token;
          context.idToken[nameSpace + "aid"] = body.application_id;
          context.idToken[nameSpace + "rsvp"] = body.rsvp_id;
          
          callback(null, user, context);
        }
        else if (response && response.statusCode >= 400) cb();
    };    
    // ---
    let loginReq = {
        headers: {
          "Content-Type":"application/json",
          "Accept": "vnd.example.v2"
        },
        url: "http://api.elephant.spartahack.com/sessions",
        body: {
          "email": user.email ? user.email : "null",
          "ID_Token": context.clientID
        },
        json: true
    };    
    let createReq = {
      headers: {
        "Content-Type":"application/json",
      },
      url: "http://api.elephant.spartahack.com/users",
      body: {
        "email": user.email,
        "first_name": user.given_name ? user.given_name : "null",
        "last_name": user.family_name ? user.family_name : "null",
        "auth_id": user.user_id,
        "ID_Token": context.clientID
      },
      json: true
    };
    // ---
    let loginCb = (err, response, body) => CB(err, response, body, 
        () => callback(new Error('Invalid User'))); 
    
    let createCb = (err, response, body) => 
        CB(err, response, body, () => request.post(loginReq, loginCb));
    // ---
    // console.log(user);
    // console.log("\n>>>>\n", user,"\n##^^^^##\n", context,"\n>>>>\n");
    // console.log("\n>>>>\n", loginReq,"\n##^^^^##\n", createReq,"\n>>>>\n");
    request.post(createReq, createCb);
  }