app.controller("gestione", ["$rootScope", function($rootScope) {
	$rootScope.gestione = $rootScope.gestione ? $rootScope.gestione : {
		moduli: moduli
	};

	$rootScope.gestione_insert_argomento = function(argomento) {
		return $rootScope.insert_argomento(argomento).then(
			(argomento) => {
				$rootScope.gestione.argomento = argomento;
				$rootScope.gestione_clear_adempimento();
				return Promise.resolve(argomento);
			}
			,(response) => {return Promise.reject(response)}
		);
	}
	$rootScope.gestione_insert_adempimento = function(adempimento, argomento) {
		return $rootScope.insert_adempimento(adempimento, argomento).then(
			(adempimento, argomento) => {
				$rootScope.gestione.adempimento = adempimento;
				return Promise.resolve(adempimento, argomento);
			}
			,(response) => {return Promise.reject(response)}
		);
	}
	$rootScope.gestione_insert_stato = function(stato, adempimento) {
		return $rootScope.insert_stato(stato, adempimento).then(
			(stato, adempimento) => {
				$rootScope.gestione.stato = stato;
				return Promise.resolve(stato, adempimento);
			}
			,(response) => {return Promise.reject(response)}
		);
	}
	$rootScope.gestione_insert_sanzione = function(sanzione, stato) {
		return $rootScope.insert_sanzione(sanzione, stato).then(
			(sanzione, stato) => {
				$rootScope.gestione.sanzione = sanzione;
				return Promise.resolve(sanzione, stato);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.gestione_clear_argomento = function() {
		$rootScope.gestione.argomento = undefined;
		$rootScope.gestione.search_argomento = undefined;
		$rootScope.gestione_clear_adempimento();
	};
	$rootScope.gestione_clear_adempimento = function() {
		$rootScope.gestione.adempimento = undefined;
		$rootScope.gestione.search_adempimento = undefined;
		$rootScope.gestione_clear_stato();
	};
	$rootScope.gestione_clear_stato = function() {
		$rootScope.gestione.stato = undefined;
		$rootScope.gestione.search_stato = undefined;
	};
}]);