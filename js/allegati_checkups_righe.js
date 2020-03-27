app.controller("allegati_checkups_righe", ["$rootScope", "$scope", function($rootScope, $scope) {
	$rootScope.allegati_checkups_righe = $rootScope.allegati_checkups_righe ? $rootScope.allegati_checkups_righe : {};

	$rootScope.select_allegati_checkups_righe = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "AllegatoCheckupRigaBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.allegati_checkups_righe.righe = [];
				$rootScope.allegati_checkups_righe.map = {};
				$rootScope.push_allegato_checkup_riga(response);
				return Promise.resolve($rootScope.allegati_checkups_righe.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.push_allegato_checkup_riga = function(allegato_checkup_riga) {
		if (allegato_checkup_riga) {
			if (Array.isArray(allegato_checkup_riga)) {
				for (let i = 0; i < allegato_checkup_riga.length; i++) {
					$rootScope.push_allegato_checkup_riga(allegato_checkup_riga[i]);
				}
			} else {
				$scope.push($rootScope.allegati_checkups_righe.righe, allegato_checkup_riga);
				$rootScope.allegati_checkups_righe.map[allegato_checkup_riga.acr_idallegato] = $rootScope.allegati_checkups_righe.map[allegato_checkup_riga.acr_idallegato] ? $rootScope.allegati_checkups_righe.map[allegato_checkup_riga.acr_idallegato] : {};
				$rootScope.allegati_checkups_righe.map[allegato_checkup_riga.acr_idallegato][allegato_checkup_riga.acr_idcheckup_riga] = allegato_checkup_riga;
			}
		}
	}

	$rootScope.insert_allegato_checkup_riga = function(allegato_checkup_riga) {
		return allegato_checkup_riga ? $scope.ajax(
			"api/base/save.php"
			,{
				beanName: "AllegatoCheckupRigaBean"
				,model: allegato_checkup_riga
			}
			,true
		).then(
			(response) => {
				$rootScope.push_allegato_checkup_riga(allegato_checkup_riga);
				$scope.toast("Riga checkup aggiunta");
				return Promise.resolve(allegato_checkup_riga);
			}
			,(response) => {return Promise.reject(response)}
		) : Promise.reject(
			"allegato_checkup_riga is "
			+ (allegato_checkup_riga === undefined ? "undefined" : "")
			+ (allegato_checkup_riga === null ? "null" : "")
			+ (allegato_checkup_riga === false ? "false" : "")
			+ (allegato_checkup_riga === 0 ? "0" : "")
		)
	}

	$rootScope.delete_allegato_checkup_riga = function(allegato_checkup_riga, fl_ask_confirm) {
		if (allegato_checkup_riga) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler rimuovere la riga checkup?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_allegato_checkup_riga(allegato_checkup_riga, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/allegato_checkup_riga/delete.php"
				,{allegato_checkup_riga: allegato_checkup_riga}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.allegati_checkups_righe.righe, allegato_checkup_riga);
					if ($rootScope.allegati_checkups_righe.map[allegato_checkup_riga.acr_idallegato]) {
						$rootScope.allegati_checkups_righe.map[allegato_checkup_riga.acr_idallegato][allegato_checkup_riga.acr_idcheckup_riga] = undefined;
					}
					$scope.toast("Riga checkup rimossa");
					return Promise.resolve(allegato_checkup_riga);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"allegato_checkup_riga is "
			+ (allegato_checkup_riga === undefined ? "undefined" : "")
			+ (allegato_checkup_riga === null ? "null" : "")
			+ (allegato_checkup_riga === false ? "false" : "")
			+ (allegato_checkup_riga === 0 ? "0" : "")
		)
	}
}]);