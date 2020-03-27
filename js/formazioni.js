app.controller("formazioni", ["$rootScope", "$scope", "$localStorage", "$filter", function($rootScope, $scope, $localStorage, $filter) {
	$rootScope.formazioni = $rootScope.formazioni ? $rootScope.formazioni : {
		filtri_key: "filtri_formazioni"
		,fn_filtri_set_default_filtri_app: function() {
			if ($rootScope.formazioni && $rootScope.formazioni.filtri) {
				$rootScope.formazioni.filtri.sorting				= [{
					property: "fo_descr"
					,reverse: false
				}];
				$rootScope.formazioni.filtri.show						= $rootScope.formazioni.filtri.show ? $rootScope.formazioni.filtri.show : {};
				$rootScope.formazioni.filtri.show.fo_id					= true;
				$rootScope.formazioni.filtri.show.fo_descr				= true;
				$rootScope.formazioni.filtri.show.fo_note				= true;
				$rootScope.formazioni.filtri.show.fo_ggvalidita			= true;
			}
		}
		,fn_filtri_set_custom_filtri_app: function() {
			if ($rootScope.formazioni && $rootScope.formazioni.filtri) {
				let filtri_app = $localStorage[$rootScope.formazioni.filtri_key];

				if (filtri_app) {
					$rootScope.formazioni.filtri.sorting				= filtri_app.sorting					? filtri_app.sorting					: $rootScope.formazioni.filtri.sorting;
					$rootScope.formazioni.filtri.show					= $rootScope.formazioni.filtri.show		? $rootScope.formazioni.filtri.show		: {};
					filtri_app.show										= filtri_app.show						? filtri_app.show						: {};
					$rootScope.formazioni.filtri.show.fo_id				= !!filtri_app.show.fo_id;
					$rootScope.formazioni.filtri.show.fo_descr			= !!filtri_app.show.fo_descr;
					$rootScope.formazioni.filtri.show.fo_note			= !!filtri_app.show.fo_note;
					$rootScope.formazioni.filtri.show.fo_ggvalidita		= !!filtri_app.show.fo_ggvalidita;
				}
			}
		}
		,fn_filtri_filter: function(items, filtri, limit) {
			let filtered = [];

			for (let i = 0; items && i < items.length && (!limit || (limit && limit > filtered.length)); i++) {
				let item = items[i];

				if (filtri && filtri.search && !$filter("filter")([item], filtri.search).length) continue;

				filtered.push(item);
			}

			return filtered;
		}
		,toggle_rubrica: function(rubrica) {
			if (this.rubrica_filtri_formazioni	&& this.rubrica_filtri_formazioni != rubrica)		this.rubrica_filtri_formazioni.fl_open = false;
			if (rubrica) rubrica.fl_open = !rubrica.fl_open;
		}
		,rubrica_filtri_formazioni: {
			template: "tmpl/rubrica_filtri_formazioni.tmpl.html"
			,model: undefined
			,fl_open: false
		}
	};
	$rootScope.formazioni.rubrica_filtri_formazioni.model = $rootScope.formazioni;

	$rootScope.select_formazioni = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "FormazioneBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.formazioni.righe = response;
				$rootScope.formazioni.map = {};
				for (let fo = 0; fo < $rootScope.formazioni.righe.length; fo++) {
					let formazione = $rootScope.formazioni.righe[fo];
					$rootScope.formazioni.map[formazione.fo_id] = formazione;
				}
				if ($rootScope.formazioni.filtri_app_scope) {
					$rootScope.formazioni.filtri_app_scope.fn_filtri_onchange_force();
				}
				return Promise.resolve($rootScope.formazioni.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.insert_formazione = function(formazione) {
		if (formazione) {
			return $scope.ajax(
				"api/base/save.php"
				,{
					beanName: "FormazioneBean"
					,model: formazione
				}
				,true
			).then(
				(response) => {
					formazione.fo_id = response[0].fo_id;
					$scope.push($rootScope.formazioni.righe, formazione);
					$rootScope.formazioni.map[formazione.fo_id] = formazione;
					$scope.toast("Evento salvato");
					return Promise.resolve(formazione);
				}
				,(response) => {return Promise.reject(response)}
			);
		} else {
			let dialog = {};
			dialog.clickOutsideToClose = true;
			dialog.title = "Aggiungi Evento";
			dialog.class = "";
			dialog.content_tmpl = "tmpl/anagrafica_formazione.tmpl.html";
			dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
			dialog.disabledform = false;
			dialog.editableform = true;

			dialog.formazione = formazione ? formazione : {};

			return $scope.alert(dialog).then(
				(answer) => {return $rootScope.insert_formazione(answer.formazione)}
				,(answer) => {return Promise.reject(answer)}
			);
		}
	}

	$rootScope.delete_formazione = function(formazione, fl_ask_confirm) {
		if (formazione) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler eliminare la formazione?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_formazione(formazione, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/formazione/delete.php"
				,{formazione: formazione}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.formazioni.righe, formazione);
					$rootScope.formazioni.map[formazione.fo_id] = undefined;
					$scope.toast("Evento eliminato");
					return Promise.resolve(formazione);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"formazione is "
			+ (formazione === undefined ? "undefined" : "")
			+ (formazione === null ? "null" : "")
			+ (formazione === false ? "false" : "")
			+ (formazione === 0 ? "0" : "")
		);
	}

	$rootScope.anagrafica_formazione = function(formazione) {
		if (formazione) {
			let dialog = {};
			dialog.clickOutsideToClose = true;
			dialog.title = "Anagrafica Evento";
			dialog.class = "";
			dialog.content_tmpl = "tmpl/anagrafica_formazione.tmpl.html";
			dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
			dialog.disabledform = false;
			dialog.editableform = true;

			dialog.formazione = formazione ? formazione : {};
			dialog.formazione.fo_ggvalidita = dialog.formazione.fo_ggvalidita ? parseInt(dialog.formazione.fo_ggvalidita) : undefined;

			dialog.deleteFn = dialog.formazione.fo_id ? function(answer, cancelFn) {
				return $rootScope.delete_formazione(answer.formazione, true).then(
					(formazione) => {
						if (cancelFn) {
							cancelFn();
						}
						return Promise.resolve(formazione);
					}
					,(response) => {return Promise.reject(response)}
				);
			} : undefined;

			return $scope.alert(dialog).then(
				(answer) => {return $rootScope.insert_formazione(answer.formazione)}
				,(answer) => {return Promise.reject(answer)}
			);
		}
		return Promise.reject(
			"formazione is "
			+ (formazione === undefined ? "undefined" : "")
			+ (formazione === null ? "null" : "")
			+ (formazione === false ? "false" : "")
			+ (formazione === 0 ? "0" : "")
		);
	}
}]);