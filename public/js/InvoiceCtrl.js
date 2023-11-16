angular.module('todo')


	.controller('InvoiceCtrl', function ($scope,  $timeout, $http) {
		$scope.USER = JSON.parse(localStorage.USER);

		numeroDeCuenta = $scope.USER.numero_cuenta
		id_usuario = $scope.USER.id_usuario



		$scope.mostrarinvoice = function () {
			$http.get('/traerinvoice')
				.then(function (response) {
					var result = response.data;
					if (result.length > 0) {
						$scope.invoice = result
						console.log($scope.invoice)
					}
				});

			$http.get('/verifisaldocajero')
				.then(function (response) {
					var result = response.data;
					if (result.length > 0) {
						$scope.saldocajero = result
						id_cajero = result[0].id

						
						$scope.billetes = [
							{denominacion: '100k', cantidad: result[0].billetes_100000},
							{denominacion: '50k', cantidad: result[0].billetes_50000},
							{denominacion: '20k', cantidad: result[0].billetes_20000},
							{denominacion: '10k', cantidad: result[0].billetes_10000},
							{denominacion: '5k', cantidad: result[0].billetes_5000},
							{denominacion: '2k', cantidad: result[0].billetes_2000},
							{denominacion: '1k', cantidad: result[0].billetes_1000}
						];


					} else {
						console.log("hola");

					}
				});

			$http.get('/verifisaldocajero')
				.then(function (response) {
					var result = response.data;
					if (result.length > 0) {
						console.log($scope.invoice)
					}
				});
		}

		$scope.mostrarinvoice();



		$scope.mostrarinvoicetodos = function () {
			console.log(id_usuario)

			$http.get('/traerinvoicetodos?id_usuario=' + id_usuario)
				.then(function (response) {
					var result = response.data;
					console.log(result)
					if (result.length > 0) {
						$scope.invoicetodos = result
						console.log($scope.invoicetodos)
						

					}
				});
			
		}

		$scope.mostrarinvoicetodos();


		$scope.traerusu = function () {
			console.log(id_usuario)

			$http.get('/traerusus?id_usuario=' + id_usuario)
				.then(function (response) {
					var result = response.data;
					console.log(result)
					if (result.length > 0) {
						$scope.usuarios = result
						
						

					}
				});
			
		}

		$scope.traerusu();


		$scope.seleccionarUsuario = function(id_usuario2) {
			console.log("El ID del usuario seleccionado es: " + id_usuario2);
			$scope.usuariotrans = id_usuario2
		};


		$scope.transferir = function(montoTransferir) {
			console.log("El ID del usuario seleccionado es: " + $scope.usuariotrans);
			console.log("Mi ID del usuario seleccionado es: " + id_usuario);
			console.log("SALDO: " + montoTransferir);
		
			// Obtener el saldo actual del usuario
			$http.get('/obtenerSaldo', { params: { id_usuario: id_usuario } })
				.then(function(response) {
					var saldoActual = response.data.saldo;
		
					// Verificar si el usuario tiene suficiente saldo
					if (saldoActual < montoTransferir) {
						console.log('Saldo insuficiente para realizar la transferencia');
						$scope.insuficiente = true;
							$timeout(function () {
								$scope.insuficiente = false;
						}, 3000);

						
						return;
					}
		
					// Restar el saldo del usuario que está realizando la transferencia
					$http.post('/actualizarSaldo', { id_usuario: id_usuario, monto: -montoTransferir })
						.then(function(response) {
							console.log('Saldo actualizado para el usuario ' + id_usuario);
						});
		
					// Agregar el saldo al usuario que está recibiendo la transferencia
					$http.post('/actualizarSaldo', { id_usuario: $scope.usuariotrans, monto: montoTransferir })
						.then(function(response) {
							console.log('Saldo actualizado para el usuario ' + $scope.usuariotrans);
						});
						$scope.transferenciabuena = true;
						$timeout(function () {
							$scope.transferenciabuena = false;
					}, 3000);
						
				});
			$scope.saldo= ''
		};
	});


