app.controller("filtri_app", ["$scope", "$rootScope", "$localStorage", "$filter", function($scope, $rootScope, $localStorage, $filter) {

	$scope.model = undefined;

	let fn_filtri_set_default_filtri_app = function() {
		if ($scope.model.fn_filtri_set_default_filtri_app) {
			return $scope.model.fn_filtri_set_default_filtri_app();
		}
		if ($scope.model && $scope.model.filtri) {
			$scope.model.filtri.sorting				= [];
			$scope.model.filtri.show				= $scope.model.filtri.show ? $scope.model.filtri.show : {};
		}
	}

	let fn_filtri_set_custom_filtri_app = function() {
		if ($scope.model.fn_filtri_set_custom_filtri_app) {
			return $scope.model.fn_filtri_set_custom_filtri_app();
		}
	}

	let fn_filtri_filter = function(items, filtri, limit) {
		if ($scope.model.fn_filtri_filter) {
			return $scope.model.fn_filtri_filter(items, filtri, limit);
		}
		let filtered = [];
		if (items) for (let i = 0; i < items.length && (!limit || (limit && limit > filtered.length)); i++){
			let item = items[i];
			filtered.push(item);
		}
		return filtered;
	}

	$scope.fn_filtri_onchange_force = function() {
		if ($scope.model.fn_filtri_onchange_force) {
			return $scope.model.fn_filtri_onchange_force();
		}
		fn_filtri_onchange($scope.model.filtri, $scope.model.filtri);
	}

	let fn_filtri_onchange = function(new_filtri, old_filtri) {
		if ($scope.model.fn_filtri_onchange) {
			return $scope.model.fn_filtri_onchange(new_filtri, old_filtri);
		}
		if (new_filtri && old_filtri) {
			$scope.model.filtered = fn_filtri_filter(
				$filter("orderBy")(
					$scope.model.righe
					,$scope.fn_filtri_get_sort_config()
				)
				,$scope.model.filtri
				,$scope.model.limit
			);
		}
	}

	$scope.fn_filtri_get_sort_config = function() {
		if ($scope.model.fn_filtri_get_sort_config) {
			return $scope.model.fn_filtri_get_sort_config();
		}
		let sort_config = [];
		if ($scope.model.filtri.sorting) for (let s = 0; s < $scope.model.filtri.sorting.length; s++) {
			let sort = $scope.model.filtri.sorting[s];
			sort_config.push((sort.reverse ? "-" : "") + sort.property);
		}
		return sort_config;
	}

	let fn_filtri_drop_filtro_app = function(property, key) {
		if ($scope.model.fn_filtri_drop_filtro_app) {
			return $scope.model.fn_filtri_drop_filtro_app(property, key);
		}
		if ($scope.model && $scope.model.filtri && $scope.model.filtri[property] && $scope.model.filtri[property][key] !== undefined) {
			delete $scope.model.filtri[property][key];
		}
	}
	$scope.fn_filtri_toggle_filtro_app = function(property, key, value) {
		if ($scope.model.fn_filtri_toggle_filtro_app) {
			return $scope.model.fn_filtri_toggle_filtro_app(property, key, value);
		}
		if ($scope.model && $scope.model.filtri && $scope.model.filtri[property]) {
			if ($scope.model.filtri[property][key]) {
				fn_filtri_drop_filtro_app(property, key);
			} else {
				value = value ? value : key;
				$scope.model.filtri[property][key] = value;
			}
		}
	}

	$scope.fn_filtri_sort_by = function(property) {
		if ($scope.model.fn_filtri_sort_by) {
			return $scope.model.fn_filtri_sort_by(property);
		}
		$scope.model.filtri.sorting = $scope.model.filtri.sorting ? $scope.model.filtri.sorting : [];
		for (let s = 0; s < $scope.model.filtri.sorting.length; s++) {
			let sort = $scope.model.filtri.sorting[s];
			if (sort.property == property) {
				if (sort.reverse) {
					$scope.model.filtri.sorting.splice(s, 1);
				} else {
					sort.reverse = true;
				}
				return;
			}
		}
		$scope.model.filtri.sorting.push({
			property: property
			,reverse: false
		});
	}
	$scope.fn_filtri_sorted_by = function(property) {
		if ($scope.model.fn_filtri_sorted_by) {
			return $scope.model.fn_filtri_sorted_by(property);
		}
		if ($scope.model.filtri.sorting) for (let s = 0; s < $scope.model.filtri.sorting.length; s++) {
			let sort = $scope.model.filtri.sorting[s];
			if (sort.property == property) {
				return sort.reverse ? "desc" : "asc";
			}
		}
		return false;
	}
	$scope.fn_filtri_refresh = function() {
		if ($scope.model.fn_filtri_refresh) {
			return $scope.model.fn_filtri_refresh();
		}
	}

	/**
	 * USAGE EXAMPLE:
	 * 	select_xxx = function() {
	 * 		ajax(
	 * 			"select_xxx.php"
	 * 			,data
	 * 			,function(response) {
	 * 				if (response.data.status) {
	 * 					$rootScope.xxx = {};							//opzionale, anche rootScope è opzionale
	 * 					$rootScope.xxx.righe = response.data.response;
	 * 					$rootScope.filtri_app($rootScope.xxx);
	 * 				} else ...
	 * 			}
	 * 		);
	 * 	}
	 */
	$rootScope.filtri_app = function(model) {
		if (model) {
			$scope.model = model;
			$scope.model.filtri = {};

			fn_filtri_set_default_filtri_app();
			fn_filtri_set_custom_filtri_app();

			if ($scope.model.filtri_key) {
				$localStorage[$scope.model.filtri_key] = $scope.model.filtri;
			}

			if ($scope.break_model_filtri_watch) {
				$scope.break_model_filtri_watch();
			}
			$scope.break_model_filtri_watch = $scope.$watch(
				"model.filtri"
				,function(new_filtri, old_filtri) {
					$scope.model.limit = $scope.model.limit ? 30 : $scope.model.limit;
					fn_filtri_onchange(new_filtri, old_filtri);
				}
				,true
			);
			if ($scope.model.break_model_righe_watch) {
				$scope.model.break_model_righe_watch();
			}
			$scope.model.break_model_righe_watch = $scope.$watch(
				"model.righe"
				,$scope.fn_filtri_onchange_force
				,true
			);
			$scope.model.limit = $scope.model.limit ? $scope.model.limit : 30;
			if ($scope.model.break_model_limit_watch) {
				$scope.model.break_model_limit_watch();
			}
			$scope.model.break_model_limit_watch = $scope.$watch(
				"model.limit"
				,$scope.fn_filtri_onchange_force
				,true
			);

			$scope.model.filtri_app_scope = $scope;
		} else {
			console.error(
				"model is "
				+ (model === undefined ? "undefined" : "")
				+ (model === null ? "null" : "")
				+ (model === false ? "false" : "")
				+ (model === 0 ? "0" : "")
			);
		}
	}
}]);