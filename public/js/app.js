angular.module('todo', [ 'ngSanitize','ui.bootstrap','ui.router'])
.filter('formatoMiles', function () {
    return function (input) {
        var exp = /(\d)(?=(\d{3})+(?!\d))/g;
        return String(input).replace(exp, '$1.');
    };
})


.config(function($stateProvider, $urlRouterProvider){
	
	$stateProvider
	
	.state('panel', {
		url: '/panel',
		controller: 'PanelCtrl',
		templateUrl: 'templates/panel.html'
	})

	.state('login', {
		url: '/login',
		controller: 'loginCtrl',
		templateUrl: 'templates/login.html'
	})

	.state('panel.inicio', {
		url: '/inicio',
		controller: 'PanelCtrl',
		templateUrl: 'templates/inicio.html'
	})

	.state('panel.retirar', {
		url: '/retirar',
		controller: 'PanelCtrl',
		templateUrl: 'templates/retirar.html'
	})

	.state('panel.depositar', {
		url: '/depositar',
		controller: 'PanelCtrl',
		templateUrl: 'templates/depositar.html'
	})

	.state('panel.consultarsaldo', {
		url: '/inicio',
		controller: 'PanelCtrl',
		templateUrl: 'templates/inicio.html'
	})

	.state('panel.transferirsaldo', {
		url: '/inicio',
		controller: 'PanelCtrl',
		templateUrl: 'templates/inicio.html'
	})

	.state('panel.vermovimientossaldo', {
		url: '/movimientos',
		controller: 'InvoiceCtrl',
		templateUrl: 'templates/movimientos.html'
	})

	.state('panel.invoice', {
		url: '/invoice',
		controller: 'InvoiceCtrl',
		templateUrl: 'templates/invoice.html'
	})

	.state('panel.transferir', {
		url: '/transferir',
		controller: 'InvoiceCtrl',
		templateUrl: 'templates/transferir.html'
	})
	

	$urlRouterProvider.otherwise('login')

})

