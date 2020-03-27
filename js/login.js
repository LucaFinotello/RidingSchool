app.controller("login", ["$scope", "$rootScope", function($scope, $rootScope) {
	$rootScope.logged_user = undefined;

	$scope.key = utenti_chiavi; // true | false | undefined
	
	$scope.loginBean = {};

	$scope.toggle_key = function() {
		$scope.key = !$scope.key;
		$scope.loginBean = {};
		$scope.focus_by_id("username");
	}

	$rootScope.login = function(username, password, ricordami) {
		if (username && (password || $scope.key)) {
			$rootScope.pl_loading++;
			return $scope.ajax("api/login/login.php", {
				username: username
				,password: $scope.key ? null : password
				,ricordami: ricordami
			}).then(
				(response) => {return $rootScope.login_controlla()}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject("no username or password or key");
	}

	$rootScope.login_controlla = function() {
		return $scope.ajax(
			"api/login/ricordami.php"
			,{}
			,true
		).then(
			(response) => {
				$rootScope.logged_user = response;
				return Promise.resolve($rootScope.logged_user);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.logout = function() {
		return $scope.ajax(
			"api/login/logout.php"
			,{}
			,true
		).then(
			(response) => {
				localStorage.clear();
				$rootScope.logged_user = undefined;
				return Promise.resolve(response);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.change_password = function(username) {
		let dialog = {};
		dialog.clickOutsideToClose = true;
		dialog.title = "Cambia password";
		dialog.class = "";
		dialog.content_tmpl = "tmpl/change_password.tmpl.html";
		dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
		dialog.disabledform = false;
		dialog.editableform = true;

		dialog.username = username ? username : $rootScope.logged_user.username;
		dialog.fl_force = username && username != $rootScope.logged_user.username; //questo dovrebbe significare anche che sono admin...

		return $scope.alert(dialog).then(
			(answer) => {
				return $scope.ajax(
					"api/login/change_password.php"
					,{
						username: answer.username
						,old_password: answer.old_password
						,new_password: answer.new_password
					}
					,true
				).then(
					(response) => {
						$scope.toast(response);
						return Promise.resolve(response);
					}
					,(response) => {return Promise.reject(response)}
				);
			}
			,(answer) => {return Promise.reject(answer)}
		);
	}
}]);