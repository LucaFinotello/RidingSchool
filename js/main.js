var app = angular.module("ubapp", [
	"ngMaterial"
	,"ngStorage"
	,"ngCordova"
	,"ngSanitize"
]);

app.config(["$mdDateLocaleProvider", function($mdDateLocaleProvider) {
	$mdDateLocaleProvider.months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
	$mdDateLocaleProvider.shortMonths = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
	$mdDateLocaleProvider.days = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Sabato"];
	$mdDateLocaleProvider.shortDays = ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"];
	$mdDateLocaleProvider.firstDayOfWeek = 1;

	$mdDateLocaleProvider.formatDate = function(date) {
		return date ? new Date(date.valueOf()).toLocaleDateString("it-it") : "";
	}
}]);
app.config(["$compileProvider", function($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|geo|tel):/);
}]);
app.config(["$mdThemingProvider", function($mdThemingProvider) {
	// Enable browser color
	$mdThemingProvider.enableBrowserColor({
		theme: "default", // Default is 'default'
		palette: "blue", // Default is 'primary', any basic material palette and extended palettes are available
		hue: "700" // Default is '800'
	});
}]);

app.directive("scroll", function() {
	return {
		restrict: "A"
		,scope: {
			scroll: "="
		}
		,link: function(scope, elem, attrs) {
			let model = scope.scroll;
			if (model) {
				scope.limit = scope.limit ? scope.limit : 30;
				model.limit = model.limit ? model.limit : scope.limit;
				angular.element(elem).bind("scroll", function(event) {
					let model = scope.scroll;
					if (elem[0].scrollHeight - (elem[0].scrollTop + elem[0].offsetHeight) <= 5 && model.limit && model.righe && model.limit < model.righe.length) {
						model.limit += scope.limit;
						scope.$apply();
					}
				});
			} else {
				console.error(
					"model is "
					+ (model === undefined ? "undefined" : "")
					+ (model === null ? "null" : "")
					+ (model === false ? "false" : "")
					+ (model === 0 ? "0" : "")
					+ ". Stai cercando di scrollare qualcosa che non esiste"
				);
			}
		}
	}
});

app.directive("ubInputModelChange", [function () {
	return {
		restrict: "A"
		,scope: {
			ngModel: "="
			,ubInputModelChange: "="
			,ubInputModelChangeData: "="
		}
		,link: function (scope, element, attributes) {
			element.bind("change", function(changeEvent) {
				let reader = new FileReader();
				reader.onload = function (loadEvent) {
					scope.$apply(function() {
						scope.ngModel = {
							name: changeEvent.target.files[0].name
							,type: changeEvent.target.files[0].type
							,size: changeEvent.target.files[0].size
							,last_modified_date: changeEvent.target.files[0].lastModifiedDate
							,blob_base64: loadEvent.target.result.replace("data:" + changeEvent.target.files[0].type + ";base64,", "")
						};
					});
					if (scope.ubInputModelChange && typeof scope.ubInputModelChange === "function") {
						scope.ubInputModelChange(
							scope.ngModel
							,element
							,scope.ubInputModelChangeData
						);
					} else if (scope.ubInputModelChange) {
						console.error("ubInputModelChange is not a function");
					}
				}
				if (changeEvent.target.files[0]) {
					reader.readAsDataURL(changeEvent.target.files[0]);
				}
			});
		}
	}
}]);

app.directive("braintreeDropin", [function() {
	return {
		restrict: "E",
		link: function(scope, elem, attrs) {
			let id_dropin = attrs.id;
			let instance_container = scope[attrs.scope];

			braintree.dropin.create(
				{
					authorization: client_token,
					selector: "#" + id_dropin,
					paypal: {
						flow: "vault"
					}
				}
				,function (createErr, instance) {
					if (createErr) {
						instance_container.braintree_dropin_instance = undefined;
						console.log("Create Error", createErr);
					} else {
						instance_container.braintree_dropin_instance = instance;
					}
				}
			)
		}
	}
}]);

app.directive("ubFocus", ["$timeout", function($timeout) {
	return {
		restrict: "A",
		link: function($scope, elem, attrs) {
			elem.ready(function(){
				$timeout(function() {
					elem[0].focus();
				});
			});
		}
	}
}]);

app.directive("ubTable", [function() {
	return {
		link: function(scope, elem, attrs) {
			elem.addClass("ub-table");
			let head = angular.element(elem[0].querySelector(".ub-table-head"));
			if (head) {
				head.on("scroll", function(event) {
					if (event && event.target) {
						let scroll_left = event.target.scrollLeft;
						let body = angular.element(elem[0].querySelector(".ub-table-body"));
						if (body && body[0]) {
							body[0].scrollLeft = body[0].scrollWidth > scroll_left ? scroll_left : body[0].scrollWidth;
						}
					}
				});
			}
		}
	}
}]);

/* qui posso catchare qualsiasi errore non gestito: la funzione scritta è la funzione di default.
app.factory("$exceptionHandler", [function() {
	return function(exception, cause) {
		console.error(exception);
	};
}]);
*/

app.controller("main", ["$scope", "$http", "$mdDialog", "$rootScope", "$mdToast", "$cordovaFile", "$cordovaFileOpener2", "$cordovaDevice", function($scope, $http, $mdDialog, $rootScope, $mdToast, $cordovaFile, $cordovaFileOpener, $cordovaDevice) {
	$scope.url = url;
	$rootScope.logged_user = undefined;
	$scope.ajax_loading = 0;

	angular.element(document).ready(function() {
		if (window.cordova) {
			if ($cordovaDevice) {
				$scope.cordova_platform = $cordovaDevice.getPlatform();
			} else {
				$scope.alert_error("cordova-plugin-device is not installed");
			}
		}
	});

	$scope.colors = {
		primary_toolbar: "blue-700"
		,secondary_toolbar: "blue-500"
	}

	$scope.getToday = function() {
		$scope.today = new Date();
		return new Date($scope.today.valueOf());
	}
	$scope.getToday();

	$scope.welcome = function(utente) {
		let count = 0;
		count +=			moduli && moduli.gestione			&& utente && utente.fl_gestione == "1"			? 1 : 0;
		count +=			moduli && moduli.scadenziario		&& utente && utente.fl_scadenziario == "1"		? 1 : 0;
		count +=			moduli && moduli.allegati			&& utente && utente.fl_allegati == "1"			? 1 : 0;
		count +=			moduli && moduli.report				&& utente && utente.fl_report == "1"			? 1 : 0;

		if (count == 1 &&	moduli && moduli.gestione			&& utente && utente.fl_gestione == "1")			return "gestione";
		if (count == 1 &&	moduli && moduli.scadenziario		&& utente && utente.fl_scadenziario == "1")		return "scadenziario";
		if (count == 1 &&	moduli && moduli.allegati			&& utente && utente.fl_allegati == "1")			return "allegati";
		if (count == 1 &&	moduli && moduli.report				&& utente && utente.fl_report == "1")			return "report";
		return "welcome_page";
	}
	$scope.page = function(page) {
		if (page && page != $scope._page) {
			$scope._page = page;
		}
		return $scope._page;
	}

	let get_innermost_dialog_element = function(element) {
		if (element) {
			let child = element[0].querySelector(".md-dialog-container");
			if (child) {
				return get_innermost_dialog_element(angular.element(child));
			} else {
				return element;
			}
		} else {
			return get_innermost_dialog_element(angular.element(document.body));
		}
	}
	$scope.alert = function(dialog) {
		if (dialog) {
			dialog.colors = $scope.colors;
			return $mdDialog.show({
				controller: function($scope, $mdDialog, dialog) {
					$scope.dialog = dialog;
				
					$scope.hide = function(answer) {
						return $mdDialog.hide(answer);
					};
					$scope.cancel = function(answer) {
						return $mdDialog.cancel(answer);
					};
					$scope.answer = function(answer) {
						if (answer && answer.checkRequired) {
							return answer.checkFn && answer.checkFn instanceof Function && answer.checkFn(answer) ? $mdDialog.hide(answer) : Promise.reject("checkFn returned false");
						} else {
							return $mdDialog.hide(answer);
						}
					};
				},
				templateUrl: "tmpl/dialog.tmpl.html",
				parent: get_innermost_dialog_element(),
				clickOutsideToClose: !!dialog.clickOutsideToClose,
				fullscreen: $scope.customFullscreen,
				locals: {dialog: dialog},
				multiple: true,
				onShowing: function(scope, element) {
					if (scope.dialog) {
						scope.dialog.element = element;
					}
				}
			}).then(
				(answer) => {return Promise.resolve(answer)}
				,(answer) => {return Promise.reject({error: "alert closed", answer: dialog})} //uso answer: dialog anzichè answer: answer poichè l'attributo clickOutsideToClose non restituisce la answer... peccato
			)
		}
		return Promise.reject(
			"dialog is "
			+ (dialog === undefined ? "undefined" : "")
			+ (dialog === null ? "null" : "")
			+ (dialog === false ? "false" : "")
			+ (dialog === 0 ? "0" : "")
		);
	}

	$scope.alert_error = function(text) {
		return $mdDialog.show(
			$mdDialog.alert()
				.parent(get_innermost_dialog_element())
				.clickOutsideToClose(true)
				.title("Errore! :(")
				.htmlContent(text)
				.ariaLabel("Alert Dialog")
				.ok("Ok!")
				.multiple(true)
		).then(
			() => {return Promise.reject(text)}
			,() => {return Promise.reject(text)}
		)
	}
	$scope.alert_warning = function(text) {
		return $mdDialog.show(
			$mdDialog.alert()
				.parent(get_innermost_dialog_element())
				.clickOutsideToClose(true)
				.title("Attenzione!")
				.htmlContent(text)
				.ariaLabel("Alert Dialog")
				.ok("Ok!")
				.multiple(true)
		).then(
			() => {return Promise.reject(text)}
			,() => {return Promise.reject(text)}
		)
	}
	$scope.alert_success = function(text) {
		return $mdDialog.show(
			$mdDialog.alert()
				.parent(get_innermost_dialog_element())
				.clickOutsideToClose(true)
				.title("Completato!")
				.htmlContent(text)
				.ariaLabel("Alert Dialog")
				.ok("Ok!")
				.multiple(true)
		).then(
			() => {return Promise.resolve(text)}
			,() => {return Promise.resolve(text)}
		)
	}
	$scope.alert_confirm = function(text, yes, no){
		return $mdDialog.show(
			$mdDialog.confirm()
				.parent(get_innermost_dialog_element())
				.clickOutsideToClose(false)
				.title("Attenzione")
				.htmlContent(text)
				.ariaLabel("Alert Confirm")
				.ok(yes)
				.cancel(no)
				.multiple(true)
		).then(
			() => {return Promise.resolve(yes)}
			,() => {return Promise.reject(no)}
		)
	}

	$scope.toast = function(text) {
		return $mdToast.show(
			$mdToast.simple()
			.textContent(text)
			.position("top right")
			.hideDelay(2500)
		).then(
			() => {return Promise.resolve(text)}
			,() => {return Promise.resolve(text)}
		);
	}

	$scope.datediff = function(date1, date2) {
		if (date1 && date1 instanceof Date && date2 && date2 instanceof Date) return Math.ceil(/*Math.abs*/(date1.getTime() - date2.getTime()) / (1000 * 3600 * 24));
		return 0;
	}

	$scope.parseInt = function(num) {
		return parseInt(num);
	}
	$scope.parseFloat = function(num) {
		return parseFloat(num);
	}
	$scope.parseDate = function(date) {
		return date ? new Date(date.valueOf()) : date;
	}

	$scope.get_valid_keys = function(arr) {
		let result = [];
		if (arr) for(let k in arr) {
			if (arr[k] !== false && arr[k] !== undefined && arr[k] !== null) {
				result.push(k);
			}
		}
		return result;
	}

	$scope.splice = function(arr, element, fl_ask_confirm, question_text) {
		let spliced = undefined;
		if (fl_ask_confirm) {
			return $scope.alert_confirm(question_text ? question_text : "Sicuro di voler rimuovere l'elemento?", "SI", "NO").then(
				(yes) => {return $scope.splice(arr, element, false, undefined)}
				,(no) => {return Promise.resolve(undefined)}
			);
		}
		if (element && arr && arr instanceof Array) {
			let index = arr.indexOf(element);
			if (index > -1) {
				spliced = arr.splice(index, 1);
			}
		}
		return spliced;
	}
	$scope.spliceByExample = function(arr, model) {
		let spliceds = [];
		if (model && arr && arr instanceof Array) {
			let keys = Object.keys(model);
			for (i = 0; i < arr.length; i++) {
				let element = arr[i];
				let fl_splice = true;
				for (k = 0; k < keys.length && fl_splice; k++) {
					if (element[keys[k]] != model[keys[k]]) {
						fl_splice = false;
					}
				}
				if (fl_splice) {
					spliceds.push($scope.splice(arr, element));
				}
			}
		}
		return spliceds;
	}
	$scope.splice_more = function(arr, elements) {
		let spliceds = [];
		if (elements && elements instanceof Array && arr && arr instanceof Array) {
			for (let e = 0; e < elements.length; e++){
				let index = arr.indexOf(elements[e]);
				if (index > -1) {
					spliceds.push(arr.splice(index, 1)[0]);
				}
			}
		}
		return spliceds;
	}
	$scope.push = function(arr, element, converter) {
		if (element && arr && arr instanceof Array && arr.indexOf(element) == -1) {
			arr.push(converter ? converter(element) : element);
		}
		return arr;
	}
	$scope.push_more = function(arr, elements, converter) {
		if (elements && elements instanceof Array && arr && arr instanceof Array) {
			for (let e = 0; e < elements.length; e++) {
				if (arr.indexOf(elements[e]) == -1) arr.push(converter ? converter(elements[e]) : elements[e]);
			}
		}
		return arr;
	}

	$scope.download_file = function(path, custom_filename, fl_open_it) {
		return $scope.ajax(
			"api/base/download.php"
			,{path: path}
			,true
		).then(
			(file) => {return $scope.download_file_by_base64(file.base64, custom_filename ? custom_filename : file.filename, file.type, fl_open_it)}
			,(response) => {return Promise.reject(response)}
		);
	}

	$scope.download_file_by_base64 = function(base64, filename, type, fl_open_it) {
		type = $scope.cordova_platform ? type : "application/octet-stream";
		let byteCharacters = window.atob(base64);	//base64 to binary
		let byteArrays = [];
		let sliceSize = 512;
		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			let slice = byteCharacters.slice(offset, offset + sliceSize);
			let byteNumbers = [];
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}
			let byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}
		let blob = new Blob(byteArrays, {type: type});

		if ($scope.cordova_platform) {
			// ionic cordova plugin add cordova-plugin-file
			return $cordovaFile ? (function() {
				switch ($scope.cordova_platform) {
					case "Android":
						return Promise.resolve(cordova.file.externalRootDirectory);
					case "iOS":
						return Promise.resolve(cordova.file.documentsDirectory);
					case "OSX":
						return Promise.resolve(cordova.file.documentsDirectory);
					case "windows":
						return Promise.resolve(cordova.file.dataDirectory);
				}
				return Promise.reject($scope.cordova_platform);
			})().then(
				(path) => {
					return $cordovaFile.createDir(path, "Download", true).then(
						(success) => {return Promise.resolve(path + "/Download")}
						,(error) => {return Promise.resolve(path)}
					).then(
						(path) => {
							return $cordovaFile.writeFile(path, filename, blob, true).then(
								(success) => {
									$scope.toast("Download completato");
									if (fl_open_it) {
										// ionic cordova plugin add cordova-plugin-file-opener2
										return $cordovaFileOpener ? $cordovaFileOpener.open(path + "/" + filename, type).then(
											(success) => {
												return Promise.resolve(true);
											}
											,(error) => {
												return $scope.alert_warning("Apertura file fallita: " + error.message + ". Status: " + error.status);
											}
										) : $scope.alert_error("cordova-plugin-file-opener2 is not installed");
									} else {
										return Promise.resolve(true);
									}
								}
								,(error) => {
									return $scope.alert_warning("Download non riuscito: " + error.message);
								}
							)
						}
						,(error) => {return Promise.reject(error)}
					)
				}
				,(cordova_platform) => {return $scope.alert_error(cordova_platform + " non è una piattaforma al momento supportata dai nostri sistemi. Operazione interrotta.")}
			) : $scope.alert_error("cordova-plugin-file is not installed");
		} else {
			let url = (window.URL || window.webkitURL).createObjectURL(blob);
			if (url) {
				let link = document.createElement("a");
				link.download = filename;
				link.href = url;
				link.click();
				$scope.toast("Download completato");
				return Promise.resolve(true);
			} else {
				return $scope.alert_error("Impossibile generare l'url per il download. Il tuo browser/dispositivo non è supportato dai nostri sistemi. Contatta l'assistenza");
			}
		}
	}

	$scope.click_element_by_id = function(id) {
		document.getElementById(id).click();
	}

	$scope.ajax = function(path, data, fl_ajax_loading) {
		$scope.ajax_loading += fl_ajax_loading ? 1 : 0;

		return $http.post(
			url + path
			,data ? data : {}
			,{withCredentials: true}
		).then(
			(response) => {
				$scope.ajax_loading -= fl_ajax_loading ? 1 : 0;
				if (response.data instanceof String || typeof response.data === 'string' ) {
					return $scope.alert_warning("Error " + path + ". " + response.data).then(
						() => {return Promise.reject(response.data)}
						,() => {return Promise.reject(response.data)}
					);
				} else if (response.data.status) {
					return Promise.resolve(response.data.response);
				} else {
					return $scope.alert_warning(response.data.response).then(
						() => {return Promise.reject(response.data.response)}
						,() => {return Promise.reject(response.data.response)}
					);
				}
			}
			,(response) => {
				$scope.ajax_loading -= fl_ajax_loading ? 1 : 0;
				response = "Error " + path + ". Status: '" + response.status + "'. Message: " + response.statusText;
				return $scope.alert_error(response).then(
					() => {return Promise.reject(response)}
					,() => {return Promise.reject(response)}
				);
			}
		);
	}

	$scope.focus = function(e) {
		return $timeout(function() {
			return e && e.focus();
		});
	}
	$scope.focus_by_id = function(id) {
		return id && $scope.focus(document.getElementById(id));
	}
}]);

/* Matteo: non so se è ancora usata
Number.prototype.format = function(n, x, s, c) {
	let re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\D" : "$") + ")",
		num = this.toFixed(Math.max(0, ~~n));

	return (c ? num.replace(".", c) : num).replace(new RegExp(re, "g"), "$&" + (s || ","));
};
*/

app.filter("not_in", function() {
	return function(items, container, comparator) {
		let filtered = [];
		if (items && container) {
			for (let i = 0; i < items.length; i++) {
				let item = items[i];
				if (comparator) {
					if (!comparator(container, item)) {
						filtered.push(item);
					}
				} else if (container.indexOf(item) == -1) {
					filtered.push(item);
				}
			}
		} else if (items) {
			return items;
		}
		return filtered;
	}
});
app.filter("in", function() {
	return function(items, container, comparator) {
		let filtered = [];
		if (items && container) {
			for (let i = 0; i < items.length; i++) {
				let item = items[i];
				if (comparator) {
					if (comparator(container, item)) {
						filtered.push(item);
					}
				} else if (container.indexOf(item) > -1) {
					filtered.push(item);
				}
			}
		} else if (items) {
			return items;
		}
		return filtered;
	}
});

app.filter("countdown", ["$filter", function($filter) {
	return function(to) {
		if (!to) return to;
		to = new Date(to.valueOf());
		if (to.valueOf() > 1000 * 60 * 60 * 24 * 365) return $filter("date")(to, "y-MM-dd HH:mm:ss");
		if (to.valueOf() > 1000 * 60 * 60 * 24 * 31) return $filter("date")(to, "M-dd HH:mm:ss");
		if (to.valueOf() > 1000 * 60 * 60 * 24) return $filter("date")(to, "d HH:mm:ss");
		if (to.valueOf() > 1000 * 60 * 60) return $filter("date")(to, "H:mm:ss");
		if (to.valueOf() > 1000 * 60) return $filter("date")(to, "m:ss");
		if (to.valueOf() > 1000) return $filter("date")(to, "m:ss");
		return "0";
	}
}]);

app.filter("splitfilter", ["$filter", function($filter) {
	return function(items, search, splitter, properties, condition, limit) {
		search = search ? search.toString() : "";
		condition = condition ? condition.toUpperCase() : "AND";

		condition = search ? condition : "AND"; // miglioro un po' di performance con questa riga particolare

		let searchs = splitter ? search.split(splitter) : [search];

		let filtered = [];
		for (let i = 0; items && i < items.length && (!limit || (limit && limit > filtered.length)); i++) {
			let item = items[i];
			let fl_and = true;
			for (let s = 0; search && filtered.indexOf(item) == -1 && s < searchs.length; s++) {
				let search_item = properties ? {} : item;
				for (let p = 0; properties && p < properties.length; p++) {
					let property = properties[p];
					search_item[property] = item[property];
				}
				let fl_ok = $filter("filter")([search_item], searchs[s]).length > 0;
				fl_and = fl_and && fl_ok;
				if (fl_ok && condition == "OR") {
					filtered.push(item);
				}
			}
			if (fl_and && condition == "AND") {
				filtered.push(item);
			}
		}
		return filtered;
	}
}]);
app.filter("custom_filter", [function() {
	return function(items, comparator) {
		let filtered = [];
		for (let i = 0; items && i < items.length; i++) {
			let item = items[i];
			if (comparator) {
				if (comparator(item)) {
					filtered.push(item);
				}
			} else {
				filtered.push(item);
			}
		}
		return filtered;
	}
}]);

app.filter("filesize_currency", ["$filter", function($filter) {
	return function(size, um, d) {
		size = size ? parseFloat(size) : 0;
		um = um === undefined ? "B" : um;
		if (size > 1024 && um == "B") {
			size /= 1024;
			um = "KB";
		}
		if (size > 1024 && um == "KB") {
			size /= 1024;
			um = "MB";
		}
		if (size > 1024 && um == "MB") {
			size /= 1024;
			um = "GB";
		}
		if (size > 1024 && um == "GB") {
			size /= 1024;
			um = "TB";
		}
		if (size > 1024 && um == "TB") {
			size /= 1024;
			um = "PB";
		}
		d = d === undefined ? (um == "B" ? 0 : 3) : d;
		return $filter("currency")(size, um, d);
	}
}]);
app.filter("file_icon", [function() {
	return function(type) {
		if (type == "application/vnd.ms-excel") return "xls";
		if (type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return "xlsx";
		if (type == "ciaone") return "ciaone";
		return "file";
	}
}]);

app.filter("toArray", [function() {
	return function(obj) {
		let result = [];
		let items = obj ? Object.values(obj) : [];
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item !== undefined) {
				result.push(item);
			}
		}
		return result;
	}
}]);