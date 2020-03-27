app.controller("argomenti", ["$rootScope", "$scope", function($rootScope, $scope) {
	$rootScope.argomenti = $rootScope.argomenti ? $rootScope.argomenti : {};

	$rootScope.select_argomenti = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "ArgomentoBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.argomenti.righe = response;
				$rootScope.argomenti.map = {};
				for (let ar = 0; ar < $rootScope.argomenti.righe.length; ar++) {
					let argomento = $rootScope.argomenti.righe[ar];
					$rootScope.argomenti.map[argomento.ar_id] = argomento;
				}
				return Promise.resolve($rootScope.argomenti.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.insert_argomento = function(argomento) {
		return argomento ? $scope.ajax(
			"api/base/save.php"
			,{
				beanName: "ArgomentoBean"
				,model: argomento
			}
			,true
		).then(
			(response) => {
				argomento.ar_id = response[0].ar_id;
				$scope.push($rootScope.argomenti.righe, argomento);
				$rootScope.argomenti.map[argomento.ar_id] = argomento;
				$scope.toast("Argomento salvato");
				return Promise.resolve(argomento);
			}
			,(response) => {return Promise.reject(response)}
		) : $rootScope.anagrafica_argomento();
	}

	$rootScope.delete_argomento = function(argomento, fl_ask_confirm) {
		if (argomento) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler eliminare l'argomento?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_argomento(argomento, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/argomento/delete.php"
				,{argomento: argomento}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.argomenti.righe, argomento);
					$rootScope.argomenti.map[argomento.ar_id] = undefined;
					if ($rootScope.gestione && $rootScope.gestione.argomento == argomento) {
						$rootScope.gestione_clear_argomento();
					}
					$scope.toast("Argomento eliminato");
					return Promise.resolve(argomento);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"argomento is "
			+ (argomento === undefined ? "undefined" : "")
			+ (argomento === null ? "null" : "")
			+ (argomento === false ? "false" : "")
			+ (argomento === 0 ? "0" : "")
		)
	}

	$rootScope.anagrafica_argomento = function(argomento) {
		let dialog = {};
		dialog.clickOutsideToClose = true;
		dialog.title = "Anagrafica argomento";
		dialog.class = "";
		dialog.content_tmpl = "tmpl/anagrafica_argomento.tmpl.html";
		dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
		dialog.disabledform = false;
		dialog.editableform = true;

		dialog.argomento = argomento ? argomento : {};
		dialog.argomento.adempimenti = dialog.argomento.adempimenti ? dialog.argomento.adempimenti : [];

		dialog.deleteFn = dialog.argomento.ar_id ? function(answer, cancelFn) {
			return $rootScope.delete_argomento(answer.argomento, true).then(
				(argomento) => {
					if (cancelFn) {
						cancelFn();
					}
					return Promise.resolve(argomento);
				}
				,(response) => {return Promise.reject(response)}
			);
		} : undefined;

		return $scope.alert(dialog).then(
			(answer) => {return $rootScope.insert_argomento(answer.argomento)}
			,(answer) => {return Promise.reject(answer)}
		);
	}
}]);