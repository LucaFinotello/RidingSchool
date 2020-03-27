app.controller("aziende_tipi", ["$rootScope", function($rootScope) {
	$rootScope.aziende_tipi = $rootScope.aziende_tipi ? $rootScope.aziende_tipi : {};

	$rootScope.select_aziende_tipi = function() {
		$rootScope.aziende_tipi.righe = [{
			at_property: "az_flsocio"
			,at_value: "0"
			,at_descr: "Non socio"
		},{
			at_property: "az_flsocio"
			,at_value: "1"
			,at_descr: "Socio"
		},{
			at_property: "az_flcontratto"
			,at_value: "0"
			,at_descr: "Senza contratto"
		},{
			at_property: "az_flcontratto"
			,at_value: "1"
			,at_descr: "Con contratto"
		}];
		$rootScope.aziende_tipi.map = {};
		for (let at = 0; at < $rootScope.aziende_tipi.righe.length; at++) {
			let azienda_tipo = $rootScope.aziende_tipi.righe[at];
			$rootScope.aziende_tipi.map[azienda_tipo.at_property] = $rootScope.aziende_tipi.map[azienda_tipo.at_property] ? $rootScope.aziende_tipi.map[azienda_tipo.at_property] : {};
			$rootScope.aziende_tipi.map[azienda_tipo.at_property][azienda_tipo.at_value] = azienda_tipo;
		}
		return Promise.resolve($rootScope.aziende_tipi.righe);
	}

	$rootScope.azienda_is_socio = function(azienda) {
		return azienda && azienda.az_flsocio == "1";
	}
	$rootScope.azienda_is_contratto = function(azienda) {
		return azienda && azienda.az_flcontratto == "1";
	}
}]);

app.filter("azienda_is_socio", ["$rootScope", function() {
	return $rootScope.azienda_is_socio;
}]);
app.filter("azienda_is_contratto", ["$rootScope", function() {
	return $rootScope.azienda_is_contratto;
}]);