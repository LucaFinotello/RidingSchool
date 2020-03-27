app.controller("report_scadenziario", ["$rootScope", function($rootScope) {
	$rootScope.report_scadenziario = $rootScope.report_scadenziario ? $rootScope.report_scadenziario : {
		righe: []
	};
}]);