angular.module('thermostat-app')
.controller('IndexCtrl', function ($scope, $http) {
	var cache = null;
	var isDragged = false;
	var isDiscarded = false;
	$scope.values = null;	

	$http.get('http://localhost:3000/api/temperatures')
	.success(function (data) {
		$scope.values = data;
	});

	$scope.turn = function (action, id, index) {
		if (action === 'on' || action === 'off') {
			toggleOnOff(id);
		} else {
			restartDevice(id, true);
		}
	};

	$scope.thermostatMouseDown = function (id) {
		$scope.values.forEach(function (el) {
			if (el.id === id) {
				cache = {
					id: el.id,
					value: el.value,
					isWorking: el.isWorking,
					isOn: el.isOn
				}
			}
		});
		isDragged = true;
	};

	$scope.thermostatMouseUp = function (id) {
		isDragged = false;
		showModal();
	};

	$scope.areaClicked = function (id, isWorking) {
		if (!isWorking && !$('#toast-container').children().length) {			
			Materialize.toast('This thermostat is disabled (Swipe to restart)', undefined, undefined, function () {
				restartDevice(id);
			});
		}
	};

	$scope.agree = function () {
		$('#confirm-modal').closeModal();
	};
		
	$scope.discard = function () {
		isDiscarded = true;
		$scope.values.forEach(function (el) {
			if (el.id === cache.id) {				
				el.value = cache.value;	
				return;			
			}
		});
		cache = null;
		$('#confirm-modal').closeModal();
	};

	$scope.$watch('recentlyChanged', function (newValue, oldValue) {		
		if (isDragged || (newValue === undefined && oldValue === undefined)) return;
		if ((oldValue === undefined && (newValue !== undefined && newValue.value !== undefined)) || newValue.value !== oldValue.value) {
			showModal();		
		}
	});	

	$scope.$watch('values', function (newValues, oldValues) {
		if (newValues != null && oldValues != null) {
			newValues.forEach(function (newValue) {
				oldValues.forEach(function (oldValue) {
					if (newValue.id === oldValue.id && newValue.value !== oldValue.value) {
						$scope.recentlyChanged = {
							value: newValue.value,
							id: newValue.id
						};
					}
				});
			});	
		}		
	}, true);

	function showModal() {
		if (isDiscarded) {
			isDiscarded = false;
			return;
		}
		closeAllToasts();
		$('#confirm-modal').openModal({
			dismissible: false,
			opacity: .75,
			in_duration: 300,
			out_duration: 200
		});	
	}

	function closeAllToasts() {
		var $toastContainerChildren = $('#toast-container').children();
		if ($toastContainerChildren.length) {
			$toastContainerChildren.remove();
		}
	}

	function restartDevice(id, clickedFrom) {
		// HTTP request to restart device and apply result to the application
		$scope.values.forEach(function (value) {
			if (value.id === id) {
				if (Math.random() > 0.5) {
					if (clickedFrom) {
						value.isWorking = true;
						value.isOn = true;
						Materialize.toast('Restarted successfully', 4000);
					} else {
						$scope.$apply(function () {
							value.isWorking = true;
							value.isOn = true;
							Materialize.toast('Restarted successfully', 4000);
						});
					}						
				} else {
					Materialize.toast('This device is faulty. Try again or contact with service', 5000);
				}						
			}
		});
	}

	function toggleOnOff(id) {
		$scope.values.forEach(function (value) {
			if (value.id === id) {
				value.isOn = !value.isOn;
				Materialize.toast('Device is ' + (value.isOn ? 'on' : 'off'), 2000);				
			}
		})
	}
});