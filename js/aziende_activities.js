app.controller("aziende_activities", ["$rootScope", "$scope", "$localStorage", "$filter", function($rootScope, $scope, $localStorage, $filter) {
	$rootScope.aziende_activities = $rootScope.aziende_activities ? $rootScope.aziende_activities : {
		filtri_key: "filtri_aziende_activities"
		,fn_filtri_set_default_filtri_app: function() {
			if ($rootScope.aziende_activities && $rootScope.aziende_activities.filtri) {
				let data_inizio = new Date();
				data_inizio.setHours(0,0,0,0);
				let data_fine = new Date();
				data_fine.setHours(23,59,59,999);

				$rootScope.aziende_activities.filtri.sorting						= [{
					property: "aa_date"
					,reverse: true
				}];

				$rootScope.aziende_activities.filtri.search							= undefined;

				$rootScope.aziende_activities.filtri.fl_data						= true;
				$rootScope.aziende_activities.filtri.data_inizio					= new Date(data_inizio.valueOf());
				$rootScope.aziende_activities.filtri.data_fine						= new Date(data_fine.valueOf());

				$rootScope.aziende_activities.filtri.show							= $rootScope.aziende_activities.filtri.show ? $rootScope.aziende_activities.filtri.show : {};
				$rootScope.aziende_activities.filtri.show.aa_id						= true;
				$rootScope.aziende_activities.filtri.show.aa_idazienda				= true;
				$rootScope.aziende_activities.filtri.show.aa_idutente				= true;
				$rootScope.aziende_activities.filtri.show.aa_ant					= true;
				$rootScope.aziende_activities.filtri.show.aa_date					= true;
				$rootScope.aziende_activities.filtri.show.aa_post					= true;
				$rootScope.aziende_activities.filtri.show.aa_pres_ant				= true;
				$rootScope.aziende_activities.filtri.show.aa_gradi					= true;
				$rootScope.aziende_activities.filtri.show.aa_moto					= true;
			}
		}
		,fn_filtri_set_custom_filtri_app: function() {
			if ($rootScope.aziende_activities && $rootScope.aziende_activities.filtri) {
				let filtri_app = $localStorage[$rootScope.aziende_activities.filtri_key];

				if (filtri_app) {
					$rootScope.aziende_activities.filtri.sorting						= filtri_app.sorting							? filtri_app.sorting							: $rootScope.aziende_activities.filtri.sorting;
					$rootScope.aziende_activities.filtri.search							= filtri_app.search								? filtri_app.search								: $rootScope.aziende_activities.filtri.search;

					$rootScope.aziende_activities.filtri.fl_data						= !!filtri_app.fl_data;
					$rootScope.aziende_activities.filtri.data_inizio					= filtri_app.data_inizio						? new Date(filtri_app.data_inizio.valueOf())	: $rootScope.aziende_activities.filtri.data_inizio;
					$rootScope.aziende_activities.filtri.data_fine						= filtri_app.data_fine							? new Date(filtri_app.data_fine.valueOf())		: $rootScope.aziende_activities.filtri.data_fine;

					$rootScope.aziende_activities.filtri.show							= $rootScope.aziende_activities.filtri.show		? $rootScope.aziende_activities.filtri.show		: {};
					filtri_app.show														= filtri_app.show								? filtri_app.show								: {};
					$rootScope.aziende_activities.filtri.show.aa_id						= !!filtri_app.show.aa_id;
					$rootScope.aziende_activities.filtri.show.aa_idazienda				= !!filtri_app.show.aa_idazienda;
					$rootScope.aziende_activities.filtri.show.aa_idutente				= !!filtri_app.show.aa_idutente;
					$rootScope.aziende_activities.filtri.show.aa_ant					= !!filtri_app.show.aa_ant;
					$rootScope.aziende_activities.filtri.show.aa_date					= !!filtri_app.show.aa_date;
					$rootScope.aziende_activities.filtri.show.aa_post					= !!filtri_app.show.aa_post;
					$rootScope.aziende_activities.filtri.show.aa_pres_ant				= !!filtri_app.show.aa_pres_ant;
					$rootScope.aziende_activities.filtri.show.aa_gradi					= !!filtri_app.show.aa_gradi;
					$rootScope.aziende_activities.filtri.show.aa_moto					= !!filtri_app.show.aa_moto;
				}
			}
		}
		,fn_filtri_filter: function(items, filtri, limit) {
			let filtered = [];

			let data_inizio	= filtri && filtri.fl_data	&& filtri.data_inizio	? new Date(filtri.data_inizio.valueOf()).toISOString() : undefined;
			let data_fine	= filtri && filtri.fl_data	&& filtri.data_fine		? new Date(filtri.data_fine.valueOf()).toISOString() : undefined;

			if (items) for (let i = 0; i < items.length && (!limit || (limit && limit > filtered.length)); i++){
				let item = items[i];
				if (filtri && !filtri.fl_show_done && item.af_data_evasione) continue;
				if ($scope.page() == "scadenziario" && $rootScope.scadenziario.page == "crm" && $rootScope.scadenziario.azienda && $rootScope.scadenziario.azienda.az_id != item.aa_idazienda) continue;
				if (data_inizio && item.aa_date < data_inizio) continue;
				if (data_fine && item.aa_date > data_fine) continue;
				if (
					filtri
					&& filtri.search
					&& !$filter("filter")(
						[{
							item: item
							,azienda: $rootScope.aziende.map[item.aa_idazienda]
							,utente: $rootScope.utenti.map[item.aa_idutente]
						}]
						, filtri.search
					).length
				) {
					continue;
				}
				filtered.push(item);
			}
			return filtered;
		}
		,toggle_rubrica: function(rubrica) {
			if (this.rubrica_filtri_aziende_activities	&& this.rubrica_filtri_aziende_activities != rubrica)	this.rubrica_filtri_aziende_activities.fl_open = false;
			if (rubrica) rubrica.fl_open = !rubrica.fl_open;
		}
		,rubrica_filtri_aziende_activities: {
			template: "tmpl/rubrica_filtri_aziende_activities.tmpl.html"
			,model: undefined // settato dopo... dovrebbe puntare a $rootScope.aziende_activities
			,fl_open: false
		}
	};
	$rootScope.aziende_activities.rubrica_filtri_aziende_activities.model = $rootScope.aziende_activities;

	$rootScope.select_aziende_activities = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "AziendaActivityBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.aziende_activities.righe = response;
				return Promise.resolve($rootScope.aziende_activities.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.insert_azienda_activity = function(azienda_activity) {
		return azienda_activity ? $scope.ajax(
			"api/base/save.php"
			,{
				beanName: "AziendaActivityBean"
				,model: azienda_activity
			}
			,true
		).then(
			(response) => {
				azienda_activity.aa_id = response[0].aa_id;
				$scope.push($rootScope.aziende_activities.righe, azienda_activity);
				$scope.toast("Attività salvata");
				return Promise.resolve(azienda_activity);
			}
			,(response) => {return Promise.reject(response)}
		) : $rootScope.anagrafica_azienda_activity();
	}

	$rootScope.delete_azienda_activity = function(azienda_activity, fl_ask_confirm) {
		if (azienda_activity) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler eliminare l'attività?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_azienda_activity(azienda_activity, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/azienda_activity/delete.php"
				,{azienda_activity: azienda_activity}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.aziende_activities.righe, azienda_activity);
					if ($rootScope.gestione && $rootScope.gestione.azienda_activity == azienda_activity) {
						$rootScope.gestione_clear_azienda_activity();
					}
					$scope.toast("Attività eliminata");
					return Promise.resolve(azienda_activity);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"azienda_activity is "
			+ (azienda_activity === undefined ? "undefined" : "")
			+ (azienda_activity === null ? "null" : "")
			+ (azienda_activity === false ? "false" : "")
			+ (azienda_activity === 0 ? "0" : "")
		)
	}

	$rootScope.anagrafica_azienda_activity = function(azienda_activity) {
		let dialog = {};
		dialog.clickOutsideToClose = true;
		dialog.title = "Anagrafica agenda";
		dialog.class = "dialog-md";
		dialog.content_tmpl = "tmpl/anagrafica_azienda_activity.tmpl.html";
		dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
		dialog.disabledform = false;
		dialog.editableform = true;

		dialog.azienda_activity = azienda_activity ? azienda_activity : {};
		dialog.date = dialog.azienda_activity.aa_date ? new Date(dialog.azienda_activity.aa_date.valueOf()) : new Date();
		dialog.date.setSeconds(0, 0);
		dialog.azienda_activity.aa_qta = dialog.azienda_activity.aa_qta ? parseFloat(dialog.azienda_activity.aa_qta) : 0;

		dialog.aziende = $rootScope.aziende;
		dialog.utenti = $rootScope.utenti;
		dialog.logged_user = $scope.logged_user;

		dialog.deleteFn = dialog.azienda_activity.aa_id ? function(answer, cancelFn) {
			return $rootScope.delete_azienda_activity(answer.azienda_activity, true).then(
				(azienda_activity) => {
					if (cancelFn) {
						cancelFn();
					}
					return Promise.resolve(azienda_activity);
				}
				,(response) => {return Promise.reject(response)}
			);
		} : undefined;

		return $scope.alert(dialog).then(
			(answer) => {
				answer.azienda_activity.aa_date = new Date(answer.date.valueOf()).toISOString();
				return $rootScope.insert_azienda_activity(answer.azienda_activity)
			}
			,(answer) => {return Promise.reject(answer)}
		);
	}
}]);