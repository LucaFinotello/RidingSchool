app.controller("adempimenti", ["$rootScope", "$scope", "$localStorage", "$filter", function($rootScope, $scope, $localStorage, $filter) {
	$rootScope.adempimenti = $rootScope.adempimenti ? $rootScope.adempimenti : {
		selected: undefined
		,filtri_key: "filtri_adempimenti"
		,fn_filtri_set_default_filtri_app: function() {
			if ($rootScope.adempimenti && $rootScope.adempimenti.filtri) {
				let data_inizio = new Date();
				data_inizio.setHours(0,0,0,0);
				let data_fine = new Date();
				data_fine.setHours(23,59,59,999);

				$rootScope.adempimenti.filtri.sorting						= [{
					property: "cr_idargomento"
					,reverse: false
				}, {
					property: "cr_idadempimento"
					,reverse: false
				}];

				$rootScope.adempimenti.filtri.search						= undefined;
				$rootScope.adempimenti.filtri.aziende						= {};
				$rootScope.adempimenti.filtri.argomenti						= {};
				$rootScope.adempimenti.filtri.adempimenti					= {};
				$rootScope.adempimenti.filtri.stati							= {};

				$rootScope.adempimenti.filtri.fl_data						= true;
				$rootScope.adempimenti.filtri.data_inizio					= new Date(data_inizio.valueOf());
				$rootScope.adempimenti.filtri.data_fine						= new Date(data_fine.valueOf());

				$rootScope.adempimenti.filtri.show							= $rootScope.adempimenti.filtri.show ? $rootScope.adempimenti.filtri.show : {};
				$rootScope.adempimenti.filtri.show.ch_date					= true;
				$rootScope.adempimenti.filtri.show.ch_idazienda				= true;
				$rootScope.adempimenti.filtri.show.cr_idargomento			= true;
				$rootScope.adempimenti.filtri.show.cr_idadempimento			= true;
				$rootScope.adempimenti.filtri.show.cr_idstato				= true;
			}
		}
		,fn_filtri_set_custom_filtri_app: function() {
			if ($rootScope.adempimenti && $rootScope.adempimenti.filtri) {
				let filtri_app = $localStorage[$rootScope.adempimenti.filtri_key];

				if (filtri_app) {
					$rootScope.adempimenti.filtri.sorting					= filtri_app.sorting					? filtri_app.sorting								: $rootScope.adempimenti.filtri.sorting;

					$rootScope.adempimenti.filtri.search					= filtri_app.search						? filtri_app.search									: $rootScope.adempimenti.filtri.search;
					$rootScope.adempimenti.filtri.aziende					= filtri_app.aziende					? filtri_app.aziende								: $rootScope.adempimenti.filtri.aziende;
					$rootScope.adempimenti.filtri.argomenti					= filtri_app.argomenti					? filtri_app.argomenti								: $rootScope.adempimenti.filtri.argomenti;
					$rootScope.adempimenti.filtri.adempimenti				= filtri_app.adempimenti				? filtri_app.adempimenti							: $rootScope.adempimenti.filtri.adempimenti;
					$rootScope.adempimenti.filtri.stati						= filtri_app.stati						? filtri_app.stati									: $rootScope.adempimenti.filtri.stati;

					$rootScope.adempimenti.filtri.fl_data					= !!filtri_app.fl_data;
					$rootScope.adempimenti.filtri.data_inizio				= filtri_app.data_inizio				? new Date(filtri_app.data_inizio.valueOf())		: $rootScope.adempimenti.filtri.data_inizio;
					$rootScope.adempimenti.filtri.data_fine					= filtri_app.data_fine					? new Date(filtri_app.data_fine.valueOf())			: $rootScope.adempimenti.filtri.data_fine;

					$rootScope.adempimenti.filtri.show						= $rootScope.adempimenti.filtri.show	? $rootScope.adempimenti.filtri.show				: {};
					filtri_app.show											= filtri_app.show						? filtri_app.show									: {};
					$rootScope.adempimenti.filtri.show.ch_date				= !!filtri_app.show.ch_date;
					$rootScope.adempimenti.filtri.show.ch_idazienda			= !!filtri_app.show.ch_idazienda;
					$rootScope.adempimenti.filtri.show.cr_idargomento		= !!filtri_app.show.cr_idargomento;
					$rootScope.adempimenti.filtri.show.cr_idadempimento		= !!filtri_app.show.cr_idadempimento;
					$rootScope.adempimenti.filtri.show.cr_idstato			= !!filtri_app.show.cr_idstato;
				}
			}
		}
		,fn_filtri_filter: function(items, filtri, limit) {
			let filtered = [];

			let data_inizio	= filtri && filtri.fl_data	&& filtri.data_inizio	? new Date(filtri.data_inizio.valueOf()).toISOString() : undefined;
			let data_fine	= filtri && filtri.fl_data	&& filtri.data_fine		? new Date(filtri.data_fine.valueOf()).toISOString() : undefined;

			if (items) for (let i = 0; i < items.length && (!limit || (limit && limit > filtered.length)); i++){
				let item = items[i];
				if (data_inizio	&& item.ch_date	< data_inizio) continue;
				if (data_fine	&& item.ch_date	> data_fine) continue;
				if ($scope.page() == "scadenziario" && $rootScope.scadenziario.page == "school_calendar") {
					if ($rootScope.scadenziario.azienda && $rootScope.scadenziario.azienda.az_id != item.ch_idazienda) continue;
				} else if ($rootScope.utente_is_utente($scope.logged_user)) {
					if (filtri && filtri.aziende && $scope.get_valid_keys(filtri.aziende).length > 0 && !filtri.aziende[item.ch_idazienda]) continue;
				} else {
					if (item.ch_idazienda != $scope.logged_user.idazienda) continue;
				}
				if (filtri && filtri.argomenti && $scope.get_valid_keys(filtri.argomenti).length > 0 && !filtri.argomenti[item.cr_idargomento]) continue;
				if (filtri && filtri.adempimenti && $scope.get_valid_keys(filtri.adempimenti).length > 0 && !filtri.adempimenti[item.cr_idadempimento]) continue;
				if (filtri && filtri.stati && $scope.get_valid_keys(filtri.stati).length > 0 && !filtri.stati[item.cr_idstato]) continue;
				if (
					filtri
					&& filtri.search
					&& !$filter("filter")(
						[{
							item: item
							,azienda: $rootScope.aziende.map[item.ch_idazienda].ar_id
							,argomento: {
								ar_id: $rootScope.argomenti.map[item.cr_idargomento].ar_id
								,ar_descr: $rootScope.argomenti.map[item.cr_idargomento].ar_descr
							}
							,adempimento: (function (ad_id, ar_id) {
								let adempimenti = $filter("get_adempimento")(ad_id, ar_id);
								return adempimenti && adempimenti.length > 0 ? {
									ad_id: adempimenti[0].ad_id
									,ad_descr: adempimenti[0].ad_descr
								} : undefined;
							})(item.cr_idadempimento, item.cr_idargomento)
							,stato: (function (st_id, ar_id, ad_id) {
								let stati = $filter("get_stato")(st_id, ar_id, ad_id);
								return stati && stati.length > 0 ? {
									st_id: stati[0].st_id
									,st_descr: stati[0].st_descr
								} : undefined;
							})(item.cr_idstato, item.cr_idargomento, item.cr_idadempimento)
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
			if (this.rubrica_aziende				&& this.rubrica_aziende != rubrica)						this.rubrica_aziende.fl_open = false;
			if (this.rubrica_argomenti				&& this.rubrica_argomenti != rubrica)					this.rubrica_argomenti.fl_open = false;
			if (this.rubrica_adempimenti			&& this.rubrica_adempimenti != rubrica)					this.rubrica_adempimenti.fl_open = false;
			if (this.rubrica_stati					&& this.rubrica_stati != rubrica)						this.rubrica_stati.fl_open = false;
			if (this.rubrica_filtri_adempimenti		&& this.rubrica_filtri_adempimenti != rubrica)			this.rubrica_filtri_adempimenti.fl_open = false;
			if (rubrica) rubrica.fl_open = !rubrica.fl_open;
		}
		,rubrica_aziende: {
			template: "tmpl/rubrica_default.tmpl.html"
			,model: $rootScope.aziende
			,order_by: ["az_descr"]
			,fl_open: false
			,deselect: function() {$rootScope.adempimenti.filtri.aziende = {}}
			,search: undefined
			,checked: function(item) {return item && $rootScope.adempimenti.filtri.aziende[item.az_id] !== undefined}
			,click: function(item) {$rootScope.adempimenti.filtri.aziende[item.az_id] = $rootScope.adempimenti.filtri.aziende[item.az_id] !== undefined ? undefined : item.az_descr}
			,subhead: function(item) {return item.az_descr}
			,body: undefined
			,caption: function(item) {return item.az_id}
			,lines: 2
			,custom_filter_fn: function(item) {
				return $rootScope.utente_is_utente($scope.logged_user) || $scope.logged_user.idazienda == item.az_id;
			}
		}
		,rubrica_argomenti: {
			template: "tmpl/rubrica_default.tmpl.html"
			,model: $rootScope.argomenti
			,order_by: ["ar_descr"]
			,fl_open: false
			,deselect: function() {$rootScope.adempimenti.filtri.argomenti = {}}
			,search: undefined
			,checked: function(item) {return item && $rootScope.adempimenti.filtri.argomenti[item.ar_id] !== undefined}
			,click: function(item) {
				if ($rootScope.adempimenti.filtri.argomenti[item.ar_id] !== undefined) {
					$rootScope.adempimenti.filtri.argomenti[item.ar_id] = undefined;
				} else {
					$rootScope.adempimenti.filtri.argomenti[item.ar_id] = item.ar_descr;
				}
			}
			,subhead: function(item) {return item.ar_descr}
			,body: undefined
			,caption: function(item) {return item.ar_id}
			,lines: 2
			,custom_filter_fn: function(item) {
				if ($scope.page() == "scadenziario" && $rootScope.scadenziario && $rootScope.scadenziario.page == "adempimenti" && $rootScope.scadenziario.azienda) {
					return !!$rootScope.argomento_in_azienda($rootScope.scadenziario.azienda, item);
				}
				return true;
			}
		}
		,rubrica_adempimenti: {
			template: "tmpl/rubrica_adempimenti.tmpl.html"
			,argomenti: $rootScope.argomenti
			,model: undefined
			,order_by: ["ad_descr"]
			,fl_open: false
			,deselect: function() {$rootScope.adempimenti.filtri.adempimenti = {}}
			,search: undefined
			,checked: function(item) {return item && $rootScope.adempimenti.filtri.adempimenti[item.ad_id] !== undefined}
			,click: function(item) {$rootScope.adempimenti.filtri.adempimenti[item.ad_id] = $rootScope.adempimenti.filtri.adempimenti[item.ad_id] !== undefined ? undefined : $rootScope.argomenti.map[item.ad_idargomento].ar_descr + " - " + item.ad_descr}
			,subhead: function(item) {return item.ad_id + " - " + item.ad_descr}
			,body: undefined
			,caption: function(item) {return item.ad_idargomento + " - " + $rootScope.argomenti.map[item.ad_idargomento].ar_descr}
			,lines: 2
			,custom_filter_fn: undefined
		}
		,rubrica_stati: {
			template: "tmpl/rubrica_stati.tmpl.html"
			,argomenti: $rootScope.argomenti
			,model: undefined
			,order_by: ["st_descr"]
			,fl_open: false
			,deselect: function() {$rootScope.adempimenti.filtri.stati = {}}
			,search: undefined
			,checked: function(item) {return item && $rootScope.adempimenti.filtri.stati[item.st_id] !== undefined}
			,click: function(item) {
				let adempimento = $filter("get_adempimento")([item.st_idadempimento]);
				let argomento = adempimento ? $rootScope.argomenti.map[adempimento.ad_id] : undefined;
				$rootScope.adempimenti.filtri.stati[item.st_id] = $rootScope.adempimenti.filtri.stati[item.st_id] !== undefined ? undefined : (argomento ? argomento.ar_descr + " - " : "") + (adempimento ? adempimento.ad_descr + " - " : "") + item.st_descr
			}
			,subhead: function(item) {return item.st_id + " - " + item.st_descr}
			,body: function(item) {
				let adempimento = $filter("get_adempimento")([item.st_idadempimento]);
				return adempimento ? adempimento.ad_id + " - " + adempimento.ad_descr : "";
			}
			,caption: function(item) {
				let adempimento = $filter("get_adempimento")([item.st_idadempimento]);
				let argomento = adempimento ? $rootScope.argomenti.map[adempimento.ad_id] : undefined;
				return argomento ? argomento.ar_id + " - " + argomento.ar_descr : "";
			}
			,lines: 3
			,custom_filter_fn: undefined
		}
		,rubrica_filtri_adempimenti: {
			template: "tmpl/rubrica_filtri_adempimenti.tmpl.html"
			,model: undefined
			,fl_open: false
		}
	};
	$rootScope.adempimenti.rubrica_adempimenti.model = $rootScope.adempimenti;
	$rootScope.adempimenti.rubrica_stati.model = $rootScope.adempimenti;
	$rootScope.adempimenti.rubrica_filtri_adempimenti.model = $rootScope.adempimenti;

	$rootScope.select_lastest_adempimenti = function() {
		return $scope.ajax(
			"api/adempimento/find_lastest.php"
			,{}
			,true
		).then(
			(response) => {
				$rootScope.adempimenti.righe = response;
				return Promise.resolve($rootScope.adempimenti.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.insert_adempimento = function(adempimento, argomento) {
		if (adempimento && argomento) {
			adempimento.ad_idargomento = argomento.ar_id;
		}

		return adempimento ? $scope.ajax(
			"api/base/save.php"
			,{
				beanName: "AdempimentoBean"
				,model: adempimento
			}
			,true
		).then(
			(response) => {
				adempimento.ad_id = response[0].ad_id;
				$scope.push(argomento ? argomento.adempimenti : undefined, adempimento);
				$scope.toast("Adempimento salvato");
				return Promise.resolve(adempimento, argomento);
			}
			,(response) => {return Promise.reject(response)}
		) : $rootScope.anagrafica_adempimento(undefined, argomento);
	}

	$rootScope.delete_adempimento = function(adempimento, fl_ask_confirm, argomento) {
		if (adempimento) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler eliminare l'adempimento?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_adempimento(adempimento, false, argomento)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/adempimento/delete.php"
				,{adempimento: adempimento}
				,true
			).then(
				(response) => {
					$scope.splice(argomento ? argomento.adempimenti : undefined, adempimento);
					if ($rootScope.gestione && $rootScope.gestione.adempimento == adempimento) {
						$rootScope.gestione_clear_adempimento();
					}
					$scope.toast("Adempimento eliminato");
					return Promise.resolve(adempimento, argomento);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"adempimento is "
			+ (adempimento === undefined ? "undefined" : "")
			+ (adempimento === null ? "null" : "")
			+ (adempimento === false ? "false" : "")
			+ (adempimento === 0 ? "0" : "")
		)
	}

	$rootScope.anagrafica_adempimento = function(adempimento, argomento) {
		let dialog = {};
		dialog.clickOutsideToClose = true;
		dialog.title = "Anagrafica adempimento";
		dialog.class = "";
		dialog.content_tmpl = "tmpl/anagrafica_adempimento.tmpl.html";
		dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
		dialog.disabledform = false;
		dialog.editableform = true;

		dialog.adempimento = adempimento ? adempimento : {};
		dialog.adempimento.stati = dialog.adempimento.stati ? dialog.adempimento.stati : [];
		dialog.argomento = argomento;

		dialog.deleteFn = dialog.adempimento.ad_id ? function(answer, cancelFn) {
			return $rootScope.delete_adempimento(answer.adempimento, true, answer.argomento).then(
				(adempimento, argomento) => {
					if (cancelFn) {
						cancelFn();
					}
					return Promise.resolve(adempimento, argomento);
				}
				,(response) => {return Promise.reject(response)}
			);
		} : undefined;

		return $scope.alert(dialog).then(
			(answer) => {return $rootScope.insert_adempimento(answer.adempimento, answer.argomento)}
			,(answer) => {return Promise.reject(answer)}
		);
	}

	$rootScope.select_history_adempimento = function(adempimento) {
		return $scope.ajax(
			"api/adempimento/find_history.php"
			,{adempimento: adempimento}
			,true
		).then(
			(response) => {
				let dialog = {};
				dialog.clickOutsideToClose = true;
				dialog.title = "Storico adempimento";
				dialog.class = "";
				dialog.content_tmpl = "tmpl/history_adempimento.tmpl.html";
				dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
				dialog.disabledform = true;
				dialog.editableform = false;

				dialog.adempimenti = {righe: response};
				dialog.aziende = $rootScope.aziende;
				dialog.argomenti = $rootScope.argomenti;

				return $scope.alert(dialog).then(
					(answer) => {return Promise.resolve(answer)}
					,(answer) => {return Promise.reject(answer)}
				);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.argomenti_to_adempimenti = function(argomenti, filtri) {
		let adempimenti = [];
		let ar_ids = filtri && filtri.argomenti ? $scope.get_valid_keys(filtri.argomenti) : [];
		if (ar_ids.length > 0) {
			argomenti = [];
			for (let ar = 0; ar < ar_ids.length; ar++) {
				let argomento = $rootScope.argomenti.map[ar_ids[ar]];
				adempimenti = adempimenti.concat(argomento.adempimenti);
			}
			let ad_ids = filtri && filtri.adempimenti ? $scope.get_valid_keys(filtri.adempimenti) : [];
			for (let ad = 0; ad < ad_ids.length; ad++) {
				let adempimento = $filter("get_adempimento")(ad_ids[ad]);
				$scope.push(adempimenti, adempimento);
			}
		} else {
			for (let ar = 0; argomenti && ar < argomenti.length; ar++) {
				let argomento = argomenti[ar];
				adempimenti = adempimenti.concat(argomento.adempimenti);
			}
		}
		return adempimenti;
	}

	$rootScope.report_adempimenti_export_xlsx = function(adempimenti, filtri) {
		adempimenti = adempimenti ? adempimenti : [];
		filtri = filtri ? filtri : {};
		filtri.show = filtri.show ? filtri.show : {
			ch_date: true
			,ch_idazienda: true
			,cr_idargomento: true
			,cr_idadempimento: true
			,cr_idstato: true
		};
		
		let title = "Adempimenti";
		let table = "<thead><tr>";
		if (filtri.show.ch_date) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Data</b></th>";
		if (filtri.show.ch_idazienda) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>ID Azienda</b></th>";
		if (filtri.show.ch_idazienda) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Azienda</b></th>";
		if (filtri.show.cr_idargomento) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>ID Argomento</b></th>";
		if (filtri.show.cr_idargomento) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Argomento</b></th>";
		if (filtri.show.cr_idadempimento) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>ID Adempimento</b></th>";
		if (filtri.show.cr_idadempimento) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Adempimento</b></th>";
		if (filtri.show.cr_idstato) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>ID Stato</b></th>";
		if (filtri.show.cr_idstato) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Stato</b></th>";
		table += "</tr></thead>";
		table +="<tbody>";
		for (let ad = 0; ad < adempimenti.length; ad++) {
			let adempimento = adempimenti[ad];
			table += "<tr>";
			if (filtri.show.ch_date) table += "<td>" + $filter("date")(adempimento.ch_date, "dd/MM/yyyy HH:mm") + "</td>";
			if (filtri.show.ch_idazienda) table += "<td>" + adempimento.ch_idazienda + "</td>";
			if (filtri.show.ch_idazienda) table += "<td>" + $rootScope.aziende.map[adempimento.ch_idazienda].az_descr + "</td>";
			if (filtri.show.cr_idargomento) {
				table += "<td>";
				if (adempimento.cr_idargomento) table += adempimento.cr_idargomento;
				table += "</td>";
				table += "<td>";
				if (adempimento.cr_idargomento) table += $rootScope.argomenti.map[adempimento.cr_idargomento].ar_descr;
				table += "</td>";
			}
			if (filtri.show.cr_idadempimento) {
				table += "<td>";
				if (adempimento.cr_idadempimento) table += adempimento.cr_idadempimento;
				table += "</td>";
				table += "<td>";
				if (adempimento.cr_idadempimento) table += $filter("get_adempimento")(adempimento.cr_idadempimento, adempimento.cr_idargomento).ad_descr;
				table += "</td>";
			}
			if (filtri.show.cr_idstato) {
				table += "<td>";
				if (adempimento.cr_idstato) table += adempimento.cr_idstato;
				table += "</td>";
				table += "<td>";
				if (adempimento.cr_idstato) table += $filter("get_stato")(adempimento.cr_idstato, adempimento.cr_idargomento, adempimento.cr_idadempimento).st_descr;
				table += "</td>";
			}
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
	$rootScope.report_adempimenti_export_pdf = function(adempimenti, filtri) {
		adempimenti = adempimenti ? adempimenti : [];
		filtri = filtri ? filtri : {};
		filtri.show = filtri.show ? filtri.show : {
			ch_date: true
			,ch_idazienda: true
			,cr_idargomento: true
			,cr_idadempimento: true
			,cr_idstato: true
		};

		let righe = [];
		for (let ad = 0; ad < adempimenti.length; ad++) {
			let adempimento = adempimenti[ad];
			righe.push({
				ch_date: adempimento.ch_date
				,ch_idazienda: adempimento.ch_idazienda
				,az_descr: $rootScope.aziende.map[adempimento.ch_idazienda].az_descr
				,cr_idargomento: adempimento.cr_idargomento
				,ar_descr: adempimento.cr_idargomento ? $rootScope.argomenti.map[adempimento.cr_idargomento].ar_descr : undefined
				,cr_idadempimento: adempimento.cr_idadempimento
				,ad_descr: adempimento.cr_idadempimento ? $filter("get_adempimento")(adempimento.cr_idadempimento, adempimento.cr_idargomento).ad_descr : undefined
				,cr_idstato: adempimento.cr_idstato
				,st_descr: adempimento.cr_idstato ? $filter("get_stato")(adempimento.cr_idstato, adempimento.cr_idargomento, adempimento.cr_idadempimento).st_descr : undefined
			});
		}

		return $scope.ajax(
			"api/base/toPdf.php"
			,{
				template: "report_adempimenti.tmpl.html"
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
					name: "Adempimenti" + $filter("date")(new Date(), "_yyyy_MM_dd_HH_mm_ss") + ".pdf"
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

app.filter("get_adempimento", ["$rootScope", function($rootScope) {
	return function(ad_id, ar_id) {
		if (ad_id) {
			let argomenti = ar_id ? [$rootScope.argomenti.map[ar_id]] : $rootScope.argomenti.righe;
			for (let ar = 0; argomenti && ar < argomenti.length; ar++) {
				let argomento = argomenti[ar];
				for (let ad = 0; argomento.adempimenti && ad < argomento.adempimenti.length; ad++) {
					let adempimento = argomento.adempimenti[ad];
					if (adempimento && adempimento.ad_id == ad_id) {
						return adempimento;
					}
				}
			}
		}
		return undefined;
	}
}]);

app.filter("argomenti_to_adempimenti", ["$rootScope", function($rootScope) {return $rootScope.argomenti_to_adempimenti}]);