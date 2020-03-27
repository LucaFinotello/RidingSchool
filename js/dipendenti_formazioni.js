app.controller("dipendenti_formazioni", ["$rootScope", "$scope", "$localStorage", "$filter", function($rootScope, $scope, $localStorage, $filter) {
	$rootScope.dipendenti_formazioni = $rootScope.dipendenti_formazioni ? $rootScope.dipendenti_formazioni : {
		filtri_key: "filtri_dipendenti_formazioni"
		,fn_filtri_set_default_filtri_app: function() {
			if ($rootScope.dipendenti_formazioni && $rootScope.dipendenti_formazioni.filtri) {
				let data_inizio = new Date();
				data_inizio.setHours(0,0,0,0);
				let data_fine = new Date();
				data_fine.setHours(23,59,59,999);

				$rootScope.dipendenti_formazioni.filtri.sorting						= [{
					property: "df_data_scadenza"
					,reverse: false
				}];

				$rootScope.dipendenti_formazioni.filtri.search						= undefined;
				$rootScope.dipendenti_formazioni.filtri.aziende						= {};
				$rootScope.dipendenti_formazioni.filtri.dipendenti					= {};
				$rootScope.dipendenti_formazioni.filtri.formazioni					= {};

				$rootScope.dipendenti_formazioni.filtri.fl_data_esecuzione			= true;
				$rootScope.dipendenti_formazioni.filtri.data_inizio_esecuzione		= new Date(data_inizio.valueOf());
				$rootScope.dipendenti_formazioni.filtri.data_fine_esecuzione		= new Date(data_fine.valueOf());
				$rootScope.dipendenti_formazioni.filtri.fl_data_scadenza			= false;
				$rootScope.dipendenti_formazioni.filtri.data_inizio_scadenza		= new Date(data_inizio.valueOf());
				$rootScope.dipendenti_formazioni.filtri.data_fine_scadenza			= new Date(data_fine.valueOf());

				$rootScope.dipendenti_formazioni.filtri.show						= $rootScope.dipendenti_formazioni.filtri.show ? $rootScope.dipendenti_formazioni.filtri.show : {};
				$rootScope.dipendenti_formazioni.filtri.show.idazienda				= true;
				$rootScope.dipendenti_formazioni.filtri.show.df_id					= true;
				$rootScope.dipendenti_formazioni.filtri.show.df_iddipendente		= true;
				$rootScope.dipendenti_formazioni.filtri.show.df_idformazione		= true;
				$rootScope.dipendenti_formazioni.filtri.show.df_data_esecuzione		= true;
				$rootScope.dipendenti_formazioni.filtri.show.df_data_scadenza		= true;
				$rootScope.dipendenti_formazioni.filtri.show.df_docente				= true;
				$rootScope.dipendenti_formazioni.filtri.show.df_note				= true;
			}
		}
		,fn_filtri_set_custom_filtri_app: function() {
			if ($rootScope.dipendenti_formazioni && $rootScope.dipendenti_formazioni.filtri) {
				let filtri_app = $localStorage[$rootScope.dipendenti_formazioni.filtri_key];

				if (filtri_app) {
					$rootScope.dipendenti_formazioni.filtri.sorting						= filtri_app.sorting								? filtri_app.sorting										: $rootScope.dipendenti_formazioni.filtri.sorting;
					$rootScope.dipendenti_formazioni.filtri.search						= filtri_app.search									? filtri_app.search											: $rootScope.dipendenti_formazioni.filtri.search;
					$rootScope.dipendenti_formazioni.filtri.aziende						= filtri_app.aziende								? filtri_app.aziende										: $rootScope.dipendenti_formazioni.filtri.aziende;
					$rootScope.dipendenti_formazioni.filtri.dipendenti					= filtri_app.dipendenti								? filtri_app.dipendenti										: $rootScope.dipendenti_formazioni.filtri.dipendenti;
					$rootScope.dipendenti_formazioni.filtri.formazioni					= filtri_app.formazioni								? filtri_app.formazioni										: $rootScope.dipendenti_formazioni.filtri.formazioni;

					$rootScope.dipendenti_formazioni.filtri.fl_data_esecuzione			= !!filtri_app.fl_data_esecuzione;
					$rootScope.dipendenti_formazioni.filtri.data_inizio_esecuzione		= filtri_app.data_inizio_esecuzione					? new Date(filtri_app.data_inizio_esecuzione.valueOf())		: $rootScope.dipendenti_formazioni.filtri.data_inizio_esecuzione;
					$rootScope.dipendenti_formazioni.filtri.data_fine_esecuzione		= filtri_app.data_fine_esecuzione					? new Date(filtri_app.data_fine_esecuzione.valueOf())		: $rootScope.dipendenti_formazioni.filtri.data_fine_esecuzione;
					$rootScope.dipendenti_formazioni.filtri.fl_data_scadenza			= !!filtri_app.fl_data_scadenza;
					$rootScope.dipendenti_formazioni.filtri.data_inizio_scadenza		= filtri_app.data_inizio_scadenza					? new Date(filtri_app.data_inizio_scadenza.valueOf())		: $rootScope.dipendenti_formazioni.filtri.data_inizio_scadenza;
					$rootScope.dipendenti_formazioni.filtri.data_fine_scadenza			= filtri_app.data_fine_scadenza						? new Date(filtri_app.data_fine_scadenza.valueOf())			: $rootScope.dipendenti_formazioni.filtri.data_fine_scadenza;

					$rootScope.dipendenti_formazioni.filtri.show						= $rootScope.dipendenti_formazioni.filtri.show		? $rootScope.dipendenti_formazioni.filtri.show				: {};
					filtri_app.show														= filtri_app.show									? filtri_app.show											: {};
					$rootScope.dipendenti_formazioni.filtri.show.idazienda				= !!filtri_app.show.idazienda;
					$rootScope.dipendenti_formazioni.filtri.show.df_id					= !!filtri_app.show.df_id;
					$rootScope.dipendenti_formazioni.filtri.show.df_iddipendente		= !!filtri_app.show.df_iddipendente;
					$rootScope.dipendenti_formazioni.filtri.show.df_idformazione		= !!filtri_app.show.df_idformazione;
					$rootScope.dipendenti_formazioni.filtri.show.df_data_esecuzione		= !!filtri_app.show.df_data_esecuzione;
					$rootScope.dipendenti_formazioni.filtri.show.df_data_scadenza		= !!filtri_app.show.df_data_scadenza;
					$rootScope.dipendenti_formazioni.filtri.show.df_docente				= !!filtri_app.show.df_docente;
					$rootScope.dipendenti_formazioni.filtri.show.df_note				= !!filtri_app.show.df_note;
				}
			}
		}
		,fn_filtri_filter: function(items, filtri, limit) {
			let filtered = [];

			let data_inizio_esecuzione	= filtri && filtri.fl_data_esecuzione	&& filtri.data_inizio_esecuzione	? new Date(filtri.data_inizio_esecuzione.valueOf()).toISOString() : undefined;
			let data_fine_esecuzione	= filtri && filtri.fl_data_esecuzione	&& filtri.data_fine_esecuzione		? new Date(filtri.data_fine_esecuzione.valueOf()).toISOString() : undefined;
			let data_inizio_scadenza	= filtri && filtri.fl_data_scadenza		&& filtri.data_inizio_scadenza		? new Date(filtri.data_inizio_scadenza.valueOf()).toISOString() : undefined;
			let data_fine_scadenza		= filtri && filtri.fl_data_scadenza		&& filtri.data_fine_scadenza		? new Date(filtri.data_fine_scadenza.valueOf()).toISOString() : undefined;

			for (let i = 0; items && i < items.length && (!limit || (limit && limit > filtered.length)); i++) {
				let item = items[i];
				if (data_inizio_esecuzione	&& item.df_data_esecuzione	< data_inizio_esecuzione) continue;
				if (data_fine_esecuzione	&& item.df_data_esecuzione	> data_fine_esecuzione) continue;
				if (data_inizio_scadenza	&& item.df_data_scadenza	< data_inizio_scadenza) continue;
				if (data_fine_scadenza		&& item.df_data_scadenza	> data_fine_scadenza) continue;
				if ($scope.page() == "scadenziario" && $rootScope.scadenziario.page == "dipendenti_formazioni") {
					if ($rootScope.scadenziario.azienda) {
						if ($rootScope.scadenziario.azienda.az_id != $rootScope.dipendenti.map[item.df_iddipendente].di_idazienda) {
							continue;
						}
					} else {
						if (filtri && filtri.aziende && $scope.get_valid_keys(filtri.aziende).length > 0 && !filtri.aziende[$rootScope.dipendenti.map[item.df_iddipendente].di_idazienda]) {
							continue;
						}
					}
					if ($rootScope.scadenziario.dipendente) {
						if ($rootScope.scadenziario.dipendente.di_id != item.df_iddipendente) {
							continue;
						}
					} else {
						if (filtri && filtri.dipendenti && $scope.get_valid_keys(filtri.dipendenti).length > 0 && !filtri.dipendenti[item.df_iddipendente]) {
							continue;
						}
					}
				} else {
					if (filtri && filtri.aziende && $scope.get_valid_keys(filtri.aziende).length > 0 && !filtri.aziende[$rootScope.dipendenti.map[item.df_iddipendente].di_idazienda]) continue;
					if (filtri && filtri.dipendenti && $scope.get_valid_keys(filtri.dipendenti).length > 0 && !filtri.dipendenti[item.df_iddipendente]) continue;
				}
				if (filtri && filtri.formazioni && $scope.get_valid_keys(filtri.formazioni).length > 0 && !filtri.formazioni[item.df_idformazione]) continue;
				if (
					filtri
					&& filtri.search
					&& !$filter("filter")(
						[{
							item: item
							,dipendente: $rootScope.dipendenti.map[item.df_iddipendente]
							,formazione: $rootScope.formazioni.map[item.df_idformazione]
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
			if (this.rubrica_aziende						&& this.rubrica_aziende != rubrica)							this.rubrica_aziende.fl_open = false;
			if (this.rubrica_dipendenti						&& this.rubrica_dipendenti != rubrica)						this.rubrica_dipendenti.fl_open = false;
			if (this.rubrica_formazioni						&& this.rubrica_formazioni != rubrica)						this.rubrica_formazioni.fl_open = false;
			if (this.rubrica_filtri_dipendenti_formazioni	&& this.rubrica_filtri_dipendenti_formazioni != rubrica)	this.rubrica_filtri_dipendenti_formazioni.fl_open = false;
			if (rubrica) rubrica.fl_open = !rubrica.fl_open;
		}
		,rubrica_aziende: {
			template: "tmpl/rubrica_default.tmpl.html"
			,model: $rootScope.aziende
			,order_by: ["az_descr"]
			,fl_open: false
			,deselect: function() {$rootScope.dipendenti_formazioni.filtri.aziende = {}}
			,search: undefined
			,checked: function(item) {return item && $rootScope.dipendenti_formazioni.filtri.aziende[item.az_id] !== undefined}
			,click: function(item) {$rootScope.dipendenti_formazioni.filtri.aziende[item.az_id] = $rootScope.dipendenti_formazioni.filtri.aziende[item.az_id] !== undefined ? undefined : item.az_descr}
			,subhead: function(item) {return item.az_descr}
			,body: undefined
			,caption: function(item) {return item.az_id}
			,lines: 2
			,custom_filter_fn: function(item) {
				return $rootScope.utente_is_utente($scope.logged_user) || $scope.logged_user.idazienda == item.az_id;
			}
		}
		,rubrica_dipendenti: {
			template: "tmpl/rubrica_default.tmpl.html"
			,model: $rootScope.dipendenti
			,order_by: ["di_descr"]
			,fl_open: false
			,deselect: function() {$rootScope.dipendenti_formazioni.filtri.dipendenti = {}}
			,search: undefined
			,checked: function(item) {return item && $rootScope.dipendenti_formazioni.filtri.dipendenti[item.di_id] !== undefined}
			,click: function(item) {$rootScope.dipendenti_formazioni.filtri.dipendenti[item.di_id] = $rootScope.dipendenti_formazioni.filtri.dipendenti[item.di_id] !== undefined ? undefined : item.di_descr}
			,subhead: function(item) {return item.di_descr}
			,body: undefined
			,caption: function(item) {return item.di_id}
			,lines: 2
			,custom_filter_fn: function(item) {
				if ($scope.page() == "scadenziario" && $rootScope.scadenziario.azienda) {
					return item && $rootScope.scadenziario.azienda.az_id == item.di_idazienda;
				}
				return true;
			}
		}
		,rubrica_formazioni: {
			template: "tmpl/rubrica_default.tmpl.html"
			,model: $rootScope.formazioni
			,order_by: ["fo_descr"]
			,fl_open: false
			,deselect: function() {$rootScope.dipendenti_formazioni.filtri.formazioni = {}}
			,search: undefined
			,checked: function(item) {return item && $rootScope.dipendenti_formazioni.filtri.formazioni[item.fo_id] !== undefined}
			,click: function(item) {$rootScope.dipendenti_formazioni.filtri.formazioni[item.fo_id] = $rootScope.dipendenti_formazioni.filtri.formazioni[item.fo_id] !== undefined ? undefined : item.fo_descr}
			,subhead: function(item) {return item.fo_descr}
			,body: undefined
			,caption: function(item) {return item.fo_id}
			,lines: 2
			,custom_filter_fn: undefined
		}
		,rubrica_filtri_dipendenti_formazioni: {
			template: "tmpl/rubrica_filtri_dipendenti_formazioni.tmpl.html"
			,model: undefined // settato dopo... dovrebbe puntare a $rootScope.dipendenti_formazioni
			,fl_open: false
		}
	};
	$rootScope.dipendenti_formazioni.rubrica_filtri_dipendenti_formazioni.model = $rootScope.dipendenti_formazioni;

	$rootScope.select_history_dipendente_formazione = function(dipendente_formazione) {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "DipendenteFormazioneBean"
				,model: [{
					df_iddipendente: dipendente_formazione ? dipendente_formazione.df_iddipendente : undefined
					,df_idformazione: dipendente_formazione ? dipendente_formazione.df_idformazione : undefined
				}]
			}
			,true
		).then(
			(response) => {
				let dialog = {};
				dialog.clickOutsideToClose = true;
				dialog.title = "Storico formazione svolta";
				dialog.class = "";
				dialog.content_tmpl = "tmpl/history_dipendente_formazione.tmpl.html";
				dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
				dialog.disabledform = true;
				dialog.editableform = false;

				dialog.dipendenti_formazioni = {righe: response};

				dialog.dipendenti = $rootScope.dipendenti;
				dialog.formazioni = $rootScope.formazioni;
				dialog.anagrafica_dipendente_formazione = $rootScope.anagrafica_dipendente_formazione;
				dialog.logged_user = $scope.logged_user;

				return $scope.alert(dialog).then(
					(answer) => {return Promise.resolve(answer.dipendenti_formazioni)}
					,(answer) => {return Promise.reject(answer)}
				);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.select_lastest_dipendenti_formazioni = function() {
		return $scope.ajax(
			"api/dipendente_formazione/find_lastest.php"
			,{}
			,true
		).then(
			(response) => {
				$rootScope.dipendenti_formazioni.righe = response;
				return Promise.resolve($rootScope.dipendenti_formazioni.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.insert_dipendente_formazione = function(dipendente_formazione) {
		if (dipendente_formazione) {
			return $scope.ajax(
				"api/base/save.php"
				,{
					beanName: "DipendenteFormazioneBean"
					,model: dipendente_formazione
				}
				,true
			).then(
				(response) => {
					dipendente_formazione.df_id = response[0].df_id;
					$scope.push($rootScope.dipendenti_formazioni.righe, dipendente_formazione);
					$scope.toast("Formazione svolta salvata");
					return Promise.resolve(dipendente_formazione);
				}
				,(response) => {return Promise.reject(response)}
			)
		}
		return Promise.reject(
			"dipendente_formazione is "
			+ (dipendente_formazione === undefined ? "undefined" : "")
			+ (dipendente_formazione === null ? "null" : "")
			+ (dipendente_formazione === false ? "false" : "")
			+ (dipendente_formazione === 0 ? "0" : "")
		)
	}

	$rootScope.anagrafica_dipendente_formazione = function(dipendente_formazione, disabledform, editableform) {
		let dialog = {};
		dialog.clickOutsideToClose = true;
		dialog.title = "Anagrafica formazione svolta";
		dialog.class = "";
		dialog.content_tmpl = "tmpl/anagrafica_dipendente_formazione.tmpl.html";
		dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
		dialog.disabledform = disabledform === undefined ? false : !!disabledform;
		dialog.editableform = editableform === undefined ? true : !!editableform;

		dialog.dipendente_formazione				= dipendente_formazione								? dipendente_formazione														: {};
		dialog.dipendente_formazione.dipendente		= dialog.dipendente_formazione.df_iddipendente		? $rootScope.dipendenti.map[dialog.dipendente_formazione.df_iddipendente]	: undefined;
		dialog.dipendente_formazione.formazione		= dialog.dipendente_formazione.df_idformazione		? $rootScope.formazioni.map[dialog.dipendente_formazione.df_idformazione]	: undefined;
		dialog.data_esecuzione						= dialog.dipendente_formazione.df_data_esecuzione	? new Date(dialog.dipendente_formazione.df_data_esecuzione.valueOf())		: new Date();
		dialog.data_scadenza						= dialog.dipendente_formazione.df_data_scadenza		? new Date(dialog.dipendente_formazione.df_data_scadenza.valueOf())			: undefined;

		dialog.dipendenti = $rootScope.dipendenti;
		dialog.formazioni = $rootScope.formazioni;

		dialog.deleteFn = dialog.dipendente_formazione.df_id ? function(answer, cancelFn) {
			return $rootScope.delete_dipendente_formazione(answer.dipendente_formazione, true).then(
				(dipendente_formazione) => {
					if (cancelFn) {
						cancelFn();
					}
					return Promise.resolve(dipendente_formazione);
				}
				,(response) => {return Promise.reject(response)}
			);
		} : undefined;

		return $scope.alert(dialog).then(
			(answer) => {
				if (answer.dipendente_formazione) {
					answer.dipendente_formazione.df_data_esecuzione		= answer.data_esecuzione		? new Date(answer.data_esecuzione.valueOf()).toISOString()		: new Date().toISOString();
					answer.dipendente_formazione.df_data_scadenza		= answer.data_scadenza			? new Date(answer.data_scadenza.valueOf()).toISOString()		: undefined;
				}
				return $rootScope.insert_dipendente_formazione(answer.dipendente_formazione);
			}
			,(answer) => {return Promise.reject(answer)}
		);
	}

	$rootScope.delete_dipendente_formazione = function(dipendente_formazione, fl_ask_confirm) {
		if (dipendente_formazione) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler eliminare questa formazione svolta?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_dipendente_formazione(dipendente_formazione, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/dipendente_formazione/delete.php"
				,{dipendente_formazione: dipendente_formazione}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.dipendenti_formazioni.righe, dipendente_formazione);
					$scope.toast("Formazione svolta eliminata");
					return Promise.resolve(dipendente_formazione);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"dipendente_formazione is "
			+ (dipendente_formazione === undefined ? "undefined" : "")
			+ (dipendente_formazione === null ? "null" : "")
			+ (dipendente_formazione === false ? "false" : "")
			+ (dipendente_formazione === 0 ? "0" : "")
		)
	}

	$rootScope.report_dipendenti_formazioni_export_xlsx = function(dipendenti_formazioni, filtri) {
		dipendenti_formazioni = dipendenti_formazioni ? dipendenti_formazioni : [];
		filtri = filtri ? filtri : {};
		filtri.show = filtri.show ? filtri.show : {
			idazienda: true
			,df_id: true
			,df_iddipendente: true
			,df_idformazione: true
			,df_data_esecuzione: true
			,df_data_scadenza: true
			,df_docente: true
			,df_note: true
		};
		
		let title = "Formazione_dipendenti";
		let table = "<thead><tr>";
		if (filtri.show.idazienda) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>ID Azienda</b></th>";
		if (filtri.show.idazienda) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Azienda</b></th>";
		if (filtri.show.df_iddipendente) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>ID Dipendente</b></th>";
		if (filtri.show.df_iddipendente) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Dipendente</b></th>";
		if (filtri.show.df_idformazione) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>ID Formazione</b></th>";
		if (filtri.show.df_idformazione) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Formazione</b></th>";
		if (filtri.show.df_data_esecuzione) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Data Esecuzione</b></th>";
		if (filtri.show.df_data_scadenza) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Data Scadenza</b></th>";
		if (filtri.show.df_docente) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Docente</b></th>";
		if (filtri.show.df_note) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Note</b></th>";
		table += "</tr></thead>";
		table +="<tbody>";
		for (let df = 0; df < dipendenti_formazioni.length; df++) {
			let dipendente_formazione = dipendenti_formazioni[df];
			table += "<tr>";
			if (filtri.show.idazienda) {
				table += "<td style=\"background-color: " + ($filter("dipendente_formazione_scaduta")(dipendente_formazione) ? "#F44336" : "transparent") + "\">";
				if ($rootScope.dipendenti.map[dipendente_formazione.df_iddipendente].di_idazienda) table += $rootScope.dipendenti.map[dipendente_formazione.df_iddipendente].di_idazienda;
				table += "</td>";
				table += "<td style=\"background-color: " + ($filter("dipendente_formazione_scaduta")(dipendente_formazione) ? "#F44336" : "transparent") + "\">";
				if ($rootScope.dipendenti.map[dipendente_formazione.df_iddipendente].di_idazienda) table += $rootScope.aziende.map[$rootScope.dipendenti.map[dipendente_formazione.df_iddipendente].di_idazienda].az_descr;
				table += "</td>";
			}
			if (filtri.show.df_iddipendente) table += "<td style=\"background-color: " + ($filter("dipendente_formazione_scaduta")(dipendente_formazione) ? "#F44336" : "transparent") + "\">" + dipendente_formazione.df_iddipendente + "</td>";
			if (filtri.show.df_iddipendente) table += "<td style=\"background-color: " + ($filter("dipendente_formazione_scaduta")(dipendente_formazione) ? "#F44336" : "transparent") + "\">" + $rootScope.dipendenti.map[dipendente_formazione.df_iddipendente].di_descr + "</td>";
			if (filtri.show.df_idformazione) table += "<td style=\"background-color: " + ($filter("dipendente_formazione_scaduta")(dipendente_formazione) ? "#F44336" : "transparent") + "\">" + dipendente_formazione.df_idformazione + "</td>";
			if (filtri.show.df_idformazione) table += "<td style=\"background-color: " + ($filter("dipendente_formazione_scaduta")(dipendente_formazione) ? "#F44336" : "transparent") + "\">" + $rootScope.formazioni.map[dipendente_formazione.df_idformazione].fo_descr + "</td>";
			if (filtri.show.df_data_esecuzione) table += "<td style=\"background-color: " + ($filter("dipendente_formazione_scaduta")(dipendente_formazione) ? "#F44336" : "transparent") + "\">" + (dipendente_formazione.df_data_esecuzione ? $filter("date")(dipendente_formazione.df_data_esecuzione, "dd/MM/yyyy") : "") + "</td>";
			if (filtri.show.df_data_scadenza) table += "<td style=\"background-color: " + ($filter("dipendente_formazione_scaduta")(dipendente_formazione) ? "#F44336" : "transparent") + "\">" + (dipendente_formazione.df_data_scadenza ? $filter("date")(dipendente_formazione.df_data_scadenza, "dd/MM/yyyy") : "") + "</td>";
			if (filtri.show.df_docente) table += "<td style=\"background-color: " + ($filter("dipendente_formazione_scaduta")(dipendente_formazione) ? "#F44336" : "transparent") + "\">" + dipendente_formazione.df_docente + "</td>";
			if (filtri.show.df_note) table += "<td style=\"background-color: " + ($filter("dipendente_formazione_scaduta")(dipendente_formazione) ? "#F44336" : "transparent") + "\">" + dipendente_formazione.df_note + "</td>";
			table += "</tr>";
		}
		table += "</tbody>";

		let content =	"<html"
					+	"	xmlns:o=\"urn:schemas-microsoft-com:office:office\""
					+	"	xmlns:x=\"urn:schemas-microsoft-com:office:excel\""
					+	"	xmlns=\"http://www.w3.org/TR/REC-html40\""
					+	">"
					+	"	<head>"
					+	"		<meta charset=\"utf-8\" />"
					+	"		<!--[if gte mso 9]>"
					+	"		<xml>"
					+	"			<x:ExcelWorkbook>"
					+	"				<x:ExcelWorksheets>"
					+	"					<x:ExcelWorksheet>"
					+	"						<x:Name>" + title + "</x:Name>"
					+	"						<x:WorksheetOptions>"
					+	"							<x:DisplayGridlines/>"
					+	"						</x:WorksheetOptions>"
					+	"					</x:ExcelWorksheet>"
					+	"				</x:ExcelWorksheets>"
					+	"			</x:ExcelWorkbook>"
					+	"		</xml>"
					+	"		<![endif]-->"
					+	"	</head>"
					+	"	<body>"
					+	"		<table>" + table + "</table>"
					+	"	</body>"
					+	"</html>";

		let file = {
			name: title + $filter("date")(new Date(), "_yyyy_MM_dd_HH_mm_ss") + ".xls"
			,type: "application/vnd.ms-excel"
			,size: content.length
			,blob_base64: window.btoa(unescape(encodeURIComponent(content)))
		};

		return $rootScope.ub_input_model_change_insert_allegato(file).then(
			(allegato) => {return $scope.download_file_by_base64(file.blob_base64, file.name, file.type, true)}
			,(response) => {return Promise.resolve(response)}
		)
	}
	$rootScope.report_dipendenti_formazioni_export_pdf = function(dipendenti_formazioni, filtri) {
		dipendenti_formazioni = dipendenti_formazioni ? dipendenti_formazioni : [];
		filtri = filtri ? filtri : {};
		filtri.show = filtri.show ? filtri.show : {
			idazienda: true
			,df_id: true
			,df_iddipendente: true
			,df_idformazione: true
			,df_data_esecuzione: true
			,df_data_scadenza: true
			,df_docente: true
			,df_note: true
		};

		let righe = [];
		for (let di = 0; di < dipendenti_formazioni.length; di++) {
			let dipendente_formazione = dipendenti_formazioni[di];
			righe.push({
				az_id: $rootScope.dipendenti.map[dipendente_formazione.df_iddipendente].di_idazienda
				,az_descr: $rootScope.dipendenti.map[dipendente_formazione.df_iddipendente].di_idazienda ? $rootScope.aziende.map[$rootScope.dipendenti.map[dipendente_formazione.df_iddipendente].di_idazienda].az_descr : undefined
				,df_iddipendente: dipendente_formazione.df_iddipendente
				,di_descr: $rootScope.dipendenti.map[dipendente_formazione.df_iddipendente].di_descr
				,df_idformazione: dipendente_formazione.df_idformazione
				,fo_descr: $rootScope.formazioni.map[dipendente_formazione.df_idformazione].fo_descr
				,df_data_esecuzione: dipendente_formazione.df_data_esecuzione
				,df_data_scadenza: dipendente_formazione.df_data_scadenza
				,df_docente: dipendente_formazione.df_docente
				,df_note: dipendente_formazione.df_note
			});
		}

		return $scope.ajax(
			"api/base/toPdf.php"
			,{
				template: "report_dipendenti_formazioni.tmpl.html"
				,options: {
					landscape: true
					,disable_links: true
					,disable_backgrounds: true // non usare!!! toglie anche i css striped D:
					,delay: 2 // da 0 a 10
					,use_print: true
					,format: "A4"
				}
				,pdfpostdata: {
					righe: righe
					,filtri: filtri
					,date: new Date().toISOString()
				}
			}
			,true
		).then(
			(response) => {
				let file = {
					name: "Formazione_dipendenti" + $filter("date")(new Date(), "_yyyy_MM_dd_HH_mm_ss") + ".pdf"
					,type: "application/pdf"
					,size: response.length
					,blob_base64: window.btoa(unescape(encodeURIComponent(response)))
				};

				return $rootScope.ub_input_model_change_insert_allegato(file).then(
					(allegato) => {return $scope.download_file_by_base64(file.blob_base64, file.name, file.type, true)}
					,(response) => {return Promise.resolve(response)}
				)
			}
			,(response) => {return Promise.reject(response)}
		);
	}
}]);

app.filter("dipendente_formazione_scaduta", [function() {
	return function(dipendente_formazione) {
		return dipendente_formazione && dipendente_formazione.df_data_scadenza && dipendente_formazione.df_data_scadenza < new Date().toISOString();
	}
}]);