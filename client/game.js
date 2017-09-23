var angularApp = angular.module('GameApp', []);

angular.element(window).on('keydown', function(even) 
{
	if (even.keyCode == 37) //left button
	{
		var element = document.getElementById('player'),
		style = window.getComputedStyle(element),
		left = parseInt(style.getPropertyValue('left'));
		if (left == 250)
			left = 70;
		var ans = '' + left + 'px';
		document.getElementById('player').style.left = ans;
	}
	
	if (even.keyCode == 39) //right button
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

angularApp.controller('GameCtrl', function ($scope, $http,$interval)
 {
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
        $scope.high = 1;
		
		$http.get("http://localhost:8080/highscore").
        success(function(data, status)
		{
            $scope.highScore = data;
			///for (var i in data)
			///	console.log(data[i].name + ' : ' + data[i].score);
        }).
		error(function(data, status)
		{
            console.log('unknown error');
        });
    };
	
	$scope.registerScore = function ()
	{
		/// console.log(document.getElementById('nameI').value);
		if (document.getElementById('name').value == '')
		{
			$http.get("http://localhost:8080/register?name=No name&score=" + $scope.score).
			success(function(data, status) {
				console.log('score added successfully');
			}).
			error(function(data, status) {
				console.log(status);
			});
			$scope.begin = 0;
			$scope.game = 0;
		}
		else
		{
			$http.get("http://localhost:8080/register?name=" + document.getElementById('name').value + "&score=" + $scope.score).
			success(function(data, status) {
				console.log('score added successfully');
			}).
			error(function(data, status) {
				console.log(status);
			});
			$scope.begin = 0;
			$scope.game = 0;
		}
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
		
		$http.get("http://localhost:8080/collision?playerX=" + playerX + "&enemyX=" + enemyX + "&enemyY=" +enemyY).
              success(function(data, status) {
                $scope.collision = data.collision;
				/// console.log($scope.collision);
              }).
              error(function(data, status) {
                console.log('unknown error');
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
			
		}	
	},20);
});