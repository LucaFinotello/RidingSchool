app.controller("aziende_argomenti", ["$rootScope", "$scope", function($rootScope, $scope) {
	$rootScope.aziende_argomenti = $rootScope.aziende_argomenti ? $rootScope.aziende_argomenti : {};

	$rootScope.select_aziende_argomenti = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "AziendaArgomentoBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.aziende_argomenti.righe = response;
				$rootScope.aziende_argomenti.map = {};
				for (let aa = 0; aa < $rootScope.aziende_argomenti.righe.length; aa++) {
					let azienda_argomento = $rootScope.aziende_argomenti.righe[aa];
					$rootScope.aziende_argomenti.map[azienda_argomento.aa_idargomento] = $rootScope.aziende_argomenti.map[azienda_argomento.aa_idargomento] ? $rootScope.aziende_argomenti.map[azienda_argomento.aa_idargomento] : {};
					$rootScope.aziende_argomenti.map[azienda_argomento.aa_idargomento][azienda_argomento.aa_idazienda] = azienda_argomento;
				}
				return Promise.resolve($rootScope.aziende_argomenti.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.insert_azienda_argomento = function(azienda_argomento) {
		if (azienda_argomento) {
			return $scope.ajax(
				"api/base/save.php"
				,{
					beanName: "AziendaArgomentoBean"
					,model: azienda_argomento
				}
				,true
			).then(
				(response) => {
					$scope.push($rootScope.aziende_argomenti.righe, azienda_argomento);
					$rootScope.aziende_argomenti.map[azienda_argomento.aa_idargomento] = $rootScope.aziende_argomenti.map[azienda_argomento.aa_idargomento] ? $rootScope.aziende_argomenti.map[azienda_argomento.aa_idargomento] : {};
					$rootScope.aziende_argomenti.map[azienda_argomento.aa_idargomento][azienda_argomento.aa_idazienda] = azienda_argomento;
					$scope.toast("Argomento assegnato all'azienda");
					return Promise.resolve(azienda_argomento);
				}
				,(response) => {return Promise.reject(response)}
			)
		}
		return Promise.reject(
			"azienda_argomento is "
			+ (azienda_argomento === undefined ? "undefined" : "")
			+ (azienda_argomento === null ? "null" : "")
			+ (azienda_argomento === false ? "false" : "")
			+ (azienda_argomento === 0 ? "0" : "")
		)
	}

	$rootScope.delete_azienda_argomento = function(azienda_argomento, fl_ask_confirm) {
		if (azienda_argomento) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler rimuovere l'argomento da questa azienda?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_azienda_argomento(azienda_argomento, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/azienda_argomento/delete.php"
				,{azienda_argomento: azienda_argomento}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.aziende_argomenti.righe, azienda_argomento);
					$rootScope.aziende_argomenti.map[azienda_argomento.aa_idargomento] = $rootScope.aziende_argomenti.map[azienda_argomento.aa_idargomento] ? $rootScope.aziende_argomenti.map[azienda_argomento.aa_idargomento] : {};
					$rootScope.aziende_argomenti.map[azienda_argomento.aa_idargomento][azienda_argomento.aa_idazienda] = undefined;
					$scope.toast("Argomento rimosso dall'azienda");
					return Promise.resolve(azienda_argomento);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"azienda_argomento is "
			+ (azienda_argomento === undefined ? "undefined" : "")
			+ (azienda_argomento === null ? "null" : "")
			+ (azienda_argomento === false ? "false" : "")
			+ (azienda_argomento === 0 ? "0" : "")
		)
	}

	$rootScope.argomento_in_azienda = function(azienda, argomento) {
		return azienda && argomento && $rootScope.aziende_argomenti.map && $rootScope.aziende_argomenti.map[argomento.ar_id] && $rootScope.aziende_argomenti.map[argomento.ar_id][azienda.az_id]
	}
}]);