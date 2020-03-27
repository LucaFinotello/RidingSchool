app.controller("rubrica", ["$rootScope", "$scope", function($rootScope, $scope) {

	/**
	 * rubrica_default.tmpl.html si aspetta un oggetto così composto: {
	 *	template
	 *	,model
	 *	,fl_open
	 *	,deselect
	 *	,search
	 *	,checked
	 *	,click
	 *	,subhead
	 *	,body
	 *	,caption
	 *	,lines
	 *	,custom_filter
	 *}
	 */
	$scope.rubrica = undefined;

	$scope.init_rubrica = function(rubrica) {
		$scope.rubrica = rubrica;
		if (!$scope.rubrica) console.error(
			"rubrica is "
			+ (rubrica === undefined ? "undefined" : "")
			+ (rubrica === null ? "null" : "")
			+ (rubrica === false ? "false" : "")
			+ (rubrica === 0 ? "0" : "")
		);
		return $scope.rubrica;
	}
}]);