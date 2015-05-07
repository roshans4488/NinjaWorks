var mysql = require("./mysql");


exports.createWorkspace = function(request, response) {

    var queryInsertWorkspace = "INSERT INTO ninja_workspaces values('" + request.body.workspace_id + "','" + request.body.workspace_name + "','" + request.body.workspace_type + "','" + request.body.workspace_description + "')";
    var queryInsertWorkspacePermission = "INSERT INTO ninja_workspace_permissions VALUES('" + request.body.user_email_id + "','admin','" + request.body.workspace_id + "')";
    mysql.connectDB(function(err, results) {
        if (err) {
            throw err;
        } else {
            mysql.connectDB(function(err, results) {
                if (err) {
                    throw err;
                } else {
                    response.send("Success");
                }
            }, queryInsertWorkspacePermission);
        }
    }, queryInsertWorkspace);

}


exports.editWorkspace = function(request, response) {
/* Created for future use */
}

exports.generateWorkspaceID = function(request, response) {
    var query = "select max(workspace_id) as workspace_id from ninja_workspaces";
    mysql.connectDB(function(err, results) {
        if (err) {
            throw err;
        } else {
            console.log(results);
            var newWorkspaceID = (Number(results[0].workspace_id.substr(1)) + 1).toString();;
            console.log("Before padding : " + newWorkspaceID);
            if (newWorkspaceID.length == 1) {
                newWorkspaceID = "W000" + newWorkspaceID;
            } else if (newWorkspaceID.length == 2) {
                newWorkspaceID = "W00" + newWorkspaceID;
            } else if (newWorkspaceID.length == 3) {
                newWorkspaceID = "W0" + newWorkspaceID;
            } else
                newWorkspaceID = "W" + newWorkspaceID;
            console.log("After padding : " + newWorkspaceID);

            response.send({
                "Workspace_ID": newWorkspaceID
            });
        }


    }, query);
}