app.controller("allegati_utenti", ["$rootScope", "$scope", function($rootScope, $scope) {
	$rootScope.allegati_utenti = $rootScope.allegati_utenti ? $rootScope.allegati_utenti : {};

	$rootScope.select_allegati_utenti = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "AllegatoUtenteBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.allegati_utenti.righe = [];
				$rootScope.allegati_utenti.map = {};
				$rootScope.push_allegato_utente(response);
				return Promise.resolve($rootScope.allegati_utenti.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.push_allegato_utente = function(allegato_utente) {
		if (allegato_utente) {
			if (Array.isArray(allegato_utente)) {
				for (let i = 0; i < allegato_utente.length; i++) {
					$rootScope.push_allegato_utente(allegato_utente[i]);
				}
			} else {
				$scope.push($rootScope.allegati_utenti.righe, allegato_utente);
				$rootScope.allegati_utenti.map[allegato_utente.au_idallegato] = $rootScope.allegati_utenti.map[allegato_utente.au_idallegato] ? $rootScope.allegati_utenti.map[allegato_utente.au_idallegato] : {};
				$rootScope.allegati_utenti.map[allegato_utente.au_idallegato][allegato_utente.au_idutente] = allegato_utente;
			}
		}
	}

	$rootScope.insert_allegato_utente = function(allegato_utente) {
		return allegato_utente ? $scope.ajax(
			"api/base/save.php"
			,{
				beanName: "AllegatoUtenteBean"
				,model: allegato_utente
			}
			,true
		).then(
			(response) => {
				$rootScope.push_allegato_utente(allegato_utente);
				$scope.toast("Utente aggiunto");
				return Promise.resolve(allegato_utente);
			}
			,(response) => {return Promise.reject(response)}
		) : Promise.reject(
			"allegato_utente is "
			+ (allegato_utente === undefined ? "undefined" : "")
			+ (allegato_utente === null ? "null" : "")
			+ (allegato_utente === false ? "false" : "")
			+ (allegato_utente === 0 ? "0" : "")
		)
	}

	$rootScope.delete_allegato_utente = function(allegato_utente, fl_ask_confirm) {
		if (allegato_utente) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler rimuovere l'utente?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_allegato_utente(allegato_utente, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/allegato_utente/delete.php"
				,{allegato_utente: allegato_utente}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.allegati_utenti.righe, allegato_utente);
					if ($rootScope.allegati_utenti.map[allegato_utente.au_idallegato]) {
						$rootScope.allegati_utenti.map[allegato_utente.au_idallegato][allegato_utente.au_idutente] = undefined;
					}
					$scope.toast("Utente rimosso");
					return Promise.resolve(allegato_utente);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"allegato_utente is "
			+ (allegato_utente === undefined ? "undefined" : "")
			+ (allegato_utente === null ? "null" : "")
			+ (allegato_utente === false ? "false" : "")
			+ (allegato_utente === 0 ? "0" : "")
		)
	}
}]);