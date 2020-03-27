app.controller("allegati_aziende", ["$rootScope", "$scope", function($rootScope, $scope) {
	$rootScope.allegati_aziende = $rootScope.allegati_aziende ? $rootScope.allegati_aziende : {};

	$rootScope.select_allegati_aziende = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "AllegatoAziendaBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.allegati_aziende.righe = [];
				$rootScope.allegati_aziende.map = {};
				$rootScope.push_allegato_azienda(response);
				return Promise.resolve($rootScope.allegati_aziende.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.push_allegato_azienda = function(allegato_azienda) {
		if (allegato_azienda) {
			if (Array.isArray(allegato_azienda)) {
				for (let i = 0; i < allegato_azienda.length; i++) {
					$rootScope.push_allegato_azienda(allegato_azienda[i]);
				}
			} else {
				$scope.push($rootScope.allegati_aziende.righe, allegato_azienda);
				$rootScope.allegati_aziende.map[allegato_azienda.aa_idallegato] = $rootScope.allegati_aziende.map[allegato_azienda.aa_idallegato] ? $rootScope.allegati_aziende.map[allegato_azienda.aa_idallegato] : {};
				$rootScope.allegati_aziende.map[allegato_azienda.aa_idallegato][allegato_azienda.aa_idazienda] = allegato_azienda;
			}
		}
	}

	$rootScope.insert_allegato_azienda = function(allegato_azienda) {
		return allegato_azienda ? $scope.ajax(
			"api/base/save.php"
			,{
				beanName: "AllegatoAziendaBean"
				,model: allegato_azienda
			}
			,true
		).then(
			(response) => {
				$rootScope.push_allegato_azienda(allegato_azienda);
				$scope.toast("Azienda aggiunta");
				return Promise.resolve(allegato_azienda);
			}
			,(response) => {return Promise.reject(response)}
		) : Promise.reject(
			"allegato_azienda is "
			+ (allegato_azienda === undefined ? "undefined" : "")
			+ (allegato_azienda === null ? "null" : "")
			+ (allegato_azienda === false ? "false" : "")
			+ (allegato_azienda === 0 ? "0" : "")
		)
	}

	$rootScope.delete_allegato_azienda = function(allegato_azienda, fl_ask_confirm) {
		if (allegato_azienda) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler rimuovere l'azienda?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_allegato_azienda(allegato_azienda, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/allegato_azienda/delete.php"
				,{allegato_azienda: allegato_azienda}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.allegati_aziende.righe, allegato_azienda);
					if ($rootScope.allegati_aziende.map[allegato_azienda.aa_idallegato]) {
						$rootScope.allegati_aziende.map[allegato_azienda.aa_idallegato][allegato_azienda.aa_idazienda] = undefined;
					}
					$scope.toast("Azienda rimossa");
					return Promise.resolve(allegato_azienda);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"allegato_azienda is "
			+ (allegato_azienda === undefined ? "undefined" : "")
			+ (allegato_azienda === null ? "null" : "")
			+ (allegato_azienda === false ? "false" : "")
			+ (allegato_azienda === 0 ? "0" : "")
		)
	}
}]);