app.controller("sanzioni", ["$rootScope", "$scope", function($rootScope, $scope) {
	$rootScope.sanzioni = $rootScope.sanzioni ? $rootScope.sanzioni : {};

	$rootScope.insert_sanzione = function(sanzione, stato) {
		if (sanzione && stato) {
			sanzione.sa_idstato = stato.st_id;
		}

		return sanzione ? $scope.ajax(
			"api/base/save.php"
			,{
				beanName: "SanzioneBean"
				,model: sanzione
			}
			,true
		).then(
			(response) => {
				sanzione.sa_id = response[0].sa_id;
				$scope.push(stato ? stato.sanzioni : undefined, sanzione);
				$scope.toast("Sanzione salvata");
				return Promise.resolve(sanzione, stato);
			}
			,(response) => {return Promise.reject(response)}
		) : $rootScope.anagrafica_sanzione(undefined, stato);
	}

	$rootScope.delete_sanzione = function(sanzione, fl_ask_confirm, stato) {
		if (sanzione) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler eliminare la sanzione?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_sanzione(sanzione, false, stato)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/sanzione/delete.php"
				,{sanzione: sanzione}
				,true
			).then(
				(response) => {
					$scope.splice(stato ? stato.sanzioni : undefined, sanzione);
					if ($rootScope.gestione && $rootScope.gestione.sanzione == sanzione) {
						$rootScope.gestione_clear_sanzione();
					}
					$scope.toast("Sanzione eliminata");
					return Promise.resolve(sanzione, stato);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"sanzione is "
			+ (sanzione === undefined ? "undefined" : "")
			+ (sanzione === null ? "null" : "")
			+ (sanzione === false ? "false" : "")
			+ (sanzione === 0 ? "0" : "")
		)
	}

	$rootScope.anagrafica_sanzione = function(sanzione, stato) {
		let dialog = {};
		dialog.clickOutsideToClose = true;
		dialog.title = "Anagrafica sanzione";
		dialog.class = "";
		dialog.content_tmpl = "tmpl/anagrafica_sanzione.tmpl.html";
		dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
		dialog.disabledform = false;
		dialog.editableform = true;

		dialog.sanzione = sanzione ? sanzione : {};
		dialog.stato = stato;

		dialog.deleteFn = dialog.sanzione.sa_id ? function(answer, cancelFn) {
			return $rootScope.delete_sanzione(answer.sanzione, true, answer.stato).then(
				(sanzione, stato) => {
					if (cancelFn) {
						cancelFn();
					}
					return Promise.resolve(sanzione, stato);
				}
				,(response) => {return Promise.reject(response)}
			);
		} : undefined;

		return $scope.alert(dialog).then(
			(answer) => {return $rootScope.insert_sanzione(answer.sanzione, answer.stato)}
			,(answer) => {return Promise.reject(answer)}
		);
	}
}]);

app.filter("get_sanzione", ["$rootScope", function($rootScope) {
	return function(sa_id, ar_id, ad_id, st_id) {
		if (st_id) {
			let argomenti = [];
			if (ar_id) {
				argomenti = [$rootScope.argomenti.map[ar_id]];
			} else {
				argomenti = $rootScope.argomenti.righe;
			}
			for (let ar = 0; argomenti && ar < argomenti.length; ar++) {
				let argomento = argomenti[ar];
				for (let ad = 0; argomento.adempimenti && ad < argomento.adempimenti.length; ad++) {
					let adempimento = argomento.adempimenti[ad];
					if (adempimento && adempimento.ad_id == ad_id) {
						for (let st = 0; adempimento.stati && st < adempimento.stati.length; st++) {
							let stato = adempimento.stati[st];
							if (stato && stato.st_id == st_id) {
								for (let sa = 0; stato.sanzioni && sa < stato.sanzioni.length; sa++) {
									let sanzione = stato.sanzioni[sa];
									if (sanzione && sanzione.sa_id == sa_id) {
										return sanzione;
									}
								}
							}
						}
					}
				}
			}
		}
		return undefined;
	}
}]);