app.controller("checkups", ["$rootScope", "$scope", "$filter", "$localStorage", function($rootScope, $scope, $filter, $localStorage) {
	$rootScope.checkups = $rootScope.checkups ? $rootScope.checkups : {
		selected: undefined
		,filtri_key: "filtri_checkups"
		,fn_filtri_set_default_filtri_app: function() {
			if ($rootScope.checkups && $rootScope.checkups.filtri) {
				let data_inizio = new Date();
				data_inizio.setHours(0,0,0,0);
				let data_fine = new Date();
				data_fine.setHours(23,59,59,999);

				$rootScope.checkups.filtri.sorting						= [{
					property: "ch_date"
					,reverse: true
				}];

				$rootScope.checkups.filtri.search						= undefined;

				$rootScope.checkups.filtri.fl_data						= true;
				$rootScope.checkups.filtri.data_inizio					= new Date(data_inizio.valueOf());
				$rootScope.checkups.filtri.data_fine					= new Date(data_fine.valueOf());

				$rootScope.checkups.filtri.show							= $rootScope.checkups.filtri.show ? $rootScope.checkups.filtri.show : {};
				$rootScope.checkups.filtri.show.ch_id					= true;
				$rootScope.checkups.filtri.show.ch_idutente				= true;
				$rootScope.checkups.filtri.show.ch_idazienda			= true;
				$rootScope.checkups.filtri.show.ch_date					= true;
				$rootScope.checkups.filtri.show.ch_descr				= true;
				$rootScope.checkups.filtri.show.ch_note					= true;
				$rootScope.checkups.filtri.show.ch_note_interne			= true;
				$rootScope.checkups.filtri.show.ch_note_utente			= true;
			}
		}
		,fn_filtri_set_custom_filtri_app: function() {
			if ($rootScope.checkups && $rootScope.checkups.filtri) {
				let filtri_app = $localStorage[$rootScope.checkups.filtri_key];

				if (filtri_app) {
					$rootScope.checkups.filtri.sorting					= filtri_app.sorting					? filtri_app.sorting								: $rootScope.checkups.filtri.sorting;

					$rootScope.checkups.filtri.search					= filtri_app.search						? filtri_app.search									: $rootScope.checkups.filtri.search;

					$rootScope.checkups.filtri.fl_data					= !!filtri_app.fl_data;
					$rootScope.checkups.filtri.data_inizio				= filtri_app.data_inizio				? new Date(filtri_app.data_inizio.valueOf())		: $rootScope.checkups.filtri.data_inizio;
					$rootScope.checkups.filtri.data_fine				= filtri_app.data_fine					? new Date(filtri_app.data_fine.valueOf())			: $rootScope.checkups.filtri.data_fine;

					$rootScope.checkups.filtri.show						= $rootScope.checkups.filtri.show		? $rootScope.checkups.filtri.show					: {};
					filtri_app.show										= filtri_app.show						? filtri_app.show									: {};
					$rootScope.checkups.filtri.show.ch_id				= !!filtri_app.show.ch_id;
					$rootScope.checkups.filtri.show.ch_idutente			= !!filtri_app.show.ch_idutente;
					$rootScope.checkups.filtri.show.ch_idazienda		= !!filtri_app.show.ch_idazienda;
					$rootScope.checkups.filtri.show.ch_date				= !!filtri_app.show.ch_date;
					$rootScope.checkups.filtri.show.ch_descr			= !!filtri_app.show.ch_descr;
					$rootScope.checkups.filtri.show.ch_note				= !!filtri_app.show.ch_note;
					$rootScope.checkups.filtri.show.ch_note_interne		= !!filtri_app.show.ch_note_interne;
					$rootScope.checkups.filtri.show.ch_note_utente		= !!filtri_app.show.ch_note_utente;
				}
			}
		}
		,fn_filtri_filter: function(items, filtri, limit) {
			let filtered = [];

			let data_inizio	= filtri && filtri.fl_data	&& filtri.data_inizio	? new Date(filtri.data_inizio.valueOf()).toISOString() : undefined;
			let data_fine	= filtri && filtri.fl_data	&& filtri.data_fine		? new Date(filtri.data_fine.valueOf()).toISOString() : undefined;

			for (let i = 0; items && i < items.length && (!limit || (limit && limit > filtered.length)); i++) {
				let item = items[i];
				if ($scope.page() == "scadenziario" && $rootScope.scadenziario.page == "checkups") {
					if ($rootScope.scadenziario.azienda && $rootScope.scadenziario.azienda.az_id != item.ch_idazienda) {
						continue;
					}
				}
				if (data_inizio	&& item.ch_date	< data_inizio) continue;
				if (data_fine	&& item.ch_date	> data_fine) continue;
				if (
					filtri
					&& filtri.search
					&& !$filter("filter")(
						[{
							item: item
							,azienda: $rootScope.aziende.map[item.ch_idazienda]
							,utente: $rootScope.utenti.map[item.ch_idutente]
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
			if (this.rubrica_checkup_argomenti		&& this.rubrica_checkup_argomenti != rubrica)		this.rubrica_checkup_argomenti.fl_open = false;
			if (this.rubrica_filtri_checkups		&& this.rubrica_filtri_checkups != rubrica)			this.rubrica_filtri_checkups.fl_open = false;
			if (rubrica) rubrica.fl_open = !rubrica.fl_open;
		}
		,rubrica_checkup_argomenti: {
			template: "tmpl/rubrica_checkup_argomenti.tmpl.html"
			,model: undefined
			,fl_open: false
			,deselect: function() {$rootScope.checkups.selected.filtri.argomenti = {}}
			,search: undefined
			,checked: function(item) {return item && $rootScope.checkups.selected && $rootScope.checkups.selected.filtri.argomenti[item.ar_id] !== undefined}
			,click: function(item) {$rootScope.checkups.selected.filtri.argomenti[item.ar_id] = $rootScope.checkups.selected.filtri.argomenti[item.ar_id] !== undefined ? undefined : item.ar_descr}
		}
		,rubrica_filtri_checkups: {
			template: "tmpl/rubrica_filtri_checkups.tmpl.html"
			,model: undefined
			,fl_open: false
		}
	};
	$rootScope.checkups.rubrica_filtri_checkups.model = $rootScope.checkups;


	$rootScope.select_checkups = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "CheckupBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.checkups.righe = response;
				$rootScope.checkups.map = {};
				for (let ch = 0; ch < $rootScope.checkups.righe.length; ch++) {
					let checkup = $rootScope.checkups.righe[ch];
					$rootScope.checkups.map[checkup.ch_id] = checkup;
				}
				return Promise.resolve($rootScope.checkups.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	/**
	 * metodo stupido ma importante.
	 * a quanto pare ad angular non piace copiare gli scope da in giro.
	 * quindi questo metodo va chiamato quando il checkup viene chiamato da una parte e dall'altra tipo:
	 * - completo una insert dall'anagrafica checkup e torno all'elenco.
	 * - lascio in sospeso l'anagrafica checkup e torno all'elenco.
	 * - annullo l'anagrafica checkup e torno all'elenco.
	 */
	$rootScope.clean_checkup_scopes = function(checkup) {
		if (checkup) {
			checkup.filtri_app_scope = undefined;
		}
	}

	$rootScope.insert_checkup = function(checkup) {
		if (checkup) {
			checkup.azienda = $rootScope.aziende.map[checkup.ch_idazienda];
			checkup.utente = $rootScope.utenti.map[checkup.ch_idutente];
			return $scope.ajax(
				"api/checkup/save.php"
				,{checkup: checkup}
				,true
			).then(
				(response) => {
					checkup.ch_id = response[0].ch_id;
					checkup.righe = response[0].righe; // questa riga esiste perchè mi servono i loro cr_id valorizzati...
					$scope.push($rootScope.checkups.righe, checkup);
					$rootScope.checkups.map[checkup.ch_id] = checkup;

					$rootScope.push_allegato(response[0].allegati);
					$rootScope.push_allegato_utente(response[0].allegati_utenti);
					$rootScope.push_allegato_azienda(response[0].allegati_aziende);
					$rootScope.push_allegato_dipendente(response[0].allegati_dipendenti);
					$rootScope.push_allegato_checkup(response[0].allegati_checkups);
					$rootScope.push_allegato_checkup_riga(response[0].allegati_checkups_righe);

					return $rootScope.cancel_checkup(checkup, false).then(
						(checkup) => {
							$scope.toast("Checkup salvato");
							return Promise.resolve(checkup);
						}
						,(no) => {return Promise.reject(no)}
					)
				}
				,(response) => {return Promise.reject(response)}
			)
			return $rootScope.anagrafica_checkup(checkup, !$rootScope.utente_is_utente($scope.logged_user), $rootScope.utente_is_utente($scope.logged_user));
		}
		/* $rootScope.anagrafica_checkup(checkup, !$rootScope.utente_is_utente($scope.logged_user), $rootScope.utente_is_utente($scope.logged_user));*/
	}

	$rootScope.checkup_to_pdf = function(checkup) {
		if (checkup) {
			return $scope.ajax(
				"api/checkup/toPdf.php"
				,{checkup: checkup}
				,true
			).then(
				(response) => {
					return $scope.download_file_by_base64(response.base64, response.filename, response.type, true);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
	}

	$rootScope.delete_checkup = function(checkup, fl_ask_confirm) {
		if (checkup) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler eliminare il checkup?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_checkup(checkup, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/checkup/delete.php"
				,{checkup: checkup}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.checkups.righe, checkup);
					$rootScope.checkups.map[checkup.ch_id] = undefined;
					if (checkup == $rootScope.checkups.selected) {
						$rootScope.checkups.selected = undefined;
						if ($scope.page() == "scadenziario" && $rootScope.scadenziario && $rootScope.scadenziario.page == "checkup") {
							$rootScope.scadenziario.page = "checkups";
						}
					}
					$scope.toast("Checkup eliminato");
					return Promise.resolve(checkup);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"checkup is "
			+ (checkup === undefined ? "undefined" : "")
			+ (checkup === null ? "null" : "")
			+ (checkup === false ? "false" : "")
			+ (checkup === 0 ? "0" : "")
		)
	}

	$rootScope.cancel_checkup = function(checkup, fl_ask_confirm) {
		if (checkup) {
			if (fl_ask_confirm) {
				return $scope.alert_confirm("Sicuro di voler annullare le modifiche?", "SI", "NO").then(
					(yes) => {return $rootScope.cancel_checkup(checkup, false)}
					,(no) => {return Promise.reject(no)}
				);
			} else {
				$rootScope.clean_checkup_scopes(checkup);
				checkup.filtri_key = undefined;
				checkup.fn_filtri_set_default_filtri_app = undefined;
				checkup.fn_filtri_set_custom_filtri_app = undefined;
				checkup.fn_filtri_filter = undefined;
				if ($scope.page() == "scadenziario" && $rootScope.scadenziario) {
					if ($rootScope.checkups.selected == checkup) {
						$rootScope.checkups.selected = undefined;
					}
					$rootScope.scadenziario.page = "checkups";
				}
				return Promise.resolve(checkup);
			}
		}
		return Promise.reject("checkup is null");
	}

	$rootScope.anagrafica_checkup = function(checkup, disabledform, editableform) {
		if ($scope.page() == "scadenziario" && $rootScope.scadenziario) {
			checkup = checkup ? checkup : {};
			if ($rootScope.checkups.selected && !$rootScope.checkups.selected.disabledform && $rootScope.checkups.selected != checkup) {
				return $rootScope.cancel_checkup($rootScope.checkups.selected, true).then(
					() => {return $rootScope.anagrafica_checkup(checkup, disabledform, editableform)}
					,(no) => {return Promise.reject(no)}
				)
			}

			checkup.disabledform = disabledform === undefined ? false : !!disabledform;
			checkup.editableform = editableform === undefined ? true : !!editableform;

			if (!checkup.ch_id && !checkup.disabledform && checkup.editableform) {
				if ($rootScope.scadenziario.azienda) {
					checkup.ch_idazienda = checkup.ch_idazienda ? checkup.ch_idazienda : $rootScope.scadenziario.azienda.az_id;
					checkup.azienda = checkup.azienda ? checkup.azienda : $rootScope.aziende.map[checkup.ch_idazienda];
					checkup.ch_idutente = checkup.ch_idutente ? checkup.ch_idutente : $scope.logged_user.username;
					checkup.utente = checkup.utente ? checkup.utente : $rootScope.utenti.map[checkup.ch_idutente];
					checkup.ch_date = checkup.ch_date ? new Date(checkup.ch_date.valueOf()) : new Date();
					checkup.ch_date.setSeconds(0, 0);
					checkup.ch_date = checkup.ch_date.toISOString();

					let prev_checkup = {rige: []};
					let prev_checkups = $filter("orderBy")($filter("filter")($rootScope.checkups.righe, {ch_idazienda: checkup.ch_idazienda}), ["-ch_date"]);
					if (prev_checkups && prev_checkups.length > 0) {
						prev_checkup = prev_checkups[0];

						checkup.ch_note = prev_checkup.ch_note;
						checkup.ch_note_interne = prev_checkup.ch_note_interne;
						if (checkup.ch_idutente == prev_checkup.ch_idutente) {
							checkup.ch_note_tecniche = prev_checkup.ch_note_tecniche;
						}
					}

					checkup.righe = [];
					let argomenti = $filter("in")($rootScope.argomenti.righe, {az_id: checkup.ch_idazienda}, $rootScope.argomento_in_azienda);
					for (let ar = 0; ar < argomenti.length; ar++) {
						let argomento = argomenti[ar];
						for (let ad = 0; argomento.adempimenti && ad < argomento.adempimenti.length; ad++) {
							let adempimento = argomento.adempimenti[ad];
							let checkup_riga = {
								cr_idcheckup: checkup.ch_id
								,cr_idadempimento: adempimento.ad_id
								,cr_idargomento: argomento.ar_id
								,sanzioni: []
								,servizi: []
								,allegati: []
							};
							for (let cr = 0; prev_checkup && cr < prev_checkup.righe.length; cr++) {
								let prev_checkup_riga = prev_checkup.righe[cr];
								// si spera che non esistano righe con lo stesso adempimento... #utontoPower
								if (checkup_riga.cr_idadempimento == prev_checkup_riga.cr_idadempimento) {
									checkup_riga.cr_idstato = prev_checkup_riga.cr_idstato;
									checkup_riga.cr_note = prev_checkup_riga.cr_note;
									checkup_riga.cr_note_interne = prev_checkup_riga.cr_note_interne;
									checkup_riga.cr_note_utente = prev_checkup_riga.cr_note_utente;
									checkup_riga.allegati = $filter("allegati_visibili")($rootScope.allegati.righe, undefined, undefined, undefined, prev_checkup.ch_id, prev_checkup_riga.cr_id);
									for (let sa = 0; prev_checkup_riga.sanzioni && sa < prev_checkup_riga.sanzioni.length; sa++) {
										let sanzione = prev_checkup_riga.sanzioni[sa];
										checkup_riga.sanzioni.push({
											crs_idsanzione: sanzione.crs_idsanzione
											,crs_descr: sanzione.crs_descr
											,crs_note: sanzione.crs_note
											,crs_note_interne: sanzione.crs_note_interne
											,crs_note_utente: sanzione.crs_note_utente
										});
									}
									for (let se = 0; prev_checkup_riga.servizi && se < prev_checkup_riga.servizi.length; se++) {
										let servizio = prev_checkup_riga.servizi[se];
										checkup_riga.servizi.push({
											/* TODO */
										});
									}
									break;
								}
							}
							checkup.righe.push(checkup_riga);
						}
					}
				} else {
					return $scope.alert_warning("azienda is null");
				}
			} else {
				for (let cr = 0; cr < checkup.righe.length; cr++) {
					let checkup_riga = checkup.righe[cr];
					checkup_riga.allegati = $filter("allegati_visibili")($rootScope.allegati.righe, undefined, undefined, undefined, checkup.ch_id, checkup_riga.cr_id);
				}
			}

			checkup.date = new Date(checkup.ch_date.valueOf());
			checkup.argomenti = {righe: $filter("checkup_righe_to_argomenti")(checkup.righe)};
			$rootScope.checkups.rubrica_checkup_argomenti.model = checkup;
			
			if (checkup.filtri) {
				checkup.filtri.argomenti = {};
			}

			checkup.filtri_key = "filtri_checkup";
			checkup.fn_filtri_set_default_filtri_app = function() {
				if (this.filtri) {
					this.filtri.sorting = [{
						property: "cr_idargomento"
						,reverse: false
					}, {
						property: "cr_idadempimento"
						,reverse: false
					}];

					this.filtri.search = undefined;
					this.filtri.fl_show_ok = true;
					this.filtri.argomenti = {};

					this.filtri.show						= this.filtri.show ? this.filtri.show : {};
					this.filtri.show.cr_id					= true;
					this.filtri.show.cr_idcheckup			= true;
					this.filtri.show.cr_idadempimento		= true;
					this.filtri.show.cr_idargomento			= true;
					this.filtri.show.cr_idstato				= true;
					this.filtri.show.cr_note				= true;
					this.filtri.show.cr_note_interne		= true;
					this.filtri.show.cr_note_utente			= true;
					this.filtri.show.cr_note				= true;
					this.filtri.show.sanzioni				= true;
					this.filtri.show.allegati				= true;
					this.filtri.show.servizi				= true;
				}
			};
			checkup.fn_filtri_set_custom_filtri_app = function() {
				if (this.filtri) {
					let filtri_app = $localStorage[this.filtri_key];

					if (filtri_app) {
						this.filtri.sorting					= filtri_app.sorting					? filtri_app.sorting		: this.filtri.sorting;

						this.filtri.search					= filtri_app.search						? filtri_app.search			: this.filtri.search;
						this.filtri.fl_show_ok				= filtri_app.fl_show_ok					? !!filtri_app.fl_show_ok	: !!this.filtri.fl_show_ok;
						this.filtri.argomenti				= filtri_app.argomenti					? filtri_app.argomenti		: this.filtri.argomenti;

						this.filtri.show					= this.filtri.show						? this.filtri.show			: {};
						filtri_app.show						= filtri_app.show						? filtri_app.show			: {};
						this.filtri.show.cr_id				= !!filtri_app.show.cr_id;
						this.filtri.show.cr_idcheckup		= !!filtri_app.show.cr_idcheckup;
						this.filtri.show.cr_idadempimento	= !!filtri_app.show.cr_idadempimento;
						this.filtri.show.cr_idargomento		= !!filtri_app.show.cr_idargomento;
						this.filtri.show.cr_idstato			= !!filtri_app.show.cr_idstato;
						this.filtri.show.cr_note			= !!filtri_app.show.cr_note;
						this.filtri.show.cr_note_interne	= !!filtri_app.show.cr_note_interne;
						this.filtri.show.cr_note_utente		= !!filtri_app.show.cr_note_utente;
						this.filtri.show.cr_note			= !!filtri_app.show.cr_note;
						this.filtri.show.sanzioni			= !!filtri_app.show.sanzioni;
						this.filtri.show.allegati			= !!filtri_app.show.allegati;
						this.filtri.show.servizi			= !!filtri_app.show.servizi;
					}
				}
			};
			checkup.fn_filtri_filter = function(items, filtri, limit) {
				let filtered = [];
	
				for (let i = 0; items && i < items.length && (!limit || (limit && limit > filtered.length)); i++) {
					let item = items[i];
					if (filtri && filtri.argomenti && $scope.get_valid_keys(filtri.argomenti).length > 0 && !filtri.argomenti[item.cr_idargomento]) continue;
					if (filtri && !filtri.fl_show_ok && $filter("checkup_riga_ok")(item)) continue;
					if (
						filtri
						&& filtri.search
						&& !$filter("filter")(
							[{
								item: item
								,argomento: $rootScope.argomenti.map[item.cr_idargomento]
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

			$rootScope.checkups.selected = checkup;
			$rootScope.checkups.toggle_rubrica();
			$rootScope.checkups.toggle_rubrica($rootScope.checkups.rubrica_checkup_argomenti);

			$rootScope.scadenziario.page = "checkup";
			return Promise.resolve($rootScope.checkups.selected);
		}

		let dialog = {};
		dialog.clickOutsideToClose = true;
		dialog.title = "Anagrafica checkup";
		dialog.class = "";
		dialog.content_tmpl = "tmpl/anagrafica_checkup.tmpl.html";
		dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
		dialog.disabledform = disabledform === undefined ? false : !!disabledform;
		dialog.editableform = editableform === undefined ? true : !!editableform;

		dialog.checkup = checkup ? checkup : {};

		dialog.deleteFn = dialog.checkup.ch_id ? function(answer, cancelFn) {
			return $rootScope.delete_checkup(answer.checkup, true).then(
				(checkup) => {
					if (cancelFn) {
						cancelFn();
					}
					return Promise.resolve(checkup);
				}
				,(response) => {return Promise.reject(response)}
			);
		} : undefined;

		return $scope.alert(dialog).then(
			(answer) => {return $rootScope.insert_checkup(answer.checkup)}
			,(answer) => {return Promise.reject(answer)}
		);
	}

	$rootScope.delete_checkup_riga = function(checkup_riga, fl_ask_confirm, checkup) {
		if (checkup_riga) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler eliminare la riga?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_checkup_riga(checkup_riga, false, checkup)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/checkup_riga/delete.php"
				,{checkup_riga: checkup_riga}
				,true
			).then(
				(response) => {
					$scope.splice(checkup ? checkup.righe : undefined, checkup_riga);
					$scope.toast("Riga eliminata");
					return Promise.resolve(checkup_riga);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"checkup_riga is "
			+ (checkup_riga === undefined ? "undefined" : "")
			+ (checkup_riga === null ? "null" : "")
			+ (checkup_riga === false ? "false" : "")
			+ (checkup_riga === 0 ? "0" : "")
		)
	}

	$rootScope.anagrafica_checkup_riga = function(checkup_riga, disabledform, editableform, checkup) {
		let dialog = {};
		dialog.clickOutsideToClose = true;
		dialog.title = "Anagrafica riga checkup";
		dialog.class = "dialog-xl";
		dialog.content_tmpl = "tmpl/anagrafica_checkup_riga.tmpl.html";
		dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
		dialog.disabledform = disabledform === undefined ? false : !!disabledform;
		dialog.editableform = editableform === undefined ? true : !!editableform;

		dialog.logged_user = $scope.logged_user;
		dialog.checkup = checkup;
		dialog.checkup_riga = checkup_riga ? checkup_riga : {};

		dialog.checkup_riga.argomento = $rootScope.argomenti.map[dialog.checkup_riga.cr_idargomento];
		dialog.checkup_riga.adempimento = $filter("get_adempimento")(dialog.checkup_riga.cr_idadempimento, dialog.checkup_riga.cr_idargomento);
		dialog.checkup_riga.stato = $filter("get_stato")(dialog.checkup_riga.cr_idstato, dialog.checkup_riga.cr_idargomento, dialog.checkup_riga.cr_idadempimento);
		dialog.checkup_riga.sanzioni = dialog.checkup_riga.sanzioni ? dialog.checkup_riga.sanzioni : [];
		for (let sa = 0; sa < dialog.checkup_riga.sanzioni.length; sa++) {
			let checkup_riga_sanzione = dialog.checkup_riga.sanzioni[sa];
			checkup_riga_sanzione.sanzione = $filter("get_sanzione")(checkup_riga_sanzione.crs_idsanzione, dialog.checkup_riga.cr_idargomento, dialog.checkup_riga.cr_idadempimento, dialog.checkup_riga.cr_idstato)
		}
		dialog.checkup_riga.servizi = dialog.checkup_riga.servizi ? dialog.checkup_riga.servizi : [];

		dialog.argomenti = checkup ? checkup.argomenti : $rootScope.argomenti;

		dialog.splice = $scope.splice;
		dialog.download_file = $scope.download_file;
		dialog.download_file_by_base64 = $scope.download_file_by_base64;
		dialog.click_element_by_id = $scope.click_element_by_id;

		dialog.adempimento_in_checkup = function(checkup_righe, adempimento) {
			for (let cr = 0; adempimento && checkup_righe && cr < checkup_righe.length; cr++) {
				let checkup_riga = checkup_righe[cr];
				if (checkup_riga.cr_idadempimento == adempimento.ad_id) {
					return true;
				}
			}
			return false;
		}

		dialog.push_allegato = function(file, element, data) {
			if (file && data && data.checkup_riga) {
				data.checkup_riga.allegati.push({
					al_descr: file.name
					,al_path : "../../file/allegati/" + $scope.logged_user.username + "_" + new Date().valueOf()
					,al_type: file.type
					,al_size: file.size
					,al_date: new Date().toISOString()
					,blob_base64: file.blob_base64
				});
			}
				
			if (element && element.length > 0) {
				element[0].value = null;
			}
		};

		dialog.remove_allegato = function(allegato) {
			let dialog = this;
			return allegato ? $rootScope.delete_allegato_visibilita({
				av_idallegato: allegato.al_id
				,av_idcheckup: dialog.checkup.ch_id
				,av_idcheckup_riga: dialog.checkup_riga.cr_id
			}, true).then(
				(response) => {
					$scope.splice(dialog.checkup_riga.allegati, allegato);
					return Promise.resolve(response);
				}
				,(response) => {return Promise.reject(response)}
			) : Promise.reject("allegato is null");
		}

		dialog.deleteFn = function(answer, cancelFn) {
			return $rootScope.delete_checkup_riga(answer.checkup_riga, true, answer.checkup).then(
				(checkup_riga) => {
					if (cancelFn) {
						cancelFn();
					}
					return Promise.resolve(checkup_riga);
				}
				,(response) => {return Promise.reject(response)}
			);
		};

		return $scope.alert(dialog).then(
			(answer) => {return $scope.page() == "scadenziario" && $rootScope.scadenziario.page == "checkup" ? Promise.resolve(answer.checkup_riga) : $rootScope.insert_checkup_riga(answer.checkup_riga)}
			,(answer) => {return Promise.reject(answer)}
		);
	}

	$rootScope.select_agende = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "CheckupBean"
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
			"api/checkup/save.php"
			,{
				beanName: "CheckupBean"
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
				"api/checkup/delete.php"
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

app.filter("checkup_ok", ["$filter", function($filter) {
	return function(checkup) {
		if (!checkup) return false;
		if (!checkup.ch_idazienda) return false;
		if (!checkup.ch_idutente) return false;
		if (!checkup.ch_date) return false;
		if (!$filter("checkup_righe_ok")(checkup.righe)) return false;
		return true;
	}
}]);
app.filter("checkup_righe_ok", ["$filter", function($filter) {
	return function(checkup_righe) {
		for (let cr = 0; checkup_righe && cr < checkup_righe.length; cr++) {
			let checkup_riga = checkup_righe[cr];
			if (!$filter("checkup_riga_ok")(checkup_riga)) {
				return false;
			}
		}
		return true;
	}
}]);
app.filter("checkup_riga_ok", [function() {
	return function(checkup_riga) {
		if (!checkup_riga) return false;
		if (!checkup_riga.cr_idargomento) return false;
		if (!checkup_riga.cr_idadempimento) return false;
		if (!checkup_riga.cr_idstato) return false;
		return true;
	}
}]);

app.filter("checkup_righe_to_argomenti", ["$rootScope", function($rootScope) {
	return function(checkup_righe) {
		let argomenti = [];
		for (let cr = 0; checkup_righe && cr < checkup_righe.length; cr++) {
			let checkup_riga = checkup_righe[cr];
			let argomento = $rootScope.argomenti.map[checkup_riga.cr_idargomento];
			if (argomento && argomenti.indexOf(argomento) == -1) {
				argomenti.push(argomento);
			}
		}
		return argomenti;
	}
}]);