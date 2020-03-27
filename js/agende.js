app.controller("agende", ["$rootScope", "$scope", function($rootScope, $scope) {
	$rootScope.agende = $rootScope.agende ? $rootScope.agende : {};

	$rootScope.select_agende = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "AgendaBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.agende.righe = response;
				$rootScope.agende.map = {};
				for (let ag = 0; ag < $rootScope.agende.righe.length; ag++) {
					let agenda = $rootScope.agende.righe[ag];
					$rootScope.agende.map[agenda.ag_id] = agenda;
				}
				return Promise.resolve($rootScope.agende.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.insert_agenda = function(agenda) {
		return agenda ? $scope.ajax(
			"api/base/save.php"
			,{
				beanName: "AgendaBean"
				,model: agenda
			}
			,true
		).then(
			(response) => {
				agenda.ag_id = response[0].ag_id;
				$scope.push($rootScope.agende.righe, agenda);
				$rootScope.agende.map[agenda.ag_id] = agenda;
				$scope.toast("Nota salvata");
				return Promise.resolve(agenda);
			}
			,(response) => {return Promise.reject(response)}
		) : $rootScope.anagrafica_agenda();
	}

	$rootScope.delete_agenda = function(agenda, fl_ask_confirm) {
		if (agenda) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler eliminare la nota?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_agenda(agenda, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/agenda/delete.php"
				,{agenda: agenda}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.agende.righe, agenda);
					$rootScope.agende.map[agenda.ag_id] = undefined;
					if ($rootScope.commesse && $rootScope.commesse.agenda == agenda) {
						$rootScope.commesse_clear_agenda();
					}
					$scope.toast("Nota eliminata");
					return Promise.resolve(agenda);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"agenda is "
			+ (agenda === undefined ? "undefined" : "")
			+ (agenda === null ? "null" : "")
			+ (agenda === false ? "false" : "")
			+ (agenda === 0 ? "0" : "")
		)
	}

	$rootScope.anagrafica_agenda = function(agenda) {
		let dialog = {};
		dialog.clickOutsideToClose = true;
		dialog.title = "Anagrafica agenda";
		dialog.title = "Anagrafica agenda";
		dialog.class = "dialog-xxl";
		dialog.content_tmpl = "tmpl/anagrafica_agenda.tmpl.html";
		dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
		dialog.disabledform = false;
		dialog.editableform = true;

		dialog.agenda = agenda ? agenda : {};

		dialog.deleteFn = dialog.agenda.ag_id ? function(answer, cancelFn) {
			return $rootScope.delete_agenda(answer.agenda, true).then(
				(agenda) => {
					if (cancelFn) {
						cancelFn();
					}
					return Promise.resolve(agenda);
				}
				,(response) => {return Promise.reject(response)}
			);
		} : undefined;

		return $scope.alert(dialog).then(
			(answer) => {return $rootScope.insert_agenda(answer.agenda)}
			,(answer) => {return Promise.reject(answer)}
		);
	}
}]);