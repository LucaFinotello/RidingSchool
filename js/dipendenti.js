app.controller("dipendenti", ["$rootScope", "$scope", "$localStorage", "$filter", function($rootScope, $scope, $localStorage, $filter) {
	$rootScope.dipendenti = $rootScope.dipendenti ? $rootScope.dipendenti : {
		filtri_key: "filtri_dipendenti"
		,fn_filtri_set_default_filtri_app: function() {
			if ($rootScope.dipendenti && $rootScope.dipendenti.filtri) {
				$rootScope.dipendenti.filtri.sorting					= [{
					property: "di_descr"
					,reverse: false
				}];

				$rootScope.dipendenti.filtri.search						= undefined;
				$rootScope.dipendenti.filtri.aziende					= {};

				$rootScope.dipendenti.filtri.show						= $rootScope.dipendenti.filtri.show ? $rootScope.dipendenti.filtri.show : {};
				$rootScope.dipendenti.filtri.show.di_id					= true;
				$rootScope.dipendenti.filtri.show.di_idazienda			= true;
				$rootScope.dipendenti.filtri.show.di_descr				= true;
				$rootScope.dipendenti.filtri.show.di_note				= true;
				$rootScope.dipendenti.filtri.show.di_note_interne		= true;
			}
		}
		,fn_filtri_set_custom_filtri_app: function() {
			if ($rootScope.dipendenti && $rootScope.dipendenti.filtri) {
				let filtri_app = $localStorage[$rootScope.dipendenti.filtri_key];

				if (filtri_app) {
					$rootScope.dipendenti.filtri.sorting				= filtri_app.sorting					? filtri_app.sorting					: $rootScope.dipendenti.filtri.sorting;
					$rootScope.dipendenti.filtri.search					= filtri_app.search						? filtri_app.search						: $rootScope.dipendenti.filtri.search;
					$rootScope.dipendenti.filtri.aziende				= filtri_app.dipendenti					? filtri_app.dipendenti					: $rootScope.dipendenti.filtri.aziende;
					$rootScope.dipendenti.filtri.show					= $rootScope.dipendenti.filtri.show		? $rootScope.dipendenti.filtri.show		: {};
					filtri_app.show										= filtri_app.show						? filtri_app.show						: {};
					$rootScope.dipendenti.filtri.show.di_id				= !!filtri_app.show.di_id;
					$rootScope.dipendenti.filtri.show.di_idazienda		= !!filtri_app.show.di_idazienda;
					$rootScope.dipendenti.filtri.show.di_descr			= !!filtri_app.show.di_descr;
					$rootScope.dipendenti.filtri.show.di_note			= !!filtri_app.show.di_note;
					$rootScope.dipendenti.filtri.show.di_note_interne	= !!filtri_app.show.di_note_interne;
				}
			}
		}
		,fn_filtri_filter: function(items, filtri, limit) {
			let filtered = [];

			for (let i = 0; items && i < items.length && (!limit || (limit && limit > filtered.length)); i++) {
				let item = items[i];

				if (filtri.aziende && $scope.get_valid_keys(filtri.aziende).length > 0 && filtri.aziende[item.di_idazienda] === undefined) continue;

				if (
					filtri
					&& filtri.search
					&& !$filter("filter")(
						[{
							item: item
							,azienda: $rootScope.dipendenti.map[item.di_idazienda]
						}]
						,filtri.search
					).length
				) {
					continue;
				}

				filtered.push(item);
			}

			return filtered;
		}
		,toggle_rubrica: function(rubrica) {
			if (this.rubrica_aziende			&& this.rubrica_aziende != rubrica)					this.rubrica_aziende.fl_open = false;
			if (this.rubrica_filtri_dipendenti	&& this.rubrica_filtri_dipendenti != rubrica)		this.rubrica_filtri_dipendenti.fl_open = false;
			if (rubrica) rubrica.fl_open = !rubrica.fl_open;
		}
		,rubrica_aziende: {
			template: "tmpl/rubrica_default.tmpl.html"
			,model: $rootScope.aziende
			,order_by: ["az_descr"]
			,fl_open: false
			,deselect: function() {$rootScope.dipendenti.filtri.aziende = {}}
			,search: undefined
			,checked: function(item) {return item && $rootScope.dipendenti.filtri.aziende[item.az_id] !== undefined}
			,click: function(item) {$rootScope.dipendenti.filtri.aziende[item.az_id] = $rootScope.dipendenti.filtri.aziende[item.az_id] !== undefined ? undefined : item.az_descr}
			,subhead: function(item) {return item.az_descr}
			,body: undefined
			,caption: function(item) {return item.az_id}
			,lines: 2
			,custom_filter_fn: function(item) {
				return $rootScope.utente_is_utente($scope.logged_user) || $scope.logged_user.idazienda == item.az_id;
			}
		}
		,rubrica_filtri_dipendenti: {
			template: "tmpl/rubrica_filtri_dipendenti.tmpl.html"
			,model: undefined
			,fl_open: false
		}
	};
	$rootScope.dipendenti.rubrica_filtri_dipendenti.model = $rootScope.dipendenti;

	$rootScope.push_dipendente = function(dipendente) {
		if (dipendente) {
			if (Array.isArray(dipendente)) {
				for (let i = 0; i < dipendente.length; i++) {
					$rootScope.push_dipendente(dipendente[i]);
				}
			} else {
				$scope.push($rootScope.dipendenti.righe, dipendente);
				$rootScope.dipendenti.map[dipendente.di_id] = dipendente;
			}
		}
	}

	$rootScope.select_dipendenti = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "DipendenteBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.dipendenti.righe = response;
				$rootScope.dipendenti.map = {};
				for (let di = 0; di < $rootScope.dipendenti.righe.length; di++) {
					let dipendente = $rootScope.dipendenti.righe[di];
					$rootScope.dipendenti.map[dipendente.di_id] = dipendente;
				}
				return Promise.resolve($rootScope.dipendenti.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.delete_dipendente = function(dipendente, fl_ask_confirm) {
		if (dipendente) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler eliminare il dipendente?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_dipendente(dipendente, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/dipendente/delete.php"
				,{dipendente: dipendente}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.dipendenti.righe, dipendente);
					$rootScope.dipendenti.map[dipendente.di_id] = undefined;
					$scope.toast("Corso eliminato");
					return Promise.resolve(dipendente);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"dipendente is "
			+ (dipendente === undefined ? "undefined" : "")
			+ (dipendente === null ? "null" : "")
			+ (dipendente === false ? "false" : "")
			+ (dipendente === 0 ? "0" : "")
		)
	}

	$rootScope.insert_dipendente = function(dipendente) {
		return dipendente ? $scope.ajax(
			"api/dipendente/save.php"
			,{dipendente: dipendente}
			,true
		).then(
			(response) => {
				dipendente.di_id = response[0].di_id;
				$rootScope.push_dipendente(dipendente);
				for (let ut = 0; ut < $rootScope.utenti.righe.length; ut++) {
					let utente = $rootScope.utenti.righe[ut];
					if (utente.iddipendente == dipendente.di_id) {
						utente.idazienda = dipendente.di_idazienda;
					}
				}
				$scope.toast("Corso salvato");
				return Promise.resolve(dipendente);
			}
			,(response) => {return Promise.reject(response)}
		) : $rootScope.anagrafica_dipendente();
	}

	$rootScope.anagrafica_dipendente = function(dipendente) {
		let dialog = {};
		dialog.clickOutsideToClose = true;
		dialog.title = "Anagrafica Corso";
		dialog.class = "dialog-md";
		dialog.content_tmpl = "tmpl/anagrafica_dipendente.tmpl.html";
		dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
		dialog.disabledform = false;
		dialog.editableform = true;

		dipendente = dipendente ? dipendente : {};
		dialog.dipendente = dipendente;
		dipendente.azienda = dipendente.di_idazienda ? $rootScope.aziende.map[dipendente.di_idazienda] : undefined;
		dialog.logged_user = $scope.logged_user;

		dialog.aziende = $rootScope.aziende;

		dialog.deleteFn = dipendente.di_id ? function(answer, cancelFn) {
			return $rootScope.delete_dipendente(answer.dipendente, true).then(
				(dipendente) => {
					if (cancelFn) {
						cancelFn();
					}
					return Promise.resolve(dipendente);
				}
				,(response) => {return Promise.reject(response)}
			);
		} : undefined;

		return $scope.alert(dialog).then(
			(answer) => {return $rootScope.insert_dipendente(answer.dipendente)}
			,(answer) => {return Promise.reject(answer)}
		);
	}

	$rootScope.report_dipendenti_export_xlsx = function(dipendenti, filtri) {
		dipendenti = dipendenti ? dipendenti : [];
		filtri = filtri ? filtri : {};
		filtri.show = filtri.show ? filtri.show : {
			di_id: true
			,di_idazienda: true
			,di_descr: true
			,di_note: true
			,di_note_interne: true
		};
		
		let title = "Corsi";
		let table = "<thead><tr>";
		if (filtri.show.di_idazienda) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>ID Azienda</b></th>";
		if (filtri.show.di_idazienda) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Azienda</b></th>";
		if (filtri.show.di_descr) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>ID Dipendente</b></th>";
		if (filtri.show.di_descr) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Dipendente</b></th>";
		if (filtri.show.di_note) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Note</b></th>";
		table += "</tr></thead>";
		table +="<tbody>";
		for (let di = 0; di < dipendenti.length; di++) {
			let dipendente = dipendenti[di];
			table += "<tr>";
			if (filtri.show.di_idazienda) table += "<td>" + (dipendente.di_idazienda ? dipendente.di_idazienda : "") + "</td>";
			if (filtri.show.di_idazienda) table += "<td>" + (dipendente.di_idazienda ? $rootScope.aziende.map[dipendente.di_idazienda].az_descr : "") + "</td>";
			if (filtri.show.di_descr) table += "<td>" + dipendente.di_id + "</td>";
			if (filtri.show.di_descr) table += "<td>" + dipendente.di_descr + "</td>";
			if (filtri.show.di_note) table += "<td>" + dipendente.di_note + "</td>";
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
			// sfrutto la variabile file per non riscaricare l'allegato appena caricato
			(allegato) => {return $scope.download_file_by_base64(file.blob_base64, file.name, file.type, true)}
			,(response) => {return Promise.resolve(response)}
		);
	}
	$rootScope.report_dipendenti_export_pdf = function(dipendenti, filtri) {
		dipendenti = dipendenti ? dipendenti : [];
		filtri = filtri ? filtri : {};
		filtri.show = filtri.show ? filtri.show : {
			di_id: true
			,di_idazienda: true
			,di_descr: true
			,di_note: true
			,di_note_interne: true
		};

		let righe = [];
		for (let di = 0; di < dipendenti.length; di++) {
			let dipendente = dipendenti[di];
			righe.push({
				di_id: dipendente.di_id
				,di_idazienda: dipendente.di_idazienda
				,az_descr: $rootScope.aziende.map[dipendente.di_idazienda] ? $rootScope.aziende.map[dipendente.di_idazienda].az_descr : ""
				,di_descr: dipendente.di_id
				,di_descr: dipendente.di_descr
				,di_note: dipendente.di_note
			});
		}

		return $scope.ajax(
			"api/base/toPdf.php"
			,{
				template: "report_dipendenti.tmpl.html"
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
					name: "Dipendenti" + $filter("date")(new Date(), "_yyyy_MM_dd_HH_mm_ss") + ".pdf"
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