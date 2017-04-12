(function () {
    var app = angular.module('wyszukiwania-jakdojade', ['ngMaterial', 'ngRoute']);

    app.config(function ($routeProvider) {
        $routeProvider

            .when('/about', {
                templateUrl: 'partials/about.html',
            })

            .when('/stops', {
                templateUrl: 'partials/stops.html',
                controller: 'stopMapController',
                controllerAs: 'ctrl'
            })
            .when('/districts', {
                templateUrl: 'partials/districts.html',
                controller: 'districtMapController',
                controllerAs: 'ctrl'
            })
            .when('/heatmap', {
                templateUrl: 'partials/heatmap.html',
                controller: 'heatmapController',
                controllerAs: 'ctrl'
            })
            .otherwise({templateUrl: 'partials/heatmap.html'})
    });


})();