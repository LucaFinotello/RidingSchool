app.controller("allegati_dipendenti", ["$rootScope", "$scope", function($rootScope, $scope) {
	$rootScope.allegati_dipendenti = $rootScope.allegati_dipendenti ? $rootScope.allegati_dipendenti : {};

	$rootScope.select_allegati_dipendenti = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "AllegatoDipendenteBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.allegati_dipendenti.righe = [];
				$rootScope.allegati_dipendenti.map = {};
				$rootScope.push_allegato_dipendente(response);
				return Promise.resolve($rootScope.allegati_dipendenti.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.push_allegato_dipendente = function(allegato_dipendente) {
		if (allegato_dipendente) {
			if (Array.isArray(allegato_dipendente)) {
				for (let i = 0; i < allegato_dipendente.length; i++) {
					$rootScope.push_allegato_dipendente(allegato_dipendente[i]);
				}
			} else {
				$scope.push($rootScope.allegati_dipendenti.righe, allegato_dipendente);
				$rootScope.allegati_dipendenti.map[allegato_dipendente.ad_idallegato] = $rootScope.allegati_dipendenti.map[allegato_dipendente.ad_idallegato] ? $rootScope.allegati_dipendenti.map[allegato_dipendente.ad_idallegato] : {};
				$rootScope.allegati_dipendenti.map[allegato_dipendente.ad_idallegato][allegato_dipendente.ad_iddipendente] = allegato_dipendente;
			}
		}
	}

	$rootScope.insert_allegato_dipendente = function(allegato_dipendente) {
		return allegato_dipendente ? $scope.ajax(
			"api/base/save.php"
			,{
				beanName: "AllegatoDipendenteBean"
				,model: allegato_dipendente
			}
			,true
		).then(
			(response) => {
				$rootScope.push_allegato_dipendente(allegato_dipendente);
				$scope.toast("Dipendente aggiunto");
				return Promise.resolve(allegato_dipendente);
			}
			,(response) => {return Promise.reject(response)}
		) : Promise.reject(
			"allegato_dipendente is "
			+ (allegato_dipendente === undefined ? "undefined" : "")
			+ (allegato_dipendente === null ? "null" : "")
			+ (allegato_dipendente === false ? "false" : "")
			+ (allegato_dipendente === 0 ? "0" : "")
		)
	}

	$rootScope.delete_allegato_dipendente = function(allegato_dipendente, fl_ask_confirm) {
		if (allegato_dipendente) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler rimuovere il dipendente?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_allegato_dipendente(allegato_dipendente, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/allegato_dipendente/delete.php"
				,{allegato_dipendente: allegato_dipendente}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.allegati_dipendenti.righe, allegato_dipendente);
					if ($rootScope.allegati_dipendenti.map[allegato_dipendente.ad_idallegato]) {
						$rootScope.allegati_dipendenti.map[allegato_dipendente.ad_idallegato][allegato_dipendente.ad_iddipendente] = undefined;
					}
					$scope.toast("Dipendente rimosso");
					return Promise.resolve(allegato_dipendente);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"allegato_dipendente is "
			+ (allegato_dipendente === undefined ? "undefined" : "")
			+ (allegato_dipendente === null ? "null" : "")
			+ (allegato_dipendente === false ? "false" : "")
			+ (allegato_dipendente === 0 ? "0" : "")
		)
	}
}]);