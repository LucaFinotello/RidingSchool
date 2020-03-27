app.controller("utenti", ["$rootScope", "$scope", "$localStorage", "$filter", function($rootScope, $scope, $localStorage, $filter) {
	$rootScope.utenti = $rootScope.utenti ? $rootScope.utenti : {
		filtri_key: "filtri_utenti"
		,fn_filtri_set_default_filtri_app: function () {
			if ($rootScope.utenti && $rootScope.utenti.filtri) {
				$rootScope.utenti.filtri.sorting				= [{
					property: "username"
					,reverse: false
				}];
				$rootScope.utenti.filtri.show						= $rootScope.utenti.filtri.show ? $rootScope.utenti.filtri.show : {};
				$rootScope.utenti.filtri.show.username				= true;
				$rootScope.utenti.filtri.show.cognome				= true;
				$rootScope.utenti.filtri.show.nome					= true;
				$rootScope.utenti.filtri.show.iddipendente			= true;
				$rootScope.utenti.filtri.show.idazienda				= true;
				$rootScope.utenti.filtri.show.admin					= true;
				$rootScope.utenti.filtri.show.fl_gestione			= true;
				$rootScope.utenti.filtri.show.fl_scadenziario		= true;
				$rootScope.utenti.filtri.show.fl_allegati			= true;
				$rootScope.utenti.filtri.show.fl_report				= true;
			}
		}
		,fn_filtri_set_custom_filtri_app: function () {
			if ($rootScope.utenti && $rootScope.utenti.filtri) {
				let filtri_app = $localStorage[$rootScope.utenti.filtri_key];

				if (filtri_app) {
					$rootScope.utenti.filtri.sorting					= filtri_app.sorting					? filtri_app.sorting				: $rootScope.utenti.filtri.sorting;
					$rootScope.utenti.filtri.show						= $rootScope.utenti.filtri.show			? $rootScope.utenti.filtri.show		: {};
					filtri_app.show										= filtri_app.show						? filtri_app.show					: {};
					$rootScope.utenti.filtri.show.username				= !!filtri_app.show.username;
					$rootScope.utenti.filtri.show.cognome				= !!filtri_app.show.cognome;
					$rootScope.utenti.filtri.show.nome					= !!filtri_app.show.nome;
					$rootScope.utenti.filtri.show.iddipendente			= !!filtri_app.show.iddipendente;
					$rootScope.utenti.filtri.show.idazienda				= !!filtri_app.show.idazienda;
					$rootScope.utenti.filtri.show.admin					= !!filtri_app.show.admin;
					$rootScope.utenti.filtri.show.fl_gestione			= !!filtri_app.show.fl_gestione;
					$rootScope.utenti.filtri.show.fl_scadenziario		= !!filtri_app.show.fl_scadenziario;
					$rootScope.utenti.filtri.show.fl_allegati			= !!filtri_app.show.fl_allegati;
					$rootScope.utenti.filtri.show.fl_report				= !!filtri_app.show.fl_report;
				}
			}
		}
		,fn_filtri_filter: function(items, filtri, limit) {
			let filtered = [];

			for (let i = 0; items && i < items.length && (!limit || (limit && limit > filtered.length)); i++) {
				let item = items[i];

				if (
					filtri
					&& filtri.search
					&& !$filter("filter")(
						[{
							item: item
							,azienda: $rootScope.aziende.map[item.idazienda]
							,dipendente: $rootScope.dipendenti.map[item.iddipendente]
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
			if (this.rubrica_filtri_utenti	&& this.rubrica_filtri_utenti != rubrica)		this.rubrica_filtri_utenti.fl_open = false;
			if (rubrica) rubrica.fl_open = !rubrica.fl_open;
		}
		,rubrica_filtri_utenti: {
			template: "tmpl/rubrica_filtri_utenti.tmpl.html"
			,model: undefined
			,fl_open: false
		}
	};
	$rootScope.utenti.rubrica_filtri_utenti.model = $rootScope.utenti;

	$rootScope.select_utenti = function() {
		return $scope.ajax(
			"api/base/find.php"
			,{
				beanName: "UtenteBean"
				,model: undefined
			}
			,true
		).then(
			(response) => {
				$rootScope.utenti.righe = response;
				$rootScope.utenti.selected = undefined;
				$rootScope.utenti.map = {};
				for (let ut = 0; ut < $rootScope.utenti.righe.length; ut++) {
					let utente = $rootScope.utenti.righe[ut];
					$rootScope.utenti.map[utente.username] = utente;
				}
				if ($rootScope.utenti.filtri_app_scope) {
					$rootScope.utenti.filtri_app_scope.fn_filtri_onchange_force();
				}
				return Promise.resolve($rootScope.utenti.righe);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.insert_utente = function(utente) {
		if (utente) {
			utente.admin			= utente.admin == "1"			&& $rootScope.utente_is_utente(utente) ? "1" : "0";
			utente.fl_gestione		= utente.fl_gestione == "1"		&& $rootScope.utente_is_utente(utente) ? "1" : "0";
			utente.fl_report		= utente.fl_report == "1"		&& $rootScope.utente_is_utente(utente) ? "1" : "0";
			return $scope.ajax(
				"api/utente/save.php"
				,{utente: utente}
				,true
			).then(
				(response) => {
					$scope.push($rootScope.utenti.righe, utente);
					$rootScope.utenti.map[utente.username] = utente;
					for (let uc = 0; utente.chiavi && uc < utente.chiavi.length; uc++) {
						utente.chiavi[uc].fl_new = undefined;
					}
					$scope.toast("Utente salvato");
					return Promise.resolve(utente);
				}
				,(response) => {return Promise.reject(response)}
			);
		} else {
			let dialog = {};
			dialog.clickOutsideToClose = true;
			dialog.title = "Aggiungi utente";
			dialog.class = "";
			dialog.content_tmpl = "tmpl/ask_username.tmpl.html";
			dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
			dialog.disabledform = false;
			dialog.editableform = true;

			dialog.username = undefined;

			return $scope.alert(dialog).then(
				(answer) => {
					if (answer && answer.username) {
						return $rootScope.insert_utente({username: answer.username, enabled: 1, chiavi: []}).then(
							(utente) => {return $rootScope.anagrafica_utente(utente)}
							,(response) => {return Promise.reject(response)}
						);
					}
					return Promise.reject(
						"username is "
						+ (username === undefined ? "undefined" : "")
						+ (username === null ? "null" : "")
						+ (username === false ? "false" : "")
						+ (username === 0 ? "0" : "")
					)
				}
				,(answer) => {return Promise.reject(answer)}
			);
		}
	}

	$rootScope.delete_utente = function(utente, fl_ask_confirm) {
		if (utente) {
			return fl_ask_confirm ? $scope.alert_confirm("Sicuro di voler eliminare l'utente?", "SI", "NO").then(
				(yes) => {return $rootScope.delete_utente(utente, false)}
				,(no) => {return Promise.reject(no)}
			) : $scope.ajax(
				"api/utente/delete.php"
				,{utente: utente}
				,true
			).then(
				(response) => {
					$scope.splice($rootScope.utenti.righe, utente);
					$rootScope.utenti.map[utente.username] = undefined;
					$scope.toast("Utente eliminato");
					return Promise.resolve(utente);
				}
				,(response) => {return Promise.reject(response)}
			);
		}
		return Promise.reject(
			"utente is "
			+ (utente === undefined ? "undefined" : "")
			+ (utente === null ? "null" : "")
			+ (utente === false ? "false" : "")
			+ (utente === 0 ? "0" : "")
		)
	}

	$rootScope.anagrafica_utente = function(utente) {
		if (utente) {
			let dialog = {};
			dialog.clickOutsideToClose = true;
			dialog.title = "Anagrafica utente";
			dialog.class = "";
			dialog.content_tmpl = "tmpl/anagrafica_utente.tmpl.html";
			dialog.toolbar_action_buttons_tmpl = "tmpl/utente_toolbar_action_buttons.tmpl.html";
			dialog.disabledform = false;
			dialog.editableform = true;

			dialog.logged_user = $rootScope.logged_user;
			dialog.utente = utente;
			dialog.dipendenti = $rootScope.dipendenti;
			dialog.aziende = $rootScope.aziende;
			dialog.moduli = $rootScope.gestione.moduli;

			dialog.change_password = $rootScope.change_password;
			dialog.splice = $scope.splice;

			dialog.deleteFn = function(answer, cancelFn) {
				return $rootScope.delete_utente(answer.utente, true).then(
					(utente) => {
						if (cancelFn) {
							cancelFn();
						}
						return Promise.resolve(utente);
					}
					,(response) => {return Promise.reject(response)}
				);
			}

			return $scope.alert(dialog).then(
				(answer) => {return $rootScope.insert_utente(answer.utente)}
				,(answer) => {return Promise.reject(answer)}
			);
		}
		return Promise.reject(
			"utente is "
			+ (utente === undefined ? "undefined" : "")
			+ (utente === null ? "null" : "")
			+ (utente === false ? "false" : "")
			+ (utente === 0 ? "0" : "")
		)
	}

	$rootScope.utente_is_dipendente = function(utente) {return !!utente.iddipendente}
	$rootScope.utente_is_azienda = function(utente) {return !!utente.idazienda && !utente.iddipendente}
	$rootScope.utente_is_utente = function(utente) {return !$rootScope.utente_is_dipendente(utente) && !$rootScope.utente_is_azienda(utente)}
}]);

app.filter("utente_is_dipendente", ["$rootScope", function($rootScope) {
	return $rootScope.utente_is_dipendente;
}]);
app.filter("utente_is_azienda", ["$rootScope", function($rootScope) {
	return $rootScope.utente_is_azienda;
}]);
app.filter("utente_is_utente", ["$rootScope", function($rootScope) {
	return $rootScope.utente_is_utente;
}]);
app.filter("utenti_dipendenti", ["$rootScope", function($rootScope) {
	return function(utenti) {
		let filtered = [];
		for (let ut = 0; utenti && ut < utenti.length; ut++) {
			let utente = utenti[ut];
			if ($rootScope.utente_is_dipendente(utente)) {
				filtered.push(utente);
			}
		}
		return filtered;
	}
}]);
app.filter("utenti_aziende", ["$rootScope", function($rootScope) {
	return function(utenti) {
		let filtered = [];
		for (let ut = 0; utenti && ut < utenti.length; ut++) {
			let utente = utenti[ut];
			if ($rootScope.utente_is_azienda(utente)) {
				filtered.push(utente);
			}
		}
		return filtered;
	}
}]);
app.filter("utenti_utenti", ["$rootScope", function($rootScope) {
	return function(utenti) {
		let filtered = [];
		for (let ut = 0; utenti && ut < utenti.length; ut++) {
			let utente = utenti[ut];
			if ($rootScope.utente_is_utente(utente)) {
				filtered.push(utente);
			}
		}
		return filtered;
	}
}]);

app.filter("utente_username_is_valid", ["$rootScope", function($rootScope) {
	return function(username) {
		if (!username) return false;
		for (let ut = 0; $rootScope.utenti && $rootScope.utenti.righe && ut < $rootScope.utenti.righe.length; ut++) {
			let utente = $rootScope.utenti.righe[ut];
			if (utente && utente.username && utente.username.toLowerCase() == username.toLowerCase()) {
				return false;
			}
		}
		return true;
	}
}]);

app.filter("utente_chiave_is_valid", ["$rootScope", function($rootScope) {
	return function(chiave) {
		if (!chiave) return false;
		if (!chiave.fl_new) return true;
		if (!chiave.uc_chiave) return false;
		for (let ut = 0; $rootScope.utenti && $rootScope.utenti.righe && ut < $rootScope.utenti.righe.length; ut++) {
			let utente = $rootScope.utenti.righe[ut];
			for (let cu = 0; utente && utente.username != chiave.uc_idutente && utente.chiavi && cu < utente.chiavi.length; cu++) {
				let utente_chiave = utente.chiavi[cu];
				if (utente_chiave && !utente_chiave.fl_new && utente_chiave.uc_chiave && utente_chiave.uc_chiave.toLowerCase() == chiave.uc_chiave.toLowerCase()) {
					return false;
				}
			}
		}
		return true;
	}
}]);