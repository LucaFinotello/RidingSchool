app.controller("report_aziende", ["$rootScope", function($rootScope) {
	$rootScope.report_aziende = $rootScope.report_aziende ? $rootScope.report_aziende : {
		righe: []
	};
}]);