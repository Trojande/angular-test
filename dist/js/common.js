var app = angular.module('testApp', []);

app.controller('testController', function($scope, $interval, $timeout, $http) {
    const psi = 0.00001;
    const fullwidth = 114;
    $scope.target = 15;
    $scope.load = function() {
        $http.get('http://alex.devel.softservice.org/testapi/').
            then(function success(response) {
                $scope.balance=response.data.balance_usd;
                $scope.toTarget = $scope.target - $scope.balance;
                $scope.int = [true,true];
                $scope.notint = [false,false];
                $scope.decimalCheck();
                $('.progress__bar').animate({
                    width: fullwidth * ($scope.balance / $scope.target)
                }, 1500, function() {
                    $scope.startInterval();
                });
                
        }, function error(response) {
            alert("Error "+response.status +". Check your internet connection and refresh the page.");
        })
    }
    $scope.startInterval = function() {
        stop = $interval(function() {
        $scope.balance = $scope.balance + 0.2;
        $scope.toTarget = $scope.target - $scope.balance;
        $scope.decimalCheck();
        ChangePosition($scope.balance / $scope.target, fullwidth);
        if ($scope.toTarget <= psi) {
            $scope.int[0] = true;
            $scope.notint[0] = false;
            $scope.stopInterval();
            $('.label').css('background','#00A910');
        }
    }, 2000)
    }
    $scope.decimalCheck = function() {
        if (($scope.balance -  Math.floor($scope.balance)) > psi ) {
            $scope.int[0] = false;
            $scope.notint[0] = true;
        } else {
            $scope.int[0] = true;
            $scope.notint[0] = false;
        };
        if (($scope.toTarget - Math.floor($scope.toTarget)) > psi) {
            $scope.int[1] = false;
            $scope.notint[1] = true;
        } else {
            $scope.int[1] = true;
            $scope.notint[1] = false;
        };
    }    
    $scope.stopInterval = function() {
        $interval.cancel(stop);
        stop = undefined;
    }
    $scope.load();
    

});


        
function ChangePosition(percent, fullwidth) {
    
    $('.progress__bar').animate({
        width: fullwidth * percent
    }, 1000);
    
}