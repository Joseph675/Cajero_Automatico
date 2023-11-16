angular.module('todo')

	.controller('PrincipalCtrl', function ($scope, $state) {


	})

	.controller('PanelCtrl', function ($scope, $timeout, $state, $http) {
		$scope.USER = JSON.parse(localStorage.USER);

		numeroDeCuenta = $scope.USER.numero_cuenta
		id_usuario = $scope.USER.id_usuario


		$scope.mostrarcuenta = function () {
			let numeroFormateado = '';
			let i = 0;
			while (i < numeroDeCuenta.length) {
				if (i > 0 && i % 4 === 0) {
					numeroFormateado += ' ';
				}
				numeroFormateado += numeroDeCuenta[i];
				i++;
			}
			$scope.numeroDeCuenta = numeroFormateado;
		}
		$scope.mostrarcuenta();

		//RETIRAR, CON TODO
		$scope.botonActivo = false;
		$scope.estiloActivo = {
			'background-color': 'black',
			'box-shadow': 'inset 0 0 10px rgb(0 0 0 / 40%), 0 0 9px 3px rgb(255 255 255 / 10%)'
		};


		$scope.contadorBotones = {
			'1000': 0,
			'2000': 0,
			'5000': 0,
			'10000': 0,
			'20000': 0,
			'50000': 0,
			'100000': 0,
		};

		// Modifica la función para incrementar el contador del botón correspondiente
		$scope.guardarValor = function (valor) {
			if ($scope.contadorBotones.hasOwnProperty(valor)) {
				$scope.contadorBotones[valor]++;
				console.log('Valor ' + valor + ' presionado ' + $scope.contadorBotones[valor] + ' veces');
				$scope.calcularsuma();
			} else {
				console.log('El valor ' + valor + ' no corresponde a ningún botón');
			}
		};

		$scope.restarValor = function (valor) {
			if ($scope.contadorBotones.hasOwnProperty(valor) && $scope.contadorBotones[valor] > 0) {
				$scope.contadorBotones[valor]--;
				console.log('Valor ' + valor + ' restado, ahora lleva ' + $scope.contadorBotones[valor]);
				$scope.calcularsuma();
			} else {
				console.log('No se puede restar el valor ' + valor);
			}
		};

		$scope.calcularsuma = function () {
			billetes_100000 = $scope.contadorBotones[100000]
			billetes_50000 = $scope.contadorBotones[50000]
			billetes_20000 = $scope.contadorBotones[20000]
			billetes_10000 = $scope.contadorBotones[10000]
			billetes_5000 = $scope.contadorBotones[5000]
			billetes_2000 = $scope.contadorBotones[2000]
			billetes_1000 = $scope.contadorBotones[1000]


			sum100000 = billetes_100000 * 100000
			sum50000 = billetes_50000 * 50000
			sum20000 = billetes_20000 * 20000
			sum10000 = billetes_10000 * 10000
			sum5000 = billetes_5000 * 5000
			sum2000 = billetes_2000 * 2000
			sum1000 = billetes_1000 * 1000

			sumatotal = sum100000 + sum50000 + sum20000 + sum10000 + sum5000 + sum2000 + sum1000

			$scope.sumatotal = sumatotal
			console.log($scope.sumatotal)
		}

		$scope.verificarretirar = function () {

			billetes_100000 = $scope.contadorBotones[100000]
			billetes_50000 = $scope.contadorBotones[50000]
			billetes_20000 = $scope.contadorBotones[20000]
			billetes_10000 = $scope.contadorBotones[10000]
			billetes_5000 = $scope.contadorBotones[5000]
			billetes_2000 = $scope.contadorBotones[2000]
			billetes_1000 = $scope.contadorBotones[1000]


			$http.get('/verifisaldocajero')
				.then(function (response) {
					var result = response.data;
					if (result.length > 0) {
						saldocajero = result[0].saldocajero
						id_cajero = result[0].id

						if ($scope.sumatotal > saldocajero) {
							$scope.insuficiente = true;
							$timeout(function () {
								$scope.insuficiente = false;
							}, 3000);

						} else {


							console.log("LO QUE YO ENVIO")
							console.log($scope.sumatotal)
							console.log("------------------------------------------------------------------")

							console.log("BASE DE DATOS")
							console.log(result[0])
							console.log("------------------------------------------------------------------")

							var montoSolicitado = $scope.sumatotal;

							var denominaciones = [100000, 50000, 20000, 10000, 5000, 2000, 1000];
							var cantidadBilletes = [
								result[0].billetes_100000,
								result[0].billetes_50000,
								result[0].billetes_20000,
								result[0].billetes_10000,
								result[0].billetes_5000,
								result[0].billetes_2000,
								result[0].billetes_1000
							];

							var billetesUsados = Array(denominaciones.length).fill(0);

							for (var i = 0; i < denominaciones.length; i++) {
								while (montoSolicitado >= denominaciones[i] && cantidadBilletes[i] > 0) {
									montoSolicitado -= denominaciones[i];
									cantidadBilletes[i]--;
									billetesUsados[i]++;
								}
							}

							if (montoSolicitado === 0) {
								console.log('Es posible satisfacer la solicitud con los billetes disponibles.');

								$scope.busqueda = true;
								$scope.busqueda2 = false;

								for (var i = 0; i < denominaciones.length; i++) {
									console.log('Se usaron ' + billetesUsados[i] + ' billetes de ' + denominaciones[i]);
								}

								var billetesRestantes = {};
								for (var i = 0; i < denominaciones.length; i++) {
									billetesRestantes['billetes_' + denominaciones[i]] = cantidadBilletes[i];
								}

								console.log('Los billetes restantes son: ', billetesRestantes);
								$scope.resultadosrestabilletes = billetesRestantes
							} else {
								console.log('No es posible satisfacer la solicitud con los billetes disponibles.');
								$scope.busqueda2 = true;
								$scope.busqueda = false;

							}


						}


					} else {
						console.log("hola");

					}
				});





		}



		$scope.retirar = function (tipo_transaccion) {
			var cvv = $scope.cvv
			var pin = $scope.pin
			var numero_cuenta = numeroDeCuenta

			$scope.resultadosrestabilletes
			$scope.sumatotal


			console.log($scope.resultadosrestabilletes)

			console.log($scope.sumatotal)


			$http.get('/verifiuserretirar?cvv=' + cvv + '&pin=' + pin + '&numero_cuenta=' + numero_cuenta)
				.then(function (response) {
					var result = response.data;
					if (result.length > 0) {
						saldo = result[0].saldo
						saldonuevo = saldo + $scope.sumatotal
						$scope.saldousu = saldonuevo;


						var data = {
							saldo: saldonuevo
						};

						$http.post('/editarusu/' + id_usuario, data)
							.then(function (response) {
								console.log("saldo usaurio retirado")
							}, function (error) {

							});

						$http.get('/verifisaldocajero')
							.then(function (response) {
								var result = response.data;
								if (result.length > 0) {
									saldocajero = result[0].saldocajero
									id_cajero = result[0].id


									console.log(result[0])

									saldonuevocajero = saldocajero - $scope.sumatotal

									var billetes_100000 = $scope.resultadosrestabilletes.billetes_100000;
									var billetes_50000 = $scope.resultadosrestabilletes.billetes_50000;
									var billetes_20000 = $scope.resultadosrestabilletes.billetes_20000;
									var billetes_10000 = $scope.resultadosrestabilletes.billetes_10000;
									var billetes_5000 = $scope.resultadosrestabilletes.billetes_5000;
									var billetes_2000 = $scope.resultadosrestabilletes.billetes_2000;
									var billetes_1000 = $scope.resultadosrestabilletes.billetes_1000;


									var data2 = {
										saldocajero: saldonuevocajero,
										billetes_100000,
										billetes_50000,
										billetes_20000,
										billetes_10000,
										billetes_5000,
										billetes_2000,
										billetes_1000
									};

									$http.post('/editarsaldocajero/' + id_cajero, data2)
										.then(function (response) {
											console.log("saldo cajero retirado")
										}, function (error) {
											console.log(error)

										});


									let fecha_hoy = new Date();
									let dia = String(fecha_hoy.getDate()).padStart(2, '0');
									let mes = String(fecha_hoy.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
									let ano = fecha_hoy.getFullYear();

									let fecha = dia + '/' + mes + '/' + ano;

									//Generar numero_cuenta
									let numero_invoice = '';
									let i = 0;
									do {
										numero_invoice += Math.floor(Math.random() * 10);
										i++;
									} while (i < 8);
									saldo_transaccion = $scope.valorGuardado

									saldo_transaccion = saldo_transaccion || 0;

									saldo = saldonuevo;
									var data3 = {
										id_usuario,
										fecha,
										numero_invoice,
										tipo_transaccion,
										saldo,
										saldo_transaccion
									};

									$http.post('/insertarinvoice', data3)
										.then(function (response) {
											console.log('Invoice insertado');
											$state.go("panel.invoice")
										}, function (error) {
											console.log('Invoice no se pudo insertar', error);
										});

									$scope.cvv = "",
										$scope.pin = "",
										$scope.estiloActivo = {};
								} else {
									console.log("hola");

								}
							});



					} else {
						console.log("hola");

					}
				});


		}


		$scope.consignar = function (tipo_transaccion) {
			var cvv = $scope.cvv
			var pin = $scope.pin
			var numero_cuenta = numeroDeCuenta

			billetes_100000 = $scope.contadorBotones[100000]
			billetes_50000 = $scope.contadorBotones[50000]
			billetes_20000 = $scope.contadorBotones[20000]
			billetes_10000 = $scope.contadorBotones[10000]
			billetes_5000 = $scope.contadorBotones[5000]
			billetes_2000 = $scope.contadorBotones[2000]
			billetes_1000 = $scope.contadorBotones[1000]

			sum100000 = billetes_100000 * 100000
			sum50000 = billetes_50000 * 50000
			sum20000 = billetes_20000 * 20000
			sum10000 = billetes_10000 * 10000
			sum5000 = billetes_5000 * 5000
			sum2000 = billetes_2000 * 2000
			sum1000 = billetes_1000 * 1000

			sumatotal = sum100000 + sum50000 + sum20000 + sum10000 + sum5000 + sum2000 + sum1000

			console.log(sumatotal)

			$http.get('/traerusuario?id_usuario=' + id_usuario)
				.then(function (response) {
					var result = response.data;
					if (result.length > 0) {
						saldo_usu = result[0].saldo
						console.log(saldo_usu);

						console.log(saldo_usu, " ", sumatotal)

						if (saldo_usu > sumatotal) {
							console.log("tienes dinero para depositar")

							$http.get('/verifiuserretirar?cvv=' + cvv + '&pin=' + pin + '&numero_cuenta=' + numero_cuenta)
								.then(function (response) {
									var result = response.data;
									if (result.length > 0) {
										saldo = result[0].saldo
										saldonuevo = saldo - sumatotal

										$scope.saldousu = saldonuevo;

										console.log(saldonuevo)

										var data = {
											saldo: saldonuevo
										};

										$http.post('/editarusu/' + id_usuario, data)
											.then(function (response) {
												console.log("saldo usaurio retirado")
											}, function (error) {

											});

										$http.get('/verifisaldocajero')
											.then(function (response) {
												var result = response.data;
												if (result.length > 0) {
													saldocajero = result[0].saldocajero
													id_cajero = result[0].id


													console.log(result[0])


													billetes_100000 = result[0].billetes_100000 + billetes_100000
													billetes_50000 = result[0].billetes_50000 + billetes_50000
													billetes_20000 = result[0].billetes_20000 + billetes_20000
													billetes_10000 = result[0].billetes_10000 + billetes_10000
													billetes_5000 = result[0].billetes_5000 + billetes_5000
													billetes_2000 = result[0].billetes_2000 + billetes_2000
													billetes_1000 = result[0].billetes_1000 + billetes_1000




													saldonuevocajero = saldocajero + sumatotal

													var data2 = {
														saldocajero: saldonuevocajero,
														billetes_100000,
														billetes_50000,
														billetes_20000,
														billetes_10000,
														billetes_5000,
														billetes_2000,
														billetes_1000
													};

													$http.post('/editarsaldocajero/' + id_cajero, data2)
														.then(function (response) {
															console.log("saldo cajero retirado")
														}, function (error) {
															console.log(error)

														});


													let fecha_hoy = new Date();
													let dia = String(fecha_hoy.getDate()).padStart(2, '0');
													let mes = String(fecha_hoy.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
													let ano = fecha_hoy.getFullYear();

													let fecha = dia + '/' + mes + '/' + ano;

													//Generar numero_cuenta
													let numero_invoice = '';
													for (let i = 0; i < 8; i++) {
														numero_invoice += Math.floor(Math.random() * 10);
													}
													saldo_transaccion = $scope.valorGuardado

													saldo_transaccion = saldo_transaccion || 0;

													saldo = saldonuevo;
													var data3 = {
														id_usuario,
														fecha,
														numero_invoice,
														tipo_transaccion,
														saldo,
														saldo_transaccion
													};

													$http.post('/insertarinvoice', data3)
														.then(function (response) {
															console.log('Invoice insertado');
															$state.go("panel.invoice")
														}, function (error) {
															console.log('Invoice no se pudo insertar', error);
														});

													$scope.cvv = "",
														$scope.pin = "",
														$scope.estiloActivo = {};
												} else {
													console.log("hola");

												}
											});

									} else {
										console.log("hola");
									}
								});

						} else {
							console.log("no tienes dinero para depositar")
							$scope.insuficiente = true;
							$timeout(function () {
								$scope.insuficiente = false;
							}, 3000);
						}

					} else {
						console.log("hola");

					}
				});






		}



		$scope.invoice = function (tipo_transaccion) {


			$http.get('/traerusuario?id_usuario=' + id_usuario)
				.then(function (response) {
					var result = response.data;
					if (result.length > 0) {
						saldo_usu = result[0].saldo
						console.log(saldo_usu);

						let fecha_hoy = new Date();
						let dia = String(fecha_hoy.getDate()).padStart(2, '0');
						let mes = String(fecha_hoy.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
						let ano = fecha_hoy.getFullYear();

						let fecha = dia + '/' + mes + '/' + ano;


						//Generar numero_cuenta
						let numero_invoice = '';
						let i = 0;
						do {
							numero_invoice += Math.floor(Math.random() * 10);
							i++;
						} while (i < 8);

						saldo = saldo_usu


						saldo_transaccion = $scope.valorGuardado

						saldo_transaccion = saldo_transaccion || 0;

						var data = {
							id_usuario,
							fecha,
							numero_invoice,
							tipo_transaccion,
							saldo,
							saldo_transaccion
						};

						$http.post('/insertarinvoice', data)
							.then(function (response) {
								console.log('Invoice insertado');
								$state.go("panel.invoice")
							}, function (error) {
								console.log('Invoice no se pudo insertar', error);
							});

					} else {
						console.log("hola");

					}
				});





		}


	});


