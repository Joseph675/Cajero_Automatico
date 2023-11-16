angular.module('todo')

  .controller('loginCtrl', function ($scope, $state, $http, $timeout) {

    $scope.mostrarusuarios = function Login(email, password) {
      var email = $scope.email;
      var password = $scope.password;

      $http.get('/login?email=' + email + '&password=' + password)
        .then(function (response) {
          var result = response.data;

          if (result.length > 0) {
            u = result[0];
            localStorage.USER = JSON.stringify(result[0]);


            let saldocajero;
            do {
              // Math.random() genera un número aleatorio entre 0 (inclusive) y 1 (exclusivo)
              // Multiplicamos por (1000000 - 1000) para obtener un rango de 0 a 999000
              // Sumamos 1000 para desplazar el rango a 1000 a 1000000
              // Math.floor() redondea hacia abajo al número entero más cercano
              // Dividimos por 1000 y luego multiplicamos por 1000 para asegurar que el número sea múltiplo de 1000
              saldocajero = Math.floor((Math.random() * (1000000 - 1000) + 1000) / 1000) * 1000;
            } while (saldocajero < 1000 || saldocajero > 1000000);



            let denominaciones = [100000, 50000, 20000, 10000, 5000, 2000, 1000];
            let billetes = {};
            let saldoxbilletes = saldocajero;

            for (let i = 0; i < denominaciones.length; i++) {
              // Calcula cuántos billetes de esta denominación caben en el saldo
              let cantidad = Math.floor(saldoxbilletes / denominaciones[i]);

              // Elige un número aleatorio de billetes de esta denominación
              cantidad = Math.floor(Math.random() * (cantidad + 1));

              // Si aún queda saldo y la denominación actual es la más pequeña (1000),
              // entonces usa todos los billetes necesarios de esa denominación para agotar el saldo
              if (saldoxbilletes > 0 && denominaciones[i] == 1000) {
                cantidad = Math.floor(saldoxbilletes / denominaciones[i]);
              }

              // Agrega los billetes a la cuenta
              billetes[denominaciones[i]] = cantidad;

              // Resta el valor de estos billetes del saldo
              saldoxbilletes -= cantidad * denominaciones[i];
            }
              billetes_100000 = billetes[100000],
              billetes_50000 = billetes[50000],
              billetes_20000 = billetes[20000],
              billetes_10000 = billetes[10000],
              billetes_5000 = billetes[5000],
              billetes_2000 = billetes[2000],
              billetes_1000 = billetes[1000]
            var data = {
              saldocajero,
              billetes_100000,
              billetes_50000,
              billetes_20000,
              billetes_10000,
              billetes_5000,
              billetes_2000,
              billetes_1000
            };
            $http.post('/insertarcajero', data)
              .then(function (response) {

                console.log('Saldo cajero insertado');
                $state.go("panel.inicio");
              }, function (error) {
                console.log('Saldo cajero no se pudo insertar', error);
              });
          } else {

            console.log("Usuario malo")
            $scope.noexiste = true;
            $timeout(function () {
              $scope.noexiste = false;
            }, 3000);
          }
        });
    }

    $scope.USER = JSON.parse(localStorage.getItem('USER'));

    $scope.insertarusuarios = function (email) {
      email = $scope.email
      $http.get('/verifiuser?email=' + email)
        .then(function (response) {
          var result = response.data;
          if (result.length > 0) {

            $scope.existe = true;
            
            $timeout(function () {
              $scope.existe = false;
            }, 3000);

          } else {
            if (email == "") {
              console.log("mail vacio")
            } else {

              //Generar numero_cuenta
              let numero_cuenta = '';
              for (let i = 0; i < 16; i++) {
                numero_cuenta += Math.floor(Math.random() * 10);
              }

              //Generar cvv
              let cvv = '';
              for (let i = 0; i < 3; i++) {
                cvv += Math.floor(Math.random() * 10);
              }

              //Generar fecha_expira
              let fechaActual = new Date();
              let año = fechaActual.getFullYear();
              let mes = fechaActual.getMonth() + 1;

              // Añade 3 años a la fecha actual
              año += 3;

              // Asegura que el mes siempre tenga dos dígitos
              if (mes < 10) {
                mes = '0' + mes;
              }

              fecha_expira = mes + "/" + año

              //Generar saldo_usuario
              let saldo;
              do {
                // Math.random() genera un número aleatorio entre 0 (inclusive) y 1 (exclusivo)
                // Multiplicamos por (1000000 - 5000) para obtener un rango de 0 a 995000
                // Sumamos 5000 para desplazar el rango a 5000 a 1000000
                // Math.floor() redondea hacia abajo al número entero más cercano
                saldo = Math.floor(Math.random() * (1000000 - 1000) + 1000);
              } while (saldo < 1000 || saldo > 1000000);

              var data = {
                nombre: $scope.nombre,
                email: $scope.email,
                password: $scope.password,
                pin: $scope.pin,
                numero_cuenta,
                cvv,
                fecha_expira,
                saldo
              };

              $http.post('/insertarusuario', data)
                .then(function (response) {

                  $scope.insertado = true;
                  // Después de 5 segundos, oculta la imagen.
                  $timeout(function () {
                    $scope.insertado = false;
                  }, 3000);

                  console.log('Estudiante insertado');

                  $scope.nombre = "",
                    $scope.email = "",
                    $scope.password = "",
                    $scope.pin = "",
                    numero_cuenta = "",
                    cvv = "",
                    fecha_expira = "",
                    saldo = "";

                }, function (error) {
                  console.log('Estudiante no se pudo insertar', error);
                });


            }
          }
        });
    }


  });