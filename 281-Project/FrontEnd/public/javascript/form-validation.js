/*
Functions to validate the forms 

*/

//Create an application
angular.module('ninjaApp',[]).controller('loginController',
function loginController($scope, $http, $location){

//Initialize
$scope.signupErrorMessage="";
$scope.loginErrorMsg="";

$scope.login = function() {
    $http({
        method: 'POST',
        url: '/login',
        data: {
            'Username': $scope.email.toLowerCase(),
            'Password': $scope.password
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }).success(function(data, status) {

        if (data == 'Success') {

            //redirect to user homepage
            window.location = '/home/' + $scope.email.toLowerCase();
        }
        else if (data == 'Fail') {
            $scope.loginErrorMsg = " ** Please enter valid credentials";
        }

    }).
    error(function(data, status) {
        alert("Authentication failed.. Please try again!");

    });
}

$scope.signUp=function(){
  
    if(!$scope.firstname.match(/^[A-z]+$/)){
     $scope.signupErrorMessage="** Please enter valid FirstName";    
    }
    else if(!$scope.lastname.match(/^[A-z]+$/)){
     $scope.signupErrorMessage="** Please enter valid LastName";    
    }
    else if($scope.newpassword != $scope.re_enter_newpassword){
     $scope.signupErrorMessage="** Passwords do not match";
     return;
    }
     $http({
        method: 'POST',
        url: '/signup',
        data: {
            'userEmailId': $scope.newemail.toLowerCase(),
            'userPassword': $scope.newpassword,
            'userFirstName' : $scope.firstname,
            'userLastName' : $scope.lastname
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }).success(function(data, status) {

        if (data == 'Success') {

            //redirect to user homepage
            window.location = '/home/' + $scope.newemail.toLowerCase();
        }
        else if (data == 'Exists') {
            $scope.loginErrorMsg = "You already own an account. Please login.. ";
        }
         else {
             alert("SignUp failed.. Please try again!");
        }

    }).
    error(function(data, status) {
        alert("SignUp failed.. Please try again!");

    });
}


}
);



