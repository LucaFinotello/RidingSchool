app.controller("aziende", ["$rootScope", "$scope", "$localStorage", "$filter", function($rootScope, $scope, $localStorage, $filter) {
	$rootScope.aziende = $rootScope.aziende ? $rootScope.aziende : {
		filtri_key: "filtri_aziende"
		,fn_filtri_set_default_filtri_app: function() {
			if ($rootScope.aziende && $rootScope.aziende.filtri) {
				$rootScope.aziende.filtri.sorting				= [{
					property: "az_descr"
					,reverse: false
				}];

				$rootScope.aziende.filtri.search					= undefined;
				$rootScope.aziende.filtri.aziende_tipi				= {};
				$rootScope.aziende.filtri.aziende_tipi_operator		= "AND";

				$rootScope.aziende.filtri.show						= $rootScope.aziende.filtri.show ? $rootScope.aziende.filtri.show : {};
				$rootScope.aziende.filtri.show.az_id				= true;
				$rootScope.aziende.filtri.show.az_descr				= true;
				$rootScope.aziende.filtri.show.az_note				= true;
				$rootScope.aziende.filtri.show.az_note_interne		= true;
				$rootScope.aziende.filtri.show.az_flsocio			= true;
				$rootScope.aziende.filtri.show.az_flcontratto		= true;
				$rootScope.aziende.filtri.show.az_flmondiale		= true;
			}
		}
		,fn_filtri_set_custom_filtri_app: function() {
			if ($rootScope.aziende && $rootScope.aziende.filtri) {
				let filtri_app = $localStorage[$rootScope.aziende.filtri_key];

				if (filtri_app) {
					$rootScope.aziende.filtri.sorting				= filtri_app.sorting					? filtri_app.sorting					: $rootScope.aziende.filtri.sorting;

					$rootScope.aziende.filtri.search				= filtri_app.search						? filtri_app.search						: $rootScope.aziende.filtri.search;
					$rootScope.aziende.filtri.aziende_tipi			= filtri_app.aziende_tipi				? filtri_app.aziende_tipi				: {};
					$rootScope.aziende.filtri.aziende_tipi_operator	= filtri_app.aziende_tipi_operator		? filtri_app.aziende_tipi_operator		: "AND";

					$rootScope.aziende.filtri.show					= $rootScope.aziende.filtri.show		? $rootScope.aziende.filtri.show		: {};
					filtri_app.show									= filtri_app.show						? filtri_app.show						: {};
					$rootScope.aziende.filtri.show.az_id			= !!filtri_app.show.az_id;
					$rootScope.aziende.filtri.show.az_descr			= !!filtri_app.show.az_descr;
					$rootScope.aziende.filtri.show.az_note			= !!filtri_app.show.az_note;
					$rootScope.aziende.filtri.show.az_note_interne	= !!filtri_app.show.az_note_interne;
					$rootScope.aziende.filtri.show.az_flsocio		= !!filtri_app.show.az_flsocio;
					$rootScope.aziende.filtri.show.az_flcontratto	= !!filtri_app.show.az_flcontratto;
					$rootScope.aziende.filtri.show.az_flmondiale	= !!filtri_app.show.az_flmondiale;
				}
			}
		}
		,fn_filtri_filter: function(items, filtri, limit) {
			let filtered = [];

			let at_properties = filtri && filtri.aziende_tipi ? $scope.get_valid_keys(filtri.aziende_tipi) : [];
			at_properties = at_properties.length > 0 ? at_properties : undefined;
			let op = filtri && filtri.aziende_tipi_operator ? filtri.aziende_tipi_operator : "AND";

			for (let i = 0; items && i < items.length && (!limit || (limit && limit > filtered.length)); i++) {
				let item = items[i];

				if (filtri && filtri.search && !$filter("filter")([item], filtri.search).length) continue;
				if (at_properties) {
					let fl_ok = op == "AND";

					for (let at = 0; (op == "AND" ? fl_ok : !fl_ok) && at < at_properties.length; at++) {
						let at_property = at_properties[at];
						let at_values = $scope.get_valid_keys(filtri.aziende_tipi[at_property]);
						
						for (let atv = 0; (op == "AND" ? fl_ok : !fl_ok) && atv < at_values.length; atv++) {
							at_value = at_values[atv];
							fl_ok = item[at_property] == at_value;
						}
					}

					if (op == "AND" && !fl_ok) continue;
					if (op == "OR" && !fl_ok) continue;
				}

				filtered.push(item);
			}

			return filtered;
		}
		,toggle_rubrica: function(rubrica) {
			if (this.rubrica_filtri_aziende	&& this.rubrica_filtri_aziende != rubrica)		this.rubrica_filtri_aziende.fl_open = false;
			if (rubrica) rubrica.fl_open = !rubrica.fl_open;
		}
		,rubrica_filtri_aziende: {
			template: "tmpl/rubrica_filtri_aziende.tmpl.html"
			,model: undefined
			,fl_open: false
			,aziende_tipi: $rootScope.aziende_tipi
			,aziende_tipi_checked: function(azienda_tipo) {
				return $rootScope.aziende.filtri.aziende_tipi[azienda_tipo.at_property] && $rootScope.aziende.filtri.aziende_tipi[azienda_tipo.at_property][azienda_tipo.at_value];
			}
			,aziende_tipi_click: function(azienda_tipo) {
				if ($rootScope.aziende.filtri.aziende_tipi[azienda_tipo.at_property] && $rootScope.aziende.filtri.aziende_tipi[azienda_tipo.at_property][azienda_tipo.at_value]) {
					$rootScope.aziende.filtri.aziende_tipi[azienda_tipo.at_property][azienda_tipo.at_value] = undefined;
					if ($scope.get_valid_keys($rootScope.aziende.filtri.aziende_tipi[azienda_tipo.at_property]).length == 0) {
						$rootScope.aziende.filtri.aziende_tipi[azienda_tipo.at_property] = undefined;
					}
				} else {
					$rootScope.aziende.filtri.aziende_tipi[azienda_tipo.at_property] = $rootScope.aziende.filtri.aziende_tipi[azienda_tipo.at_property] ? $rootScope.aziende.filtri.aziende_tipi[azienda_tipo.at_property] : {};
					$rootScope.aziende.filtri.aziende_tipi[azienda_tipo.at_property][azienda_tipo.at_value] = azienda_tipo.at_descr;
				}
			}
			,aziende_tipi_subhead: function(azienda_tipo) {return azienda_tipo && azienda_tipo.at_descr ? azienda_tipo.at_descr : ""}
			,aziende_tipi_body: undefined
			,aziende_tipi_caption: function(azienda_tipo) {return azienda_tipo && azienda_tipo.at_property ? azienda_tipo.at_property : ""}
		}
	};
	$rootScope.aziende.rubrica_filtri_aziende.model = $rootScope.aziende;

	$rootScope.push_azienda = function(azienda) {
		if (azienda) {
			if (Array.isArray(azienda)) {
				for (let i = 0; i < azienda.length; i++) {
					$rootScope.push_azienda(azienda[i]);
				}
			} else {
				$scope.push($rootScope.aziende.righe, azienda);
				$rootScope.aziende.map[azienda.az_id] = azienda;
			}
		}
	}

	$rootScope.select_aziende = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "AziendaBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.aziende.righe = response;
				$rootScope.aziende.map = {};
				for (let az = 0; az < $rootScope.aziende.righe.length; az++) {
					let azienda = $rootScope.aziende.righe[az];
					$rootScope.aziende.map[azienda.az_id] = azienda;
				}
				return Promise.resolve($rootScope.aziende.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.delete_azienda = function(azienda, fl_ask_confirm) {
		if (azienda) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler eliminare l'azienda?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_azienda(azienda, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/azienda/delete.php"
				,{azienda: azienda}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.aziende.righe, azienda);
					$rootScope.aziende.map[azienda.az_id] = undefined;
					$scope.toast("Circuito eliminato");
					return Promise.resolve(azienda);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"azienda is "
			+ (azienda === undefined ? "undefined" : "")
			+ (azienda === null ? "null" : "")
			+ (azienda === false ? "false" : "")
			+ (azienda === 0 ? "0" : "")
		)
	}

	$rootScope.insert_azienda = function(azienda) {
		return azienda ? $scope.ajax(
			"api/base/save.php"
			,{
				beanName: "AziendaBean"
				,model: azienda
			}
			,true
		).then(
			(response) => {
				azienda.az_id = response[0].az_id;
				$rootScope.push_azienda(azienda);
				$scope.toast("Circuito salvato");
				return Promise.resolve(azienda);
			}
			,(response) => {return Promise.reject(response)}
		) : $rootScope.anagrafica_azienda();
	}

	$rootScope.anagrafica_azienda = function(azienda) {
		let dialog = {};
		dialog.clickOutsideToClose = true;
		dialog.title = "Anagrafica Circuito";
		dialog.class = "dialog-md";
		dialog.content_tmpl = "tmpl/anagrafica_azienda.tmpl.html";
		dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
		dialog.disabledform = false;
		dialog.editableform = true;

		dialog.azienda = azienda ? azienda : {};
		dialog.logged_user = $scope.logged_user;

		dialog.deleteFn = dialog.azienda.az_id ? function(answer, cancelFn) {
			return $rootScope.delete_azienda(answer.azienda, true).then(
				(azienda) => {
					if (cancelFn) {
						cancelFn();
					}
					return Promise.resolve(azienda);
				}
				,(response) => {return Promise.reject(response)}
			);
		} : undefined;

		return $scope.alert(dialog).then(
			(answer) => {return $rootScope.insert_azienda(answer.azienda)}
			,(answer) => {return Promise.reject(answer)}
		);
	}

	$rootScope.report_aziende_export_xlsx = function(aziende, filtri) {
		aziende = aziende ? aziende : [];
		filtri = filtri ? filtri : {};
		filtri.show = filtri.show ? filtri.show : {
			az_id: true
			,az_descr: true
			,az_note: true
			,az_note_interne: true
			,az_flsocio: true
			,az_flcontratto: true
			,az_flmondiale: true
		};
		
		let title = "Circuito";
		let table = "<thead><tr>";
		if (filtri.show.az_descr) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>ID</b></th>";
		if (filtri.show.az_descr) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Azienda</b></th>";
		if (filtri.show.az_note) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Note</b></th>";
		if (filtri.show.az_flsocio) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Socio</b></th>";
		if (filtri.show.az_flcontratto) table += "<th style=\"border-bottom: 3px solid #BBB\"><b>Contratto</b></th>";
		table += "</tr></thead>";
		table +="<tbody>";
		for (let az = 0; az < aziende.length; az++) {
			let azienda = aziende[az];
			table += "<tr>";
			if (filtri.show.az_descr) table += "<td>" + azienda.az_id + "</td>";
			if (filtri.show.az_descr) table += "<td>" + azienda.az_descr + "</td>";
			if (filtri.show.az_note) table += "<td>" + azienda.az_note + "</td>";
			if (filtri.show.az_flsocio) table += "<td>" + (azienda.az_flsocio == "1" ? "SI" : "NO") + "</td>";
			if (filtri.show.az_flcontratto) table += "<td>" + (azienda.az_flcontratto == "1" ? "SI" : "NO") + "</td>";
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
	$rootScope.report_aziende_export_pdf = function(aziende, filtri) {
		aziende = aziende ? aziende : [];
		filtri = filtri ? filtri : {};
		filtri.show = filtri.show ? filtri.show : {
			az_id: true
			,az_descr: true
			,az_note: true
			,az_note_interne: true
			,az_flsocio: true
			,az_flcontratto: true
			,az_flmondiale: true
		};

		let righe = [];
		for (let az = 0; az < aziende.length; az++) {
			let azienda = aziende[az];
			righe.push({
				az_descr: azienda.az_id
				,az_descr: azienda.az_descr
				,az_note: azienda.az_note
				,az_flsocio: azienda.az_flsocio
				,az_flcontratto: azienda.az_flcontratto
				,az_flmondiale: azienda.az_flmondiale
			});
		}

		return $scope.ajax(
			"api/base/toPdf.php"
			,{
				template: "report_aziende.tmpl.html"
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
					name: "Aziende" + $filter("date")(new Date(), "_yyyy_MM_dd_HH_mm_ss") + ".pdf"
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