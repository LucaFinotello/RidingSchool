app.controller("report_dipendenti", ["$rootScope", function($rootScope) {
	$rootScope.report_dipendenti = $rootScope.report_dipendenti ? $rootScope.report_dipendenti : {
		righe: []
	};
}]);