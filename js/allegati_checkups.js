app.controller("allegati_checkups", ["$rootScope", "$scope", function($rootScope, $scope) {
	$rootScope.allegati_checkups = $rootScope.allegati_checkups ? $rootScope.allegati_checkups : {};

	$rootScope.select_allegati_checkups = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "AllegatoCheckupBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.allegati_checkups.righe = [];
				$rootScope.allegati_checkups.map = {};
				$rootScope.push_allegato_checkup(response);
				return Promise.resolve($rootScope.allegati_checkups.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.push_allegato_checkup = function(allegato_checkup) {
		if (allegato_checkup) {
			if (Array.isArray(allegato_checkup)) {
				for (let i = 0; i < allegato_checkup.length; i++) {
					$rootScope.push_allegato_checkup(allegato_checkup[i]);
				}
			} else {
				$scope.push($rootScope.allegati_checkups.righe, allegato_checkup);
				$rootScope.allegati_checkups.map[allegato_checkup.ac_idallegato] = $rootScope.allegati_checkups.map[allegato_checkup.ac_idallegato] ? $rootScope.allegati_checkups.map[allegato_checkup.ac_idallegato] : {};
				$rootScope.allegati_checkups.map[allegato_checkup.ac_idallegato][allegato_checkup.ac_idcheckup] = allegato_checkup;
			}
		}
	}

	$rootScope.insert_allegato_checkup = function(allegato_checkup) {
		return allegato_checkup ? $scope.ajax(
			"api/base/save.php"
			,{
				beanName: "AllegatoCheckupBean"
				,model: allegato_checkup
			}
			,true
		).then(
			(response) => {
				$rootScope.push_allegato_checkup(allegato_checkup);
				$scope.toast("Checkup aggiunto");
				return Promise.resolve(allegato_checkup);
			}
			,(response) => {return Promise.reject(response)}
		) : Promise.reject(
			"allegato_checkup is "
			+ (allegato_checkup === undefined ? "undefined" : "")
			+ (allegato_checkup === null ? "null" : "")
			+ (allegato_checkup === false ? "false" : "")
			+ (allegato_checkup === 0 ? "0" : "")
		)
	}

	$rootScope.delete_allegato_checkup = function(allegato_checkup, fl_ask_confirm) {
		if (allegato_checkup) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler rimuovere il checkup?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_allegato_checkup(allegato_checkup, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/allegato_checkup/delete.php"
				,{allegato_checkup: allegato_checkup}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.allegati_checkups.righe, allegato_checkup);
					if ($rootScope.allegati_checkups.map[allegato_checkup.ac_idallegato]) {
						$rootScope.allegati_checkups.map[allegato_checkup.ac_idallegato][allegato_checkup.ac_idcheckup] = undefined;
					}
					$scope.toast("Checkup rimosso");
					return Promise.resolve(allegato_checkup);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"allegato_checkup is "
			+ (allegato_checkup === undefined ? "undefined" : "")
			+ (allegato_checkup === null ? "null" : "")
			+ (allegato_checkup === false ? "false" : "")
			+ (allegato_checkup === 0 ? "0" : "")
		)
	}
}]);