'use strict';

angular.element(window).on('keydown', function(e) 
{
	if (e.keyCode == 37)
	{
		var element = document.getElementById('player'),
		style = window.getComputedStyle(element),
		left = parseInt(style.getPropertyValue('left'));
		if (left == 250)
			left = 70;
		var ans = '' + left + 'px';
		document.getElementById('player').style.left = ans;
	}
	
	if (e.keyCode == 39)
	{
		var element = document.getElementById('player'),
		style = window.getComputedStyle(element),
		left = parseInt(style.getPropertyValue('left'));
		if (left == 70)
			left = 250;
		var ans = '' + left + 'px';
		document.getElementById('player').style.left = ans;
	}
});

/**
 * @ngdoc function
 * @name road66App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the road66App
 */
angular.module('road66App')
  .controller('MainCtrl', function ($scope, $http,$interval) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.enemyPos;
	$scope.move = 0;
	$scope.game = 0;
	$scope.score = 0;
	$scope.begin = 0;
	$scope.rand;
	$scope.collision = 0;
	$scope.high = 0;
	$scope.highScore;
	
	$scope.play = function ()
	{
        $scope.begin = 1;
		$scope.game = 1;
    };
	
	$scope.highScore = function () 
	{

        $http({
				method:'GET',
				url:'http://localhost:8080/highscore',
				
			}).then(function successCallback(response) {
				$scope.highScore=response.data;
				console.log($scope.highScore)
			},function errorCallback(response) {

			});
		$scope.high = 1;
    };
	
	$scope.registerScore = function ()
	{
		if ($scope.playerName == '')
		{

			$http({
				method:'GET',
				url:'http://localhost:8080/register',
				params:{
					name:'anonymous',
					score:$scope.score
				}
			}).then(function successCallback(response) {
				console.log(response)
				console.log('score added successfully');
			},function errorCallback(response) {

			});
		}
		else{
			http({
				method:'GET',
				url:'http://localhost:8080/register',
				params:{
					name:$scope.playerName,
					score:$scope.score
				}
			}).then(function successCallback(response) {
				console.log(response)
				console.log('score added successfully');
			},function errorCallback(response) {

			});
			
		}
		$scope.begin = 0;
		$scope.game = 0;
    };
	    
    $scope.getNumber = function () 
	{
		$http.get("http://localhost:8080/rand").
        success(function(data, status) {
            $scope.rand = data.rand;
        }).
		error(function(data, status) {
            console.log('unknown error');
        });
	};
	
	$scope.checkCollision = function () 
	{
		var player = document.getElementById('player'),
		style = window.getComputedStyle(player),
		playerX = parseInt(style.getPropertyValue('left'));
		var enemy = document.getElementById('enemy'),
		style = window.getComputedStyle(enemy),
		enemyX = parseInt(style.getPropertyValue('left'));
		var enemy3 = document.getElementById('enemy'),
		style = window.getComputedStyle(enemy3),
		enemyY = parseInt(style.getPropertyValue('top'));


		http({
				method:'GET',
				url:'http://localhost:8080/collision',
				params:{
					playerX:playerX,
					enemyX:enemyX,
					enemyY:enemyY
				}
			}).then(function successCallback(response) {
				$score.collision=response.data.collision;
			},function errorCallback(response) {

			});

		
		if ($scope.collision == 1)
		{
			$scope.game = 0;
		}
	};
	
	$scope.generateCar = function () 
	{
		document.getElementById('enemy').style.top = '-150px';
		if ($scope.rand == 1)
		{
			document.getElementById('enemy').style.left = '250px';
		}
		else
		{
			document.getElementById('enemy').style.left = '70px' ;
		}
	};
	
	$scope.moveRoad = function ()
	{
		var element = document.getElementById('road'),
		style = window.getComputedStyle(element),
		top = parseInt(style.getPropertyValue('top'));
		top += 10;
		if (top >= -100)
			top = -500;
		
		var ans = '' + top + 'px';
		document.getElementById('road').style.top = ans;
	};
	
	$scope.moveEnemy = function () 
	{
		var element = document.getElementById('enemy'),
		style = window.getComputedStyle(element),
		top = parseInt(style.getPropertyValue('top'));
		top += 10;
		var ans = '' + top + 'px';
		document.getElementById('enemy').style.top = ans;
		/// console.log(ans);	
	};
	
	$scope.updateScore = function ()
	{
		$scope.score = $scope.score + 10;
	};
	
	$interval(function()
	{
		if ($scope.game == 1)
		{
			$scope.getNumber();
			$scope.generateCar();
		}
	},3000);

	$interval(function()
	{
		if ($scope.game == 1)
		{
			$scope.moveRoad();
			$scope.moveEnemy();
			$scope.checkCollision();
			$scope.updateScore();
			
			var element = document.getElementById('enemy'),
			style = window.getComputedStyle(element),
			top = parseInt(style.getPropertyValue('top'));
			
			//console.log(top);
		}	
	},20);

  });
