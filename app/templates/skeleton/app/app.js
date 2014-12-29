angular.module('<%= _.camelize(appname) %>', ['ui.bootstrap','ui.utils','<%= routerModuleName %>','ngAnimate']);
<% if (!uirouter) { %>
angular.module('<%= _.camelize(appname) %>').config(function($routeProvider) {

    /* Add New Routes Above */
    $routeProvider.otherwise({redirectTo:'/home'});

});
<% } %><% if (uirouter) { %>
angular.module('<%= _.camelize(appname) %>').config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    /* Add New States Above */
    $urlRouterProvider.otherwise('/home');

});
<% } %>
angular.module('<%= _.camelize(appname) %>').run(function($rootScope<% if(uirouter) { print(',$state,$stateParams'); } else { print(''); } %>) {

   <% if(uirouter) { print('$rootScope.$state=$state;\n$rootScope.$stateParams=$stateParams;'); } else { print(''); } %>


    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});
