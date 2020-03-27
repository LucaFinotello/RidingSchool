app.controller("scadenziario", ["$rootScope", "$scope", function($rootScope, $scope) {
	$rootScope.scadenziario = $rootScope.scadenziario ? $rootScope.scadenziario : {
		page: "checkups"
	};

	$rootScope.init_scadenziario = function() {
		$rootScope.scadenziario.azienda = $rootScope.logged_user.azienda;
		$rootScope.scadenziario.dipendente = $rootScope.logged_user.dipendente;
		$rootScope.scadenziario.page = $rootScope.utente_is_dipendente($rootScope.logged_user) ? "dipendenti_formazioni" : "checkups";
	}
}]);