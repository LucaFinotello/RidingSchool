app.controller("stati", ["$rootScope", "$scope", "$filter", function($rootScope, $scope, $filter) {
	$rootScope.stati = $rootScope.stati ? $rootScope.stati : {};

	$rootScope.insert_stato = function(stato, adempimento) {
		if (stato && adempimento) {
			stato.st_idadempimento = adempimento.ad_id;
		}

		return stato ? $scope.ajax(
			"api/base/save.php"
			,{
				beanName: "StatoBean"
				,model: stato
			}
			,true
		).then(
			(response) => {
				stato.st_id = response[0].st_id;
				$scope.push(adempimento ? adempimento.stati : undefined, stato);
				$scope.toast("Stato salvato");
				return Promise.resolve(stato, adempimento);
			}
			,(response) => {return Promise.reject(response)}
		) : $rootScope.anagrafica_stato(undefined, adempimento);
	}

	$rootScope.delete_stato = function(stato, fl_ask_confirm, adempimento) {
		if (stato) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler eliminare lo stato?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_stato(stato, false, adempimento)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/stato/delete.php"
				,{stato: stato}
				,true
			).then(
				(response) => {
					$scope.splice(adempimento ? adempimento.stati : undefined, stato);
					if ($rootScope.gestione && $rootScope.gestione.stato == stato) {
						$rootScope.gestione_clear_stato();
					}
					$scope.toast("Stato eliminato");
					return Promise.resolve(stato, adempimento);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"stato is "
			+ (stato === undefined ? "undefined" : "")
			+ (stato === null ? "null" : "")
			+ (stato === false ? "false" : "")
			+ (stato === 0 ? "0" : "")
		)
	}

	$rootScope.anagrafica_stato = function(stato, adempimento) {
		let dialog = {};
		dialog.clickOutsideToClose = true;
		dialog.title = "Anagrafica stato";
		dialog.class = "";
		dialog.content_tmpl = "tmpl/anagrafica_stato.tmpl.html";
		dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
		dialog.disabledform = false;
		dialog.editableform = true;

		dialog.stato = stato ? stato : {};
		dialog.stato.sanzioni = dialog.stato.sanzioni ? dialog.stato.sanzioni : [];
		dialog.adempimento = adempimento;

		dialog.deleteFn = dialog.stato.st_id ? function(answer, cancelFn) {
			return $rootScope.delete_stato(answer.stato, true, answer.adempimento).then(
				(stato, adempimento) => {
					if (cancelFn) {
						cancelFn();
					}
					return Promise.resolve(stato, adempimento);
				}
				,(response) => {return Promise.reject(response)}
			);
		} : undefined;

		return $scope.alert(dialog).then(
			(answer) => {return $rootScope.insert_stato(answer.stato, answer.adempimento)}
			,(answer) => {return Promise.reject(answer)}
		);
	}

	$rootScope.adempimenti_to_stati = function(adempimenti, filtri) {
		let stati = [];
		let ad_ids = filtri && filtri.adempimenti ? $scope.get_valid_keys(filtri.adempimenti) : [];
		if (ad_ids.length > 0) {
			stati = [];
			for (let ad = 0; ad < ad_ids.length; ad++) {
				let adempimento = $filter("get_adempimento")(ad_ids[ad]);
				stati = stati.concat(adempimento.stati);
			}
			let st_ids = filtri && filtri.stati ? $scope.get_valid_keys(filtri.stati) : [];
			for (let st = 0; st < ad_ids.length; st++) {
				let stato = $filter("get_stato")(st_ids[st]);
				$scope.push(stati, stato);
			}
		} else {
			for (let ad = 0; adempimenti && ad < adempimenti.length; ad++) {
				let adempimento = adempimenti[ad];
				stati = stati.concat(adempimento.stati);
			}
		}
		return stati;
	}
}]);

app.filter("get_stato", ["$rootScope", function($rootScope) {
	return function(st_id, ar_id, ad_id) {
		if (st_id) {
			let argomenti = ar_id ? [$rootScope.argomenti.map[ar_id]] : $rootScope.argomenti.righe;
			for (let ar = 0; argomenti && ar < argomenti.length; ar++) {
				let argomento = argomenti[ar];
				for (let ad = 0; argomento.adempimenti && ad < argomento.adempimenti.length; ad++) {
					let adempimento = argomento.adempimenti[ad];
					if (adempimento && (!ad_id || adempimento.ad_id == ad_id)) {
						for (let st = 0; adempimento.stati && st < adempimento.stati.length; st++) {
							let stato = adempimento.stati[st];
							if (stato && stato.st_id == st_id) {
								return stato;
							}
						}
					}
				}
			}
		}
		return undefined;
	}
}]);

app.filter("adempimenti_to_stati", ["$rootScope", function($rootScope) {return $rootScope.adempimenti_to_stati}]);