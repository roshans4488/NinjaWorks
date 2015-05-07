/*
Functions to validate the forms 

*/

//Create an application
angular.module('ninjaApp', ['ui.bootstrap', 'xeditable', 'ngDialog']).controller('userhome',
    function userhome($scope, $http, $location, ngDialog) {

        $scope.user = {
            name: 'awesome user'
        };
        $scope.formData = {};

        //User Email ID 
        var urlPath = $location.absUrl().split('/');
        if (urlPath.length > 1) {
            $scope.userEmailID = urlPath[urlPath.length - 1];

        }

        //Initialize flag variables to show/hide html sections
        $scope.showDivFlag = 1;
        $scope.showWorkspaceFlag = 0;
        $scope.showProjectFlag = 0;
       
        //  $scope.taskSelected="** Select a task from the list to view comments** ";

        //Home tab function
        $scope.home = function() {
            $scope.showDivFlag = 1;
            $scope.showWorkspaceFlag = 0;
        }

        //This function gets the projects for a workspace
        $scope.viewWorkspace = function() {
            $http({
                method: 'POST',
                url: '/NinjaServices/getUserData',
                data: {
                    "identifier_name": "WORKSPACE_ID",
                    "workspace_type": $scope.workspace_type,
                    "category": "projects",
                    "identifier_value": $scope.workspace_id
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(data, status) {


                $scope.projectDetails = data;
                console.log("Return data : " + JSON.stringify($scope.projectDetails));
                $scope.showDivFlag = 2;
                $scope.showProjectFlag = 0;
                

            }).
            error(function(data, status) {
                alert("Get workspace objects failed.. Please click on a workspace again...");

            });

        }

         //Load Task Metadata
     $scope.taskMetadataFunc = function() {
         $http({
             method: 'POST',
             url: '/NinjaServices/retrieveMetadata',
             data: {
                 "workspace_type": $scope.workspace_type,
                 "category": "tasks",
                 "workspace_id": $scope.workspace_id
             },
             headers: {
                 'Content-Type': 'application/json'
             }
         }).success(function(data, status) {
             $scope.taskMetadata=[]; //Initialize metadata
             for(var i=0;i<data.data.length;i++){
                 if(data.data[i].field_name =='PROJECT_ID'){
                     continue;
                 }
                 else if(data.data[i].field_name =='COMMENTS'){
                     continue;
                 }
                 $scope.taskMetadata.push(data.data[i]);
                 
             }
            console.log("New Metadata : " +JSON.stringify($scope.taskMetadata));

         }).error(function(data, status) {})
     }
     




        //Get tasks for a project

        $scope.getTasks = function(projectID) {

            $http({
                method: 'POST',
                url: '/NinjaServices/getUserData',
                data: {
                    "identifier_name": "PROJECT_ID",
                    "workspace_type": $scope.workspace_type,
                    "category": "tasks",
                    "identifier_value": projectID
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(data, status) {
                    

                $scope.TasksDetails = data.data;
                $scope.taskMetadataFunc(); //Call metadata retrieve function
                for (i = 0; i < $scope.TasksDetails.length; i++) {
                    $scope.TasksDetails[i].PRCNT_COMPLETE = Number($scope.TasksDetails[i].PRCNT_COMPLETE);
                    $scope.TasksDetails[i].ACTUAL_START_DATE = new Date($scope.TasksDetails[i].ACTUAL_START_DATE);
                    $scope.TasksDetails[i].ACTUAL_FINISH_DATE = new Date($scope.TasksDetails[i].ACTUAL_FINISH_DATE);
                    $scope.TasksDetails[i].PLANNED_START_DATE = new Date($scope.TasksDetails[i].PLANNED_START_DATE);
                    $scope.TasksDetails[i].PLANNED_FINISH_DATE = new Date($scope.TasksDetails[i].PLANNED_FINISH_DATE);
                    console.log("Key :" +Object.keys($scope.TasksDetails[i]));
                    $scope.TasksDetails[i].keys=Object.keys($scope.TasksDetails[i]);
                }
                console.log("Return Task data : " + JSON.stringify($scope.TasksDetails));

            }).
            error(function(data, status) {
                alert("Get tasks objects failed.. Please click on a project again...");

            });
        }

        //This functions gets the workspaces for a user
        $scope.getWorkspaces = function() {
            $http({
                method: 'POST',
                url: '/common/getUserWorkspaces',
                data: {
                    'user_email_id': $scope.userEmailID
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(data, status) {
                $scope.workspaces = data;
                console.log($scope.workspaces);

            }).
            error(function(data, status) {
                alert("Workspaces could not be loaded.. Please refresh the page!");

            });

        }

        //Call the function on page load
        $scope.getWorkspaces();


        //Function to display selected workspace details
        $scope.displayWorkspace = function(workspace_id, workspace_name, workspace_type, workspace_permissions, workspace_Description) {
            $scope.workspace_id = workspace_id;
            $scope.workspace_name = workspace_name;
            $scope.workspace_type = workspace_type;
            $scope.workspace_permissions = workspace_permissions;
            $scope.workspace_description = workspace_Description;
            $scope.showWorkspaceFlag = 1;
        }

        //Display project details of a selected project
        $scope.displayProject = function(project) {

            $scope.projectID = project.PROJECT_ID;
            $scope.projectName = project.PROJECT_NAME;
            $scope.projectDescription = project.PROJECT_DESCRIPTION;
            $scope.projectComment = project.PROJECT_COMMENTS;
            $scope.resources = project.RESOURCES;
            $scope.getTasks($scope.projectID);
            $scope.showProjectFlag = 1;
          
        }

        //Create a workspace
        $scope.createWorkspace = function() {

            //Set error message to null
            $scope.createWorkspaceErrorMessage = "";
            if ($scope.showWorkspaceFlag != 2) {
                $http.get('/newworkspaceid').
                success(function(data, status, headers, config) {
                    $scope.newWorkspaceID = data.Workspace_ID;
                    $scope.showWorkspaceFlag = 2;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    alert("Get new workspace id failed");
                });

            }
            else {
                if (!$scope.newWorkspaceName) {
                    $scope.createWorkspaceErrorMessage = "Please enter workspace name";
                    return;
                }
                if (!$scope.newWorkspaceDescription) {
                    $scope.createWorkspaceErrorMessage = "Please enter workspace description";
                    return;
                }
                if (!$scope.modelSelected) {
                    $scope.createWorkspaceErrorMessage = "Please select a value from list to proceed";
                    return;
                }
                $http({
                    method: 'POST',
                    url: '/createworkspace',
                    data: {

                        "workspace_id": $scope.newWorkspaceID,
                        "workspace_name": $scope.newWorkspaceName,
                        "workspace_description": $scope.newWorkspaceDescription,
                        "workspace_type": $scope.modelSelected,
                        "user_email_id": $scope.userEmailID
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(data, status) {

                    if (data == "Success") {

                        //Re-load workspaces
                        $scope.getWorkspaces();

                        //Re-set form values
                        $scope.cancelCreateWorkspace();

                    }



                }).
                error(function(data, status) {
                    alert("Create a new workspace failed");

                });
            }

        }


        //Cancel Create workspace
        $scope.cancelCreateWorkspace = function() {
            $scope.newWorkspaceID = "";
            $scope.newWorkspaceName = "";
            $scope.newWorkspaceDescription = "";
            $scope.modelSelected = "";
            $scope.showWorkspaceFlag = 0;
        }

        //Edit a workspace
        $scope.editWorkspace = function() {

        }

        //Create a new project
        $scope.createProject = function() {
            if ($scope.showProjectFlag != 2) {
              
                $http({
                    method: 'POST',
                    url: '/NinjaServices/generateUniqueId',
                    data: {
                        "workspace_type": $scope.workspace_type,
                        "category": "PROJECTS",
                        "identifier_name": "PROJECT_ID",
                        "parent_identifier": "WORKSPACE_ID",
                        "parent_identifier_value": $scope.workspace_id
                    }

                    ,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(data, status) {
                    //Set the newproject id field
                  
                    //$scope.newProjectID=data.data[0].PROJECT_ID;
                  
                  console.log(data);
                     console.log(data.data.length);
                    console.log("Project data : " + JSON.stringify(data));
                  
                  var projectID;
                  if(data.data.length == 0)
                    {
                        
                            projectID = "P1";
                            $scope.newProjectID = projectID;
                        
                    }
                    
                    
                    
                    else
                    {
                    
                        $scope.ProjectDetails = data.data[0];
                    
                     var projectData = $scope.ProjectDetails;
             
               
                        var ID = Number(projectData.PROJECT_ID.match(/\d+/)[0]) + 1;
                        var pre = projectData.PROJECT_ID.replace(/[0-9]/g, '');

                        projectID = pre + ID;
                         $scope.newProjectID = projectID;
                    
                    }
                    

                    
                    $scope.showProjectFlag = 2;
                }).
                error(function(data, status) {
                    alert("Create a new project failed");

                });

                $scope.showProjectFlag = 2;
            }
            else {

               

                $http({
                    method: 'POST',
                    url: '/NinjaServices/createUserData',

                    data: {
                        "workspace_type": $scope.workspace_type,
                        "category": "PROJECTS",
                        "data": {
                            "PROJECT_ID": $scope.newProjectID,
                            "WORKSPACE_ID": $scope.workspace_id,
                            "PROJECT_NAME": $scope.newProjectName,
                            "PROJECT_DESCRIPTION": $scope.newProjectDescription,
                            "PROJECT_COMMENTS": $scope.newProjectName + " created",
                            "RESOURCES": []
                        }

                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(data, status) {

                    console.log("Created: " + JSON.stringify(data));
                    $scope.viewWorkspace();


                }).
                error(function(data, status) {
                    alert("Create failed");

                });




            }
        }

        //Cancel Create workspace
        $scope.cancelCreateProject = function() {
            $scope.newProjectID = "";
            $scope.newProjectName = "";
            $scope.newProjectDescription = "";
            $scope.showProjectFlag = 0;
        }


        //View a project
        $scope.viewProject = function() {

            $scope.showDivFlag = $scope.workspace_type;

            if ($scope.showDivFlag == 'scrum') {
                initializeScrumWorkspace();
            }
            else if ($scope.showDivFlag == 'kanban') {
                $scope.loadKanban();
                loadKanbanGraph();
            }
            else if ($scope.showDivFlag == 'waterfall') {
                $scope.getTasks($scope.projectID);
                loadWaterfallGraph();
            }
        }




        //Update field data for waterfall
        $scope.updateField = function(category, uniqueField, uniqueID, subField, subFieldId, updateField, $data) {

            $http({
                method: 'POST',
                url: '/NinjaServices/updateUserData',

                data: {
                    "workspace_type": $scope.workspace_type,
                    "category": category,
                    "identifier_name": uniqueField,
                    "identifier_value": uniqueID,
                    "subField": subField,
                    "subFieldId": subFieldId,
                    "update_field": updateField,
                    "new_value": $data
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(data, status) {
                //Set the newproject id field
                //alert("Test" + JSON.stringify(data));
                //$scope.newProjectID=data.data[0].PROJECT_ID;

                console.log("Updated data : " + JSON.stringify(data));

            }).
            error(function(data, status) {
                alert("Update failed");

            });

        }


        //Update field data for waterfall
        $scope.updateSubField = function(category, uniqueField, uniqueID, subField, subFieldId, updateField, $data) {
          
            $http({
                method: 'POST',
                url: '/NinjaServices/updateUserData',

                data: {
                    "workspace_type": $scope.workspace_type,
                    "category": category,
                    "identifier_name": uniqueField,
                    "identifier_value": uniqueID,
                    "update_field": updateField,
                    "new_value": $data
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(data, status) {
                //Set the newproject id field
                //alert("Test" + JSON.stringify(data));
                //$scope.newProjectID=data.data[0].PROJECT_ID;

                console.log("Updated data : " + JSON.stringify(data));

            }).
            error(function(data, status) {
                alert("Update failed");

            });

        }





        //Calculate percentage completion for waterfall model project
        $scope.waterfallStatus = function() {
          
          loadWaterfallGraph();
            
        }

        //Share workspace
        $scope.shareWorkspace = function() {
            ngDialog.open({
                template: '../templates/share-workspace.html',
                controller: 'userhome',
                className: 'ngdialog-theme-default ngdialog-theme-custom'
            });
        }



        //Add new Resource
        $scope.addResource = function() {


            ngDialog.open({
                template: '../templates/add-resource.html',
                controller: 'userhome',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                scope: $scope

            });
        }


        $scope.addResourceDetails = function() {

            ngDialog.close();
           

            $http({
                method: 'POST',
                url: '/NinjaServices/generateUniqueId',
                data: {
                    "workspace_type": $scope.workspace_type,
                    "category": "RESOURCES",
                    "identifier_name": "RESOURCE_ID",
                    "parent_identifier": "PROJECT_ID",
                    "parent_identifier_value": $scope.projectID
                }

                ,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(data, status) {
                //Set the new resource id field


                if (data.data.length == 0) {
                    newResourceId = "R1";


                    console.log(newResourceId);
                    console.log(JSON.stringify(newResourceId));
                }
                else {

                    var newResourceId = data.data[0];
                    newResourceId = newResourceId.RESOURCE_ID

                    var ID = Number(newResourceId.match(/\d+/)[0]) + 1;
                    var pre = newResourceId.replace(/[0-9]/g, '');

                    var newResourceId = pre + ID;

                }


                var newResource = [{
                    "RESOURCE_ID": newResourceId,
                    "RESOURCE_NAME": $scope.newResourceName,
                    "EMAIL": $scope.email,
                    "TYPE": $scope.type,
                    "PHONE": $scope.phone
                }];

                $http({
                    method: 'POST',
                    url: '/NinjaServices/updateUserData',

                    data: {
                        "workspace_type": $scope.workspace_type,
                        "category": "projects",
                        "identifier_name": "PROJECT_ID",
                        "identifier_value": $scope.projectID,
                        "subField": null,
                        "subFieldId": null,
                        "update_field": "RESOURCES",
                        "new_value": newResource[0]
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(data, status) {
                    //Set the newproject id field
                    //alert("Test" + JSON.stringify(data));
                    //$scope.newProjectID=data.data[0].PROJECT_ID;

                    console.log("Updated data : " + JSON.stringify(data));

                }).
                error(function(data, status) {
                    alert("Update failed");

                });



            }).
            error(function(data, status) {
                alert("Error getting new resource Id.");

            });


        }


          $scope.addTask = function() {
   
            ngDialog.open({
                template: '../templates/add-task.html',
                controller: 'userhome',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                scope: $scope

            });
        }



         $scope.addNewTask = function() {
        console.log("add new task");
      
            var newTaskId;
              
                $http({
                    method: 'POST',
                    url: '/NinjaServices/generateUniqueId',
                    data: {
                        "workspace_type": $scope.workspace_type,
                        "category": "TASKS",
                        "identifier_name": "TASK_ID",
                        "parent_identifier": "PROJECT_ID",
                        "parent_identifier_value": $scope.projectID
                    }

                    ,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(data, status) {
                    //Set the task id field
                    
               
               if (data.data.length == 0) {
                    newTaskId = "PWT1";

                }
                else {

                    newTaskId = data.data[0];
                    newTaskId = newTaskId.TASK_ID;

                    var ID = Number(newTaskId.match(/\d+/)[0]) + 1;
                    var pre = newTaskId.replace(/[0-9]/g, '');

                    newTaskId = pre + ID;

                }
                    
                    
                
                  
                    $scope.TaskID = newTaskId;

                   
                    console.log("new task id");
               console.log($scope.TaskID);
              
             
                $http({
                    method: 'POST',
                    url: '/NinjaServices/createUserData',



                    data: {
                         "workspace_type": $scope.workspace_type,
                        "category": "tasks",
                  "data": {  "TASK_ID": $scope.TaskID,
                    "PROJECT_ID": $scope.projectID,
                    "TASK_NAME": $scope.newTaskName,
                    "ACTUAL_START_DATE": $scope.actualStartDate,
                    "ACTUAL_FINISH_DATE": $scope.actualFinishDate,
                    "ACTUAL_DURATION": "",
                    "PREDECESSOR": $scope.predecessor,
                    "PLANNED_START_DATE": $scope.plannedStartDate,
                    "PLANNED_FINISH_DATE": $scope.plannedFinishDate,
                    "PLANNED_DURATION": "",
                    "PRCNT_COMPLETE": $scope.percentCompleted,
                    "COMMENTS": []
                  }

                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(data, status) {

                    console.log("Task Created: " + JSON.stringify(data));
                     ngDialog.close();


                }).
                error(function(data, status) {
                    alert("Task creation failed");

                });  


                }).
                error(function(data, status) {
                    alert("Create a new task failed");

                });

        
        
        }



    

        //Load kanban board on click
        $scope.loadKanban = function() {
            $http({
                method: 'POST',
                url: '/NinjaServices/getUserData',
                data: {
                    "identifier_name": "PROJECT_ID",
                    "workspace_type": $scope.workspace_type,
                    "category": "lanes",
                    "identifier_value": $scope.projectID
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(data, status) {

                $scope.LaneDetails = data;

                //call api to metadata
                $http({
                    method: 'POST',
                    url: '/NinjaServices/retrieveMetadata',
                    data: {
                        "workspace_type": $scope.workspace_type,
                        "category": "LANES",
                        "workspace_id" :$scope.workspace_id
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(data, status) {

                    $scope.LaneDetails.metadata = data.data;
                    
                  
                    
                  //////////////////////////////////////////////////////////////////////////
                  
                  
                  
                  
                     $http({
                method: 'POST',
                url: '/NinjaServices/getUserData',
                data: {
                    "identifier_name": "PROJECT_ID",
                    "workspace_type": $scope.workspace_type,
                    "category": "cards",
                    "identifier_value": $scope.projectID
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(data, status) {

                $scope.CardDetails = data;

                //call api to metadata
                $http({
                    method: 'POST',
                    url: '/NinjaServices/retrieveMetadata',
                    data: {
                        "workspace_type": $scope.workspace_type,
                        "category": "cards",
                        "workspace_id" :$scope.workspace_id
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(data, status) {

                    $scope.CardDetails.metadata = data.data;
                     console.log("Cards");
                     console.log(data);
                         
                         console.log($scope.CardDetails);
                     
                  
                    

                }).
                error(function(data, status) {
                    alert("Get lane object metadata failed.. Please refresh again...");

                });


            }).
            error(function(data, status) {
                alert("Get lane objects failed.. Please refresh again...");

            });
                  
                  
                  
                  ////////////////////////////////////////////////////////////////////////
                    
                    
                    
                    

                }).
                error(function(data, status) {
                    alert("Get lane object metadata failed.. Please refresh again...");

                });


            }).
            error(function(data, status) {
                alert("Get lane objects failed.. Please refresh again...");

            });
        }

       

        
    }
);
