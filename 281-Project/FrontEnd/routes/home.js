    /*
        Functions to process node requests
        */
    var ejs = require("ejs");

    var mysql = require("./mysql");
    var mongo = require("./mongo");

    function homepage(request, response) {
      
            // Get the user email ID from URL
            var urlPath = request.url.split('/');
            var query = "";

           // if (urlPath.length > 1) 
            var userEmailID = urlPath[urlPath.length - 1];

            if (request.session.email == userEmailID) {
            var userprofile = {};
                query = "SELECT user_first_name FROM `ninja_users` WHERE user_email_id = '" + userEmailID + "'";

            console.log(query);
            mysql.connectDB(function(err, results) {
                if (err) {
                    throw err;
                }
                else {
                    console.log("results:" + results)
                    userprofile = {
                        'FirstName': results[0].user_first_name

                    };





                    ejs.renderFile('views/home.ejs', userprofile, function(err, result) {

                        if (!err) {


                            response.send(result);
                        }
                        else {
                            response.end('An error occurred');
                            console.log(err);
                        }
                    });


                }
            }, query);

        }else{
            response.redirect('/');
        }

    }

    function login(request, response) {

        //Query user information
        var loginQuery = "SELECT COUNT(user_first_name) AS COUNT FROM ninja_users WHERE user_email_id ='" + request.param("Username") + "' AND password='" + request.param("Password") + "'";
        mysql.connectDB(function(err, results) {
            if (err) {
                throw err;
            }
            else {
                console.log(results);
                //If COUNT=0, user does not exist
                if (results[0].COUNT == 0) {
                    response.send("Fail");
                }
                //If COUNT=1, User exists
                else {
                    //Initiate user-session
                    request.session.email = request.param("Username");

                    // Send authentication success message
                    response.send("Success");
                }

            }
        }, loginQuery);
    }


    function signup(request, response) {
        var checkUserExistsQuery = "SELECT COUNT(user_first_name) AS COUNT FROM `ninja_users` WHERE user_email_id = '" + request.param("userEmailId") + "';"

        var signupQuery = "INSERT IGNORE INTO `ninja_users` (`user_email_id`,`password`,`user_description`,`user_first_name`,`user_last_name`) VALUES('" + request.param("userEmailId") + "', '" + request.param("userPassword") + "', '" + request.param("userDescription") + "', '" + request.param("userFirstName") + "','" + request.param("userLastName") + "')";
        mysql.connectDB(function(err, results) {
            if (err) {
                throw err;
            }
            else {
                console.log(results);
                //If COUNT=1, user does exist
                if (results[0].COUNT == 1) {
                    response.send("Exists");
                }

                else {


                    mysql.connectDB(function(err, results) {
                        if (err) {
                            throw err;
                        }
                        else {

                            //Initiate user-session
                            request.session.email = request.param("Username");

                            // Send authentication success message
                            response.send("Success");
                        }


                    }, signupQuery);
                }

            }
        }, checkUserExistsQuery);
    }


   

    function logout(request, response) {
        request.session.email="";
        response.redirect('/');
    }


    //export functions
    exports.homepage = homepage;
    exports.login = login;
    exports.signup = signup;
    exports.logout = logout;