var DEBUG = false;
var BURNDOWN;
var SPRINTS;

/*
 * Scrum module related functions
 *
 */

function initializeScrumWorkspace() {
                
              //alert("Initialize method called");
                    
              loadScrumStories();
              loadBurndown();
              loadResources();
              loadSprints();
              loadSprintOverview();
              loadBurndownGraph();
              
              $("td.isEditable").on('click',function() {
                if($(this).attr('isEditable') == "true" && $(this).attr('editing') == "false") {
                  $(this).attr('editing',"true");
                  //alert("something needs to be done!");
                  //alert($(this).html());
                  $(this).html('<input type="text" value="'+$(this).html()+'" />');
                  $(this).find("input").focus();
                } else {
                  //alert("came here");
                  var requestJSON;
                  $(this).attr('editing',"false");
                  $(this).html($(this).find("input").val());
                  var controllerElement = document.querySelector('body');
                  var controllerScope = angular.element(controllerElement).scope();
                  var workspace_type = controllerScope.workspace_type;
                  var workspace_id = controllerScope.workspace_id;
                  var project_ID = controllerScope.projectID;
                  
                  requestJSON = JSON.stringify( { "workspace_type": workspace_type, "category" : $(this).attr('category'), "workspace_id": workspace_id, "identifier_name":$(this).attr('identifier_name'), "identifier_value":$(this).attr('identifier_value'), "update_field":$(this).attr('field_id'), "new_value":$(this).html() } );
                    
                    $.ajax({
                  			async: false,
                  			type: "POST",
                  			url: "/NinjaServices/updateUserData",
                  			data: requestJSON,
                  			contentType: 'application/json',
                  			dataType: 'json',
                  			success: function(data) {
                  			  //scrumStoriesMetadata = eval(data);
                  			  if(DEBUG) { alert("[Request_Server] Request Successful. Data Received: \n"+JSON.stringify(data)); 
                  			  
                  			}
                  			
                  			 },
                  			 error: function(response) {
                  				  alert('There was a problem connecting to the server. Please try again.\nError details: '+JSON.stringify(response));
                  				  
                  			  }
                    });
                }
              });
                  
               
              }

function loadScrumStories() {
        var scrumStoriesMetadata;
        var scrumStoriesData;
        var requestJSON;
        var controllerElement = document.querySelector('body');
        var controllerScope = angular.element(controllerElement).scope();
        var workspace_type = controllerScope.workspace_type;
        var workspace_id = controllerScope.workspace_id;
        var project_ID = controllerScope.projectID;

        requestJSON = JSON.stringify({
            "workspace_type": workspace_type,
            "category": "stories",
            "workspace_id": workspace_id
        });

        $.ajax({
            async: false,
            type: "POST",
            url: "/NinjaServices/retrieveMetadata",
            data: requestJSON,
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                scrumStoriesMetadata = eval(data);
                if (DEBUG) {
                    alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

                }

            },
            error: function(response) {
                alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

            }
        });

        requestJSON = JSON.stringify({
            "workspace_type": workspace_type,
            "category": "stories",
            "identifier_name": "PROJECT_ID",
            "identifier_value": project_ID
        });

        $.ajax({
            async: false,
            type: "POST",
            url: "/NinjaServices/getUserData",
            data: requestJSON,
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                scrumStoriesData = eval(data);
                if (DEBUG) {
                    alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

                }

            },
            error: function(response) {
                alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

            }
        });

        if (scrumStoriesMetadata.type && scrumStoriesData.type) {
            //First display metadata
            $("#scrumbacklog").append('<table class="table table-condensed table-hover table-responsive scrum-table" id="scrumtable"><thead></thead><tbody></tbody></table>');
            scrumStoriesMetadata = scrumStoriesMetadata.data;

            var headers = [];
            var isEditable = [];
            for (var i = 0; i < scrumStoriesMetadata.length; i++) {

                if (scrumStoriesMetadata[i].field_display_table == "false" || scrumStoriesMetadata[i].field_order == '' || scrumStoriesMetadata[i].field_order == null) {
                    continue;
                } else {
                    headers.push(scrumStoriesMetadata[i].field_name);
                    isEditable.push(scrumStoriesMetadata[i].field_display_table_editable);
                    $("#scrumbacklog").find("thead").append("<th>" + scrumStoriesMetadata[i].field_label + "</th>");
                }
            }

            scrumStoriesData = scrumStoriesData.data;

            if (scrumStoriesData.length == 0) {
                $("#scrumbacklog").children().find("tbody").append("<tr><td colspan='" + headers.length + "'>There are no stories currently present in this project</td></tr>");
            }
            for (var i = 0; i < scrumStoriesData.length; i++) {
                if (scrumStoriesData[i].STORY_STATUS != "BACKLOG") {
                    continue;
                }
                $("#scrumbacklog").children().find("tbody").append("<tr></tr>");
                for (var j = 0; j < headers.length; j++) {
                    if (headers[j] == "STORY_ID") {
                        $("#scrumbacklog").children().find("tbody").children().last().append('<td>' + scrumStoriesData[i][headers[j]] + '<br /><a href="#"><span class="glyphicon glyphicon-cog scrumedit" aria-hidden="true"></span></a><a href="#"><span class="glyphicon glyphicon-remove scrumremove" aria-hidden="true"></span></a></td>');
                    } else if (headers[j] == "USER_STORY") {
                        0
                        $("#scrumbacklog").children().find("tbody").children().last().append('<td><span class="UserStory-role">As a</span>' +
                            '<span class="UserStory-role-body">' + scrumStoriesData[i][headers[j]].role + '</span>' +
                            '<span class="UserStory-task"><br />I want to</span>' +
                            '<span class="UserStory-task-body">' + scrumStoriesData[i][headers[j]].task + '</span>' +
                            '<span class="UserStory-goal"><br />so I can</span>' +
                            '<span class="UserStory-goal-body">' + scrumStoriesData[i][headers[j]].goal + '</span></td>');
                    } else if (headers[j] == "STORY_STATUS") {
                        $("#scrumbacklog").children().find("tbody").children().last().append('<td>' +
                            '<select>' +
                            '  <option value="Backlog">Backlog</option>' +
                            '  <option value="Sprint1">Sprint 1</option>' +
                            '  <option value="Sprint2">Sprint 2</option>' +
                            '</select>' +
                            '</td>');
                    } else {
                        $("#scrumbacklog").children().find("tbody").children().last().append('<td isEditable="' + isEditable[j] + '" editing="false" class="isEditable" category="stories" field_id="' + headers[j] + '" identifier_name="STORY_ID" identifier_value="' + scrumStoriesData[i].STORY_ID + '">' + scrumStoriesData[i][headers[j]] + '</td>"');
                    }

                }
            }

        } //End of if
    } //End of function

function loadBurndown() {
        var scrumStoriesMetadata;
        var scrumStoriesData;

        var requestJSON;

        var controllerElement = document.querySelector('body');
        var controllerScope = angular.element(controllerElement).scope();

        var workspace_type = controllerScope.workspace_type;
        var workspace_id = controllerScope.workspace_id;
        var project_ID = controllerScope.projectID;

        requestJSON = JSON.stringify({
            "workspace_type": workspace_type,
            "category": "burndown",
            "workspace_id": workspace_id
        });

        $.ajax({
            async: false,
            type: "POST",
            url: "/NinjaServices/retrieveMetadata",
            data: requestJSON,
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                scrumStoriesMetadata = eval(data);
                if (DEBUG) {
                    alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

                }

            },
            error: function(response) {
                alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

            }
        });

        requestJSON = JSON.stringify({
            "workspace_type": workspace_type,
            "category": "burndown",
            "identifier_name": "PROJECT_ID",
            "identifier_value": project_ID
        });

        $.ajax({
            async: false,
            type: "POST",
            url: "/NinjaServices/getUserData",
            data: requestJSON,
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                scrumStoriesData = eval(data);
                if (DEBUG) {
                    alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

                }

            },
            error: function(response) {
                alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

            }
        });

        if (scrumStoriesMetadata.type && scrumStoriesData.type) {
            //First display metadata
            $("#scrumburndown").append('<table class="table table-condensed table-hover table-responsive scrum-table" id="scrumtable"><thead></thead><tbody></tbody></table>');
            scrumStoriesMetadata = scrumStoriesMetadata.data;
            var headers = [];
            var isEditable = [];

            for (var i = 0; i < scrumStoriesMetadata.length; i++) {
                if (scrumStoriesMetadata[i].field_display_table == "false" || scrumStoriesMetadata[i].field_order == '' || scrumStoriesMetadata[i].field_order == null) {
                    continue;
                } else {
                    headers.push(scrumStoriesMetadata[i].field_name);
                    isEditable.push(scrumStoriesMetadata[i].field_display_table_editable);
                    $("#scrumburndown").find("thead").append("<th>" + scrumStoriesMetadata[i].field_label + "</th>");
                }
            }

            scrumStoriesData = scrumStoriesData.data;
            BURNDOWN = scrumStoriesData;
            if (scrumStoriesData.length == 0) {
                $("#scrumburndown").children().find("tbody").append("<tr><td colspan='" + headers.length + "'>There are no burdown entries currently present in this sprint</td></tr>");
            }
            for (var i = 0; i < scrumStoriesData.length; i++) {
                //Need a condition to check burndown of only particular sprint

                $("#scrumburndown").children().find("tbody").append("<tr></tr>");
                for (var j = 0; j < headers.length; j++) {
                    $("#scrumburndown").children().find("tbody").children().last().append('<td isEditable="' + isEditable[j] + '" editing="false" class="isEditable" category="burndown" field_id="' + headers[j] + '" identifier_name="BURNDOWN_ID" identifier_value="' + scrumStoriesData[i].BURNDOWN_ID + '">' + scrumStoriesData[i][headers[j]] + '</td>');
                }
            }

        } //End of if
    } //End of function

function loadResources() {
        var scrumStoriesMetadata;
        var scrumStoriesData;

        var requestJSON;

        var controllerElement = document.querySelector('body');
        var controllerScope = angular.element(controllerElement).scope();

        var workspace_type = controllerScope.workspace_type;
        var workspace_id = controllerScope.workspace_id;
        var project_ID = controllerScope.projectID;

        requestJSON = JSON.stringify({
            "workspace_type": workspace_type,
            "category": "resources",
            "workspace_id": workspace_id
        });

        $.ajax({
            async: false,
            type: "POST",
            url: "/NinjaServices/retrieveMetadata",
            data: requestJSON,
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                scrumStoriesMetadata = eval(data);
                if (DEBUG) {
                    alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

                }

            },
            error: function(response) {
                alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

            }
        });

        requestJSON = JSON.stringify({
            "workspace_type": workspace_type,
            "category": "resources",
            "identifier_name": "PROJECT_ID",
            "identifier_value": project_ID
        });

        $.ajax({
            async: false,
            type: "POST",
            url: "/NinjaServices/getUserData",
            data: requestJSON,
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                scrumStoriesData = eval(data);
                if (DEBUG) {
                    alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

                }

            },
            error: function(response) {
                alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

            }
        });

        if (scrumStoriesMetadata.type && scrumStoriesData.type) {
            //First display metadata
            $("#scrumresources").append('<table class="table table-condensed table-hover table-responsive scrum-table" id="scrumtable"><thead></thead><tbody></tbody></table>');
            scrumStoriesMetadata = scrumStoriesMetadata.data;
            var headers = [];
            var isEditable = [];

            for (var i = 0; i < scrumStoriesMetadata.length; i++) {

                if (scrumStoriesMetadata[i].field_display_table == "false" || scrumStoriesMetadata[i].field_order == '' || scrumStoriesMetadata[i].field_order == null) {
                    continue;
                } else {
                    headers.push(scrumStoriesMetadata[i].field_name);
                    isEditable.push(scrumStoriesMetadata[i].field_display_table_editable);
                    $("#scrumresources").find("thead").append("<th>" + scrumStoriesMetadata[i].field_label + "</th>");
                }
            }

            scrumStoriesData = scrumStoriesData.data;
            if (scrumStoriesData.length == 0) {
                $("#scrumresources").children().find("tbody").append("<tr><td colspan='" + headers.length + "'>There are no resource entries currently present in this project</td></tr>");
            }
            for (var i = 0; i < scrumStoriesData.length; i++) {
                //Need a condition to check burndown of only particular sprint

                $("#scrumresources").children().find("tbody").append("<tr></tr>");
                for (var j = 0; j < headers.length; j++) {
                    $("#scrumresources").children().find("tbody").children().last().append('<td isEditable="' + isEditable[j] + '" editing="false" class="isEditable" category="resources" field_id="' + headers[j] + '" identifier_name="SPRINT_ID" identifier_value="' + scrumStoriesData[i].SPRINT_ID + '">' + scrumStoriesData[i][headers[j]] + '</td>');
                }
            }

            //Then display actual data

        } //End of if
    } //End of function

function loadSprints() {
        var scrumStoriesMetadata;
        var scrumStoriesData;

        var requestJSON;

        var controllerElement = document.querySelector('body');
        var controllerScope = angular.element(controllerElement).scope();

        var workspace_type = controllerScope.workspace_type;
        var workspace_id = controllerScope.workspace_id;
        var project_ID = controllerScope.projectID;

        requestJSON = JSON.stringify({
            "workspace_type": workspace_type,
            "category": "sprints",
            "workspace_id": workspace_id
        });

        $.ajax({
            async: false,
            type: "POST",
            url: "/NinjaServices/retrieveMetadata",
            data: requestJSON,
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                scrumStoriesMetadata = eval(data);
                if (DEBUG) {
                    alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

                }

            },
            error: function(response) {
                alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

            }
        });

        requestJSON = JSON.stringify({
            "workspace_type": workspace_type,
            "category": "sprints",
            "identifier_name": "PROJECT_ID",
            "identifier_value": project_ID
        });

        $.ajax({
            async: false,
            type: "POST",
            url: "/NinjaServices/getUserData",
            data: requestJSON,
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                scrumStoriesData = eval(data);
                if (DEBUG) {
                    alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

                }

            },
            error: function(response) {
                alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

            }
        });

        if (scrumStoriesMetadata.type && scrumStoriesData.type) {
            //First display metadata
            if (scrumStoriesData.data.length == 0) {
                $("#scrumsprint").append('<div><p>There are no sprints preesent in this project. Create one now!</p></div>');
                return;
            } else {
                $("#scrumsprint").append('' +
                    '<ul class="nav nav-pills sprintnav"  role="tablist">' +
                    '</ul>' +
                    '<div class="tab-content">' +
                    '</div>');

                var sprints = [];
                scrumStoriesData = scrumStoriesData.data;
                SPRINTS = scrumStoriesData;
                for (var i = 0; i < scrumStoriesData.length; i++) {
                    if (i == 0) {
                        $("#scrumsprint").find("ul").append('' +
                            '<li role="presentation" class="active">' +
                            '<a href="#' + scrumStoriesData[i].SPRINT_ID + '" aria-controls="sprint1" role="tab" data-toggle="tab">' +
                            '' + scrumStoriesData[i].SPRINT_ID + '' +
                            '</a>' +
                            '</li>');
                    } else {
                        $("#scrumsprint").find("ul").append('' +
                            '<li role="presentation">' +
                            '<a href="#' + scrumStoriesData[i].SPRINT_ID + '" aria-controls="sprint1" role="tab" data-toggle="tab">' +
                            '' + scrumStoriesData[i].SPRINT_ID + '' +
                            '</a>' +
                            '</li>');
                    }
                    $("#scrumsprint").find(".tab-content").append('' +
                        '<div role="tabpanel" class="tab-pane active" id="' + scrumStoriesData[i].SPRINT_ID + '">' +
                        '<table class="table table-condensed table-hover table-responsive scrum-table" id="scrumtable"><thead></thead><tbody></tbody></table>' +
                        '<div>' +
                        '');


                } //End of for

                requestJSON = JSON.stringify({
                    "workspace_type": workspace_type,
                    "category": "stories",
                    "workspace_id": workspace_id
                });

                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/NinjaServices/retrieveMetadata",
                    data: requestJSON,
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(data) {
                        scrumStoriesMetadata = eval(data);
                        if (DEBUG) {
                            alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

                        }

                    },
                    error: function(response) {
                        alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

                    }
                });

                requestJSON = JSON.stringify({
                    "workspace_type": workspace_type,
                    "category": "stories",
                    "identifier_name": "PROJECT_ID",
                    "identifier_value": project_ID
                });

                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/NinjaServices/getUserData",
                    data: requestJSON,
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(data) {
                        scrumStoriesData = eval(data);
                        if (DEBUG) {
                            alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

                        }

                    },
                    error: function(response) {
                        alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

                    }
                });

                if (scrumStoriesMetadata.type && scrumStoriesData.type) {
                    scrumStoriesMetadata = scrumStoriesMetadata.data;
                    scrumStoriesData = scrumStoriesData;

                    var headers = [];
                    var isEditable = [];

                    for (var i = 0; i < scrumStoriesMetadata.length; i++) {

                        if (scrumStoriesMetadata[i].field_display_table == "false" || scrumStoriesMetadata[i].field_order == '' || scrumStoriesMetadata[i].field_order == null) {
                            continue;
                        } else {
                            headers.push(scrumStoriesMetadata[i].field_name);
                            isEditable.push(scrumStoriesMetadata[i].field_display_table_editable);
                            $("#scrumsprint").find("thead").append("<th>" + scrumStoriesMetadata[i].field_label + "</th>");
                        }
                    }

                    scrumStoriesData = scrumStoriesData.data;

                    for (var i = 0; i < scrumStoriesData.length; i++) {

                        $("#" + scrumStoriesData[i].SPRINT_ID + "").find("tbody").append("<tr></tr>");
                        for (var j = 0; j < headers.length; j++) {
                            if (headers[j] == "STORY_ID") {
                                $("#" + scrumStoriesData[i].SPRINT_ID + "").find("tbody").children().last().append('<td>' + scrumStoriesData[i][headers[j]] + '<br /><a href="#"><span class="glyphicon glyphicon-cog scrumedit" aria-hidden="true"></span></a><a href="#"><span class="glyphicon glyphicon-remove scrumremove" aria-hidden="true"></span></a></td>');
                            } else if (headers[j] == "USER_STORY") {
                                0
                                $("#" + scrumStoriesData[i].SPRINT_ID + "").find("tbody").children().last().append('<td><span class="UserStory-role">As a</span>' +
                                    '<span class="UserStory-role-body">' + scrumStoriesData[i][headers[j]].role + '</span>' +
                                    '<span class="UserStory-task"><br />I want to</span>' +
                                    '<span class="UserStory-task-body">' + scrumStoriesData[i][headers[j]].task + '</span>' +
                                    '<span class="UserStory-goal"><br />so I can</span>' +
                                    '<span class="UserStory-goal-body">' + scrumStoriesData[i][headers[j]].goal + '</span></td>');
                            } else if (headers[j] == "STORY_STATUS") {
                                $("#" + scrumStoriesData[i].SPRINT_ID + "").find("tbody").children().last().append('<td>' + scrumStoriesData[i][headers[j]] + '</td>');
                            } else {
                                $("#" + scrumStoriesData[i].SPRINT_ID + "").find("tbody").children().last().append('<td isEditable="' + isEditable[j] + '" editing="false" class="isEditable" category="stories" field_id="' + headers[j] + '" identifier_name="STORY_ID" identifier_value="' + scrumStoriesData[i].STORY_ID + '">' + scrumStoriesData[i][headers[j]] + '</td>');
                            }

                        }
                    }

                } //End of if
            } //End of if
        }
    } //End of function

function loadSprintOverview() {
        var scrumStoriesMetadata;
        var scrumStoriesData;

        var requestJSON;

        var controllerElement = document.querySelector('body');
        var controllerScope = angular.element(controllerElement).scope();

        var workspace_type = controllerScope.workspace_type;
        var workspace_id = controllerScope.workspace_id;
        var project_ID = controllerScope.projectID;

        requestJSON = JSON.stringify({
            "workspace_type": workspace_type,
            "category": "sprints",
            "workspace_id": workspace_id
        });

        $.ajax({
            async: false,
            type: "POST",
            url: "/NinjaServices/retrieveMetadata",
            data: requestJSON,
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                scrumStoriesMetadata = eval(data);
                if (DEBUG) {
                    alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

                }

            },
            error: function(response) {
                alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

            }
        });

        requestJSON = JSON.stringify({
            "workspace_type": workspace_type,
            "category": "sprints",
            "identifier_name": "PROJECT_ID",
            "identifier_value": project_ID
        });

        $.ajax({
            async: false,
            type: "POST",
            url: "/NinjaServices/getUserData",
            data: requestJSON,
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                scrumStoriesData = eval(data);
                if (DEBUG) {
                    alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

                }

            },
            error: function(response) {
                alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

            }
        });

        if (scrumStoriesMetadata.type && scrumStoriesData.type) {
            //First display metadata
            $("#scrumsprintoverview").append('<table class="table table-condensed table-hover table-responsive scrum-table" id="scrumtable"><thead></thead><tbody></tbody></table>');
            scrumStoriesMetadata = scrumStoriesMetadata.data;
            var headers = [];
            var isEditable = [];

            for (var i = 0; i < scrumStoriesMetadata.length; i++) {

                if (scrumStoriesMetadata[i].field_display_table == "false" || scrumStoriesMetadata[i].field_order == '' || scrumStoriesMetadata[i].field_order == null) {
                    continue;
                } else {
                    headers.push(scrumStoriesMetadata[i].field_name);
                    isEditable.push(scrumStoriesMetadata[i].field_display_table_editable);
                    $("#scrumsprintoverview").find("thead").append("<th>" + scrumStoriesMetadata[i].field_label + "</th>");
                }
            }

            scrumStoriesData = scrumStoriesData.data;
            if (scrumStoriesData.length == 0) {
                $("#scrumsprintoverview").children().find("tbody").append("<tr><td colspan='" + headers.length + "'>There are no sprint entries currently present in this project</td></tr>");
            }
            for (var i = 0; i < scrumStoriesData.length; i++) {
                //Need a condition to check burndown of only particular sprint

                $("#scrumsprintoverview").children().find("tbody").append("<tr></tr>");
                for (var j = 0; j < headers.length; j++) {
                    $("#scrumsprintoverview").children().find("tbody").children().last().append('<td isEditable="' + isEditable[j] + '" editing="false" class="isEditable" category="sprints" field_id="' + headers[j] + '" identifier_name="SPRINT_ID" identifier_value="' + scrumStoriesData[i].SPRINT_ID + '">' + scrumStoriesData[i][headers[j]] + '</td>');
                }
            }

        } //End of if
    } //End of function

/* 
 * Graph related functions
 *
 *
 */


function loadBurndownGraph() {


        for (var i = 0; i < SPRINTS.length; i++) {
            $("#scrumstatus").append('<div id="burndowngraph" class="burndowngraph" style="min-width: 310px; width: 800px; height: 400px; margin: 40px auto"></div>');
            var bcategories = [];
            var idealburndown = [];
            var actualburndown = [];
            var start_date = new Date(new String(SPRINTS[i].START_DATE));
            var end_date = new Date(new String(SPRINTS[i].END_DATE));
            var timeDiff = Math.abs(end_date.getTime() - start_date.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            for (var j = 1; j <= diffDays; j++) {
                bcategories.push('Day ' + j);
            }
            var idealDaily = SPRINTS[i].TOTAL_ESTIMATE_HOURS / diffDays;
            for (var j = 0; j < diffDays; j++) {
                idealburndown.push(SPRINTS[i].TOTAL_ESTIMATE_HOURS - ((SPRINTS[i].TOTAL_ESTIMATE_HOURS / diffDays) * j));
            }
            for (var z = 0; z < BURNDOWN.length; z++) {
                if (BURNDOWN[z].SPRINT_ID != SPRINTS[i].SPRINT_ID) {
                    continue;
                }
                actualburndown.push((BURNDOWN[z].REMAINING_HOURS * 1));
            }


            $(function() {
                $("#scrumstatus").children(".burndowngraph").last().highcharts({
                    title: {
                        text: 'Burndown Chart',
                        x: -20 //center
                    },
                    colors: ['blue', '#dc3912'],
                    plotOptions: {
                        line: {
                            lineWidth: 3
                        },
                        tooltip: {
                            hideDelay: 200
                        }
                    },
                    subtitle: {
                        text: '' + SPRINTS[i].SPRINT_ID + '',
                        x: -20
                    },
                    xAxis: {
                        categories: bcategories
                    },
                    yAxis: {
                        title: {
                            text: 'Hours'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1
                        }]
                    },
                    tooltip: {
                        valueSuffix: ' hrs',
                        crosshairs: true,
                        shared: true
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    series: [{
                        name: 'Ideal Burn',
                        color: '#dc3912',
                        lineWidth: 2,
                        data: idealburndown
                    }, {
                        name: 'Actual Burn',
                        color: 'rgba(0,120,200,0.75)',
                        marker: {
                            radius: 6
                        },
                        data: actualburndown
                    }]
                });
            });
        } //End of main for loop
    } //End of function

function loadWaterfallGraph() {
        var requestJSON;
        var scrumStoriesMetadata;
        var taskstatus = [];
        var controllerElement = document.querySelector('body');
        var controllerScope = angular.element(controllerElement).scope();
        var workspace_type = controllerScope.workspace_type;
        var workspace_id = controllerScope.workspace_id;
        var project_ID = controllerScope.projectID;

        requestJSON = JSON.stringify({
            "workspace_type": workspace_type,
            "category": "tasks",
            "identifier_name": "PROJECT_ID",
            "identifier_value": project_ID
        });

        $.ajax({
            async: false,
            type: "POST",
            url: "/NinjaServices/getUserData",
            data: requestJSON,
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                scrumStoriesMetadata = eval(data);
                if (DEBUG) {
                    alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

                }

            },
            error: function(response) {
                alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

            }
        });

        if (scrumStoriesMetadata.type && scrumStoriesMetadata.data.length > 0) {
            scrumStoriesMetadata = scrumStoriesMetadata.data;

            for (var i = 0; i < scrumStoriesMetadata.length; i++) {
                var temp = [scrumStoriesMetadata[i].TASK_ID + '\n' + scrumStoriesMetadata[i].TASK_NAME, scrumStoriesMetadata[i].PRCNT_COMPLETE];
                taskstatus.push(temp);
            }

            $(function() {
                $('#waterfallgraph').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Waterfall Project Status'
                    },
                    xAxis: {
                        type: 'category',
                        labels: {
                            rotation: -45,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif'
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Percentage Complete'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        pointFormat: 'Completion of task: <b>{point.y:.1f} %</b>'
                    },
                    series: [{
                        name: 'tasks status',
                        data: taskstatus,
                        dataLabels: {
                            enabled: true,
                            rotation: -90,
                            color: '#FFFFFF',
                            align: 'right',
                            format: '{point.y:.1f}', // one decimal
                            y: 10, // 10 pixels down from the top
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif'
                            }
                        }
                    }]
                });
            });

        } //End of main if
    } //End of the function - loadWaterfallGraph

function loadKanbanGraph() {

    } //End of function
    
/*
 * Field editing related code
 */
 
 function saveData(buttbutton) {
                //alert("save button clicked!");
                var newText = $(buttbutton).parent().find("input").val();
                //alert(newText);
                $(buttbutton).parent().removeAttr("editing");
                
                $(buttbutton).parent().html(newText);
                
              }
              
              