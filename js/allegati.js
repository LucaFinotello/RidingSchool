app.controller("allegati", ["$rootScope", "$scope", "$localStorage", "$filter", function($rootScope, $scope, $localStorage, $filter) {
	$rootScope.allegati = $rootScope.allegati ? $rootScope.allegati : {
		filtri_key: "filtri_allegati"
		,fn_filtri_set_default_filtri_app: function() {
			if ($rootScope.allegati && $rootScope.allegati.filtri) {
				let data_inizio = new Date();
				data_inizio.setHours(0,0,0,0);
				let data_fine = new Date();
				data_fine.setHours(23,59,59,999);

				$rootScope.allegati.filtri.sorting					= [{
					property: "al_date"
					,reverse: true
				}];

				$rootScope.allegati.filtri.search					= undefined;
				$rootScope.allegati.filtri.utenti					= {};
				$rootScope.allegati.filtri.aziende					= {};
				$rootScope.allegati.filtri.dipendenti				= {};
				$rootScope.allegati.filtri.checkups					= {};

				$rootScope.allegati.filtri.fl_data					= true;
				$rootScope.allegati.filtri.data_inizio				= new Date(data_inizio.valueOf());
				$rootScope.allegati.filtri.data_fine				= new Date(data_fine.valueOf());

				$rootScope.allegati.filtri.show						= $rootScope.allegati.filtri.show ? $rootScope.allegati.filtri.show : {};
				$rootScope.allegati.filtri.show.al_id				= true;
				$rootScope.allegati.filtri.show.al_descr			= true;
				$rootScope.allegati.filtri.show.al_path				= true;
				$rootScope.allegati.filtri.show.al_type				= true;
				$rootScope.allegati.filtri.show.al_size				= true;
				$rootScope.allegati.filtri.show.al_date				= true;
				$rootScope.allegati.filtri.show.al_note				= true;
				$rootScope.allegati.filtri.show.al_note_interne		= true;
			}
		}
		,fn_filtri_set_custom_filtri_app: function() {
			if ($rootScope.allegati && $rootScope.allegati.filtri) {
				let filtri_app = $localStorage[$rootScope.allegati.filtri_key];

				if (filtri_app) {
					$rootScope.allegati.filtri.sorting						= filtri_app.sorting					? filtri_app.sorting								: $rootScope.allegati.filtri.sorting;
					$rootScope.allegati.filtri.search						= filtri_app.search						? filtri_app.search									: $rootScope.allegati.filtri.search;
					$rootScope.allegati.filtri.utenti						= filtri_app.utenti						? filtri_app.utenti									: $rootScope.allegati.filtri.utenti;
					$rootScope.allegati.filtri.aziende						= filtri_app.aziende					? filtri_app.aziende								: $rootScope.allegati.filtri.aziende;
					$rootScope.allegati.filtri.dipendenti					= filtri_app.dipendenti					? filtri_app.dipendenti								: $rootScope.allegati.filtri.dipendenti;
					$rootScope.allegati.filtri.checkups						= filtri_app.checkups					? filtri_app.checkups								: $rootScope.allegati.filtri.checkups;

					$rootScope.allegati.filtri.fl_data						= !!filtri_app.fl_data;
					$rootScope.allegati.filtri.data_inizio					= filtri_app.data_inizio				? new Date(filtri_app.data_inizio.valueOf())		: $rootScope.allegati.filtri.data_inizio;
					$rootScope.allegati.filtri.data_fine					= filtri_app.data_fine					? new Date(filtri_app.data_fine.valueOf())			: $rootScope.allegati.filtri.data_fine;

					$rootScope.allegati.filtri.show							= $rootScope.allegati.filtri.show		? $rootScope.allegati.filtri.show					: {};
					filtri_app.show											= filtri_app.show						? filtri_app.show									: {};
					$rootScope.allegati.filtri.show.al_id					= !!filtri_app.show.al_id;
					$rootScope.allegati.filtri.show.al_descr				= !!filtri_app.show.al_descr;
					$rootScope.allegati.filtri.show.al_path					= !!filtri_app.show.al_path;
					$rootScope.allegati.filtri.show.al_type					= !!filtri_app.show.al_type;
					$rootScope.allegati.filtri.show.al_size					= !!filtri_app.show.al_size;
					$rootScope.allegati.filtri.show.al_date					= !!filtri_app.show.al_date;
					$rootScope.allegati.filtri.show.al_note					= !!filtri_app.show.al_note;
					$rootScope.allegati.filtri.show.al_note_interne			= !!filtri_app.show.al_note_interne;
				}
			}
		}
		,fn_filtri_filter: function(items, filtri, limit) {
			let filtered = [];

			let data_inizio	= filtri && filtri.fl_data	&& filtri.data_inizio	? new Date(filtri.data_inizio.valueOf()).toISOString() : undefined;
			let data_fine	= filtri && filtri.fl_data	&& filtri.data_fine		? new Date(filtri.data_fine.valueOf()).toISOString() : undefined;

			for (let i = 0; items && i < items.length && (!limit || (limit && limit > filtered.length)); i++) {
				let item = items[i];
				if (data_inizio	&& item.df_data	< data_inizio) continue;
				if (data_fine	&& item.df_data	> data_fine) continue;

				if ($scope.logged_user.admin != "1" && $rootScope.utente_is_utente($scope.logged_user) && $rootScope.allegato_is_visibile(item.al_id, $scope.logged_user.username)) continue;
				if ($scope.logged_user.admin != "1" && $rootScope.utente_is_azienda($scope.logged_user) && $rootScope.allegato_is_visibile(item.al_id, undefined, $scope.logged_user.idazienda)) continue;
				if ($scope.logged_user.admin != "1" && $rootScope.utente_is_dipendente($scope.logged_user) && $rootScope.allegato_is_visibile(item.al_id, undefined, undefined, $scope.logged_user.iddipendente)) continue;

				let utenti = $scope.get_valid_keys(filtri.utenti);
				if ($scope.logged_user.admin == "1" && utenti.length > 0) {
					let fl_ok = false;
					for (let i = 0; !fl_ok && i < utenti.length; i++) {
						fl_ok = $rootScope.allegato_is_visibile(item.al_id, utenti[i]);
					}
					if (!fl_ok) continue;
				}

				let aziende = $scope.get_valid_keys(filtri.aziende);
				if ($rootScope.utente_is_utente($scope.logged_user) && aziende.length > 0) {
					let fl_ok = false;
					for (let i = 0; !fl_ok && i < aziende.length; i++) {
						fl_ok = $rootScope.allegato_is_visibile(item.al_id, undefined, aziende[i]);
					}
					if (!fl_ok) continue;
				}

				let dipendenti = $scope.get_valid_keys(filtri.dipendenti);
				if (($rootScope.utente_is_utente($scope.logged_user) || $rootScope.utente_is_azienda($scope.logged_user)) && dipendenti.length > 0) {
					let fl_ok = false;
					for (let i = 0; !fl_ok && i < dipendenti.length; i++) {
						fl_ok = $rootScope.allegato_is_visibile(item.al_id, undefined, undefined, dipendenti[i]);
					}
					if (!fl_ok) continue;
				}

				let checkups = $scope.get_valid_keys(filtri.checkups);
				if ($rootScope.utente_is_utente($scope.logged_user) && checkups.length > 0) {
					let fl_ok = false;
					for (let i = 0; !fl_ok && i < checkups.length; i++) {
						fl_ok = $rootScope.allegato_is_visibile(item.al_id, undefined, undefined, undefined, checkups[i]);
					}
					if (!fl_ok) continue;
				}

				if (
					filtri
					&& filtri.search
					&& !$filter("filter")(
						[{
							item: item
							,dipendente: $rootScope.dipendenti.map[item.df_iddipendente]
							,formazione: $rootScope.formazioni.map[item.df_idformazione]
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
			if (this.rubrica_utenti				&& this.rubrica_utenti != rubrica)				this.rubrica_utenti.fl_open = false;
			if (this.rubrica_aziende			&& this.rubrica_aziende != rubrica)				this.rubrica_aziende.fl_open = false;
			if (this.rubrica_dipendenti			&& this.rubrica_dipendenti != rubrica)			this.rubrica_dipendenti.fl_open = false;
			if (this.rubrica_checkups			&& this.rubrica_checkups != rubrica)			this.rubrica_checkups.fl_open = false;
			if (this.rubrica_filtri_allegati	&& this.rubrica_filtri_allegati != rubrica)		this.rubrica_filtri_allegati.fl_open = false;
			if (rubrica) rubrica.fl_open = !rubrica.fl_open;
		}
		,rubrica_utenti: {
			template: "tmpl/rubrica_default.tmpl.html"
			,model: $rootScope.utenti
			,order_by: ["cognome", "nome", "username"]
			,fl_open: false
			,deselect: function() {$rootScope.allegati.filtri.utenti = {}}
			,search: undefined
			,checked: function(item) {return item && $rootScope.allegati.filtri.utenti[item.username] !== undefined}
			,click: function(item) {$rootScope.allegati.filtri.utenti[item.username] = $rootScope.allegati.filtri.utenti[item.username] !== undefined ? undefined : item.cognome + " " + item.nome}
			,subhead: function(item) {return item.cognome + " " + item.nome}
			,body: undefined
			,caption: function(item) {return item.username}
			,lines: 2
			,custom_filter_fn: undefined
		}
		,rubrica_aziende: {
			template: "tmpl/rubrica_default.tmpl.html"
			,model: $rootScope.aziende
			,order_by: ["az_descr"]
			,fl_open: false
			,deselect: function() {$rootScope.allegati.filtri.aziende = {}}
			,search: undefined
			,checked: function(item) {return item && $rootScope.allegati.filtri.aziende[item.az_id] !== undefined}
			,click: function(item) {$rootScope.allegati.filtri.aziende[item.az_id] = $rootScope.allegati.filtri.aziende[item.az_id] !== undefined ? undefined : item.az_descr}
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
			,deselect: function() {$rootScope.allegati.filtri.dipendenti = {}}
			,search: undefined
			,checked: function(item) {return item && $rootScope.allegati.filtri.dipendenti[item.di_id] !== undefined}
			,click: function(item) {$rootScope.allegati.filtri.dipendenti[item.di_id] = $rootScope.allegati.filtri.dipendenti[item.di_id] !== undefined ? undefined : item.di_descr}
			,subhead: function(item) {return item.di_descr}
			,body: undefined
			,caption: function(item) {return item.di_id}
			,lines: 2
			,custom_filter_fn: function(item) {
				if (item) {
					if ($rootScope.utente_is_azienda($scope.logged_user)) {
						if (item.di_idazienda != $scope.logged_user.idazienda) return false;
					} else if ($rootScope.utente_is_dipendente($scope.logged_user)) {
						return item.di_id == $scope.logged_user.iddipendente;
					}

					if (
						$rootScope.allegati.filtri
						&& $rootScope.allegati.filtri.aziende
						&& $scope.get_valid_keys($rootScope.allegati.filtri.aziende).length > 0
						&& !$rootScope.allegati.filtri.aziende[item.di_idazienda]
						&& !$rootScope.allegati.filtri.dipendenti[item.di_id]
					) {
						return false;
					}
					return true;
				}
				return false;
			}
		}
		,rubrica_checkups: {
			template: "tmpl/rubrica_default.tmpl.html"
			,model: $rootScope.checkups
			,order_by: ["-ch_date"]
			,fl_open: false
			,deselect: function() {$rootScope.allegati.filtri.checkups = {}}
			,search: undefined
			,checked: function(item) {return item && $rootScope.allegati.filtri.checkups[item.ch_id] !== undefined}
			,click: function(item) {$rootScope.allegati.filtri.checkups[item.ch_id] = $rootScope.allegati.filtri.checkups[item.ch_id] !== undefined ? undefined : item.ch_descr}
			,subhead: function(item) {return item.ch_id + " " + item.ch_descr}
			,body: undefined
			,caption: function(item) {return $filter("date")(item.ch_date, "dd/MM/yyyy HH:mm")}
			,lines: 2
			,custom_filter_fn: function(item) {
				if ($rootScope.utente_is_utente($scope.logged_user)) {
					if (
						$rootScope.allegati.filtri
						&& $rootScope.allegati.filtri.aziende
						&& $scope.get_valid_keys($rootScope.allegati.filtri.aziende).length > 0
						&& !$rootScope.allegati.filtri.aziende[item.ch_idazienda]
					) {
						return false;
					}
					return true;
				}
				return false;
			}
		}
		,rubrica_filtri_allegati: {
			template: "tmpl/rubrica_filtri_allegati.tmpl.html"
			,model: undefined // settato dopo... dovrebbe puntare a $rootScope.allegati
			,fl_open: false
		}
	};
	$rootScope.allegati.rubrica_filtri_allegati.model = $rootScope.allegati;

	$rootScope.push_allegato = function(allegato) {
		if (allegato) {
			if (Array.isArray(allegato)) {
				for (let i = 0; i < allegato.length; i++) {
					$rootScope.push_allegato(allegato[i]);
				}
			} else {
				$scope.push($rootScope.allegati.righe, allegato);
				$rootScope.allegati.map[allegato.al_id] = allegato;
			}
		}
	}

	$rootScope.select_allegati = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "AllegatoBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.allegati.righe = response;
				$rootScope.allegati.map = {};
				for (let al = 0; al < $rootScope.allegati.righe.length; al++) {
					let allegato = $rootScope.allegati.righe[al];
					$rootScope.allegati.map[allegato.al_id] = allegato;
				}
				return Promise.resolve($rootScope.allegati.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.ub_input_model_change_insert_allegato = function(file, element, data) {
		if (element && element.length > 0) {
			element[0].value = null;
		}

		return file ? $rootScope.insert_allegato({
			al_descr: file.name
			,al_path : "../../file/allegati/" + $scope.logged_user.username + "_" + new Date().valueOf()
			,al_type: file.type
			,al_size: file.size
			,al_date: new Date().toISOString()
			,blob_base64: file.blob_base64
		}) : Promise.reject("file is null");
	}

	$rootScope.insert_allegato = function(allegato) {
		return allegato ? $scope.ajax(
			"api/base/save.php"
			,{
				beanName: "AllegatoBean"
				,model: allegato
			}
			,true
		).then(
			(response) => {
				allegato.al_id = response[0].al_id;
				$rootScope.push_allegato(allegato);
				$scope.toast("Allegato salvato");
				if (!($rootScope.allegati_utenti.map[allegato.al_id] && Object.values($rootScope.allegati_utenti.map[allegato.al_id]).length > 0)) {
					let allegato_utente = {
						au_idallegato: allegato.al_id
						,au_idutente: $scope.logged_user.username
					};
					return $rootScope.insert_allegato_utente(allegato_utente).then(
						(allegato_utente) => {return Promise.resolve(allegato)}
						,(response) => {return Promise.reject(response)}
					)
				}
				return Promise.resolve(allegato);
			}
			,(response) => {return Promise.reject(response)}
		) : $scope.click_element_by_id("input-allegato");
	}

	$rootScope.anagrafica_allegato = function(allegato) {
		if (allegato) {
			let dialog = {};
			dialog.clickOutsideToClose = true;
			dialog.title = "Anagrafica allegato";
			dialog.class = "dialog-md";
			dialog.content_tmpl = "tmpl/anagrafica_allegato.tmpl.html";
			dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
			dialog.disabledform = false;
			dialog.editableform = true;

			dialog.allegato = allegato;
			dialog.allegato.al_size = parseInt(dialog.allegato.al_size);
			dialog.al_date = $scope.parseDate(allegato.al_date);
			dialog.logged_user = $scope.logged_user;

			dialog.utenti = $rootScope.utenti;
			dialog.allegati_utenti = $rootScope.allegati_utenti;
			dialog.insert_allegato_utente = $rootScope.insert_allegato_utente;
			dialog.delete_allegato_utente = $rootScope.delete_allegato_utente;
			dialog.utente_in_allegato = function(allegato, utente) {
				return allegato && utente && $rootScope.allegato_is_visibile(allegato.al_id, utente.username);
			}

			dialog.aziende = $rootScope.aziende;
			dialog.allegati_aziende = $rootScope.allegati_aziende;
			dialog.insert_allegato_azienda = $rootScope.insert_allegato_azienda;
			dialog.delete_allegato_azienda = $rootScope.delete_allegato_azienda;
			dialog.azienda_in_allegato = function(allegato, azienda) {
				return allegato && azienda && $rootScope.allegato_is_visibile(allegato.al_id, undefined, azienda.az_id);
			}

			dialog.dipendenti = $rootScope.dipendenti;
			dialog.allegati_dipendenti = $rootScope.allegati_dipendenti;
			dialog.insert_allegato_dipendente = $rootScope.insert_allegato_dipendente;
			dialog.delete_allegato_dipendente = $rootScope.delete_allegato_dipendente;
			dialog.dipendente_in_allegato = function(allegato, dipendente) {
				return allegato && dipendente && $rootScope.allegato_is_visibile(allegato.al_id, undefined, undefined, dipendente.di_id);
			}

			dialog.checkups = $rootScope.checkups;
			dialog.allegati_checkups = $rootScope.allegati_checkups;
			dialog.insert_allegato_checkup = $rootScope.insert_allegato_checkup;
			dialog.delete_allegato_checkup = $rootScope.delete_allegato_checkup;
			dialog.checkup_in_allegato = function(allegato, checkup) {
				return allegato && checkup && $rootScope.allegato_is_visibile(allegato.al_id, undefined, undefined, undefined, checkup.ch_id);
			}

			dialog.checkups_righe = {righe: [], map: {}}; //andrebbe creata una function che ottiene tutte le righe da tutti i checkup (le performance saranno le stesse di una select_ ma... vabbè, va fatto)
			dialog.allegati_checkups_righe = $rootScope.allegati_checkups_righe;
			dialog.checkup_riga_in_allegato = function(allegato, checkup_riga) {
				return allegato && checkup_riga && $rootScope.allegato_is_visibile(allegato.al_id, undefined, undefined, undefined, undefined, checkup_riga.cr_id);
			}

			return $scope.alert(dialog).then(
				(answer) => {
					answer.allegato.al_date = (answer.al_date ? answer.al_date : new Date()).toISOString();
					return $rootScope.insert_allegato(answer.allegato);
				}
				,(answer) => {return Promise.reject(answer)}
			);
		}
		return Promise.reject(
			"allegato is "
			+ (allegato === undefined ? "undefined" : "")
			+ (allegato === null ? "null" : "")
			+ (allegato === false ? "false" : "")
			+ (allegato === 0 ? "0" : "")
		)
	}

	$rootScope.allegato_is_visibile = function(idallegato, idutente, idazienda, iddipendente, idcheckup, idcheckup_riga) {
		return idallegato ? (
			(!idutente				|| ($rootScope.allegati_utenti.map[idallegato] && $rootScope.allegati_utenti.map[idallegato][idutente]))
			&& (!idazienda			|| ($rootScope.allegati_aziende.map[idallegato] && $rootScope.allegati_aziende.map[idallegato][idazienda]))
			&& (!iddipendente		|| ($rootScope.allegati_dipendenti.map[idallegato] && $rootScope.allegati_dipendenti.map[idallegato][iddipendente]))
			&& (!idcheckup			|| ($rootScope.allegati_checkups.map[idallegato] && $rootScope.allegati_checkups.map[idallegato][idcheckup]))
			&& (!idcheckup_riga		|| ($rootScope.allegati_checkups_righe.map[idallegato] && $rootScope.allegati_checkups_righe.map[idallegato][idcheckup_riga]))
		) : true;
	}
}]);

app.filter("allegati_visibili", ["$rootScope", function($rootScope) {
	return function(allegati, idutente, idazienda, iddipendente, idcheckup, idcheckup_riga) {
		let filtered = [];
		for (let al = 0; allegati && al < allegati.length; al++) {
			let allegato = allegati[al];
			if ($rootScope.allegato_is_visibile(allegato.al_id, idutente, idazienda, iddipendente, idcheckup, idcheckup_riga)) {
				filtered.push(allegato);
			}
		}
		return filtered;
	}
}]);