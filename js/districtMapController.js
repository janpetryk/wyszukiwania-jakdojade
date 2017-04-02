(function () {
    var app = angular.module("wyszukiwania-jakdojade");
    app.controller("districtMapController", function ($scope, mapService) {
        var self = this;
        var districtsMap;

        var colors = ["#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272", "#fcbba1", "#fee0d2", "#fff5f0", "#FFFFFF"];
        var selectedColor = "#9ecae1";
        self.districtPolygons = {};

        self.districts = districts;
        self.outer = outer;

        function mapToPoint(elem) {
            return {lat: elem.latitude, lng: elem.longitude};
        }

        function init() {
            districtsMap = mapService.initMap("districts-map", 12);

            var districtPolygons = self.districts.map(function (d) {
                return {
                    id: d.district.id,
                    name: d.district.name,
                    points: d.district.polygonPoints.map(mapToPoint),
                    mostFrequentSearches: d.mostFrequentDistrictSearchInformations
                };
            });

            angular.forEach(districtPolygons, function (elem) {
                var polygon = new google.maps.Polygon({
                    paths: elem.points,
                    strokeColor: selectedColor,
                    strokeOpacity: 0.4,
                    strokeWeight: 0,
                    fillColor: selectedColor,
                    fillOpacity: 0.0
                });
                polygon.name = elem.name;
                polygon.mostFrequentSearches = elem.mostFrequentSearches;
                self.districtPolygons[elem.id] = polygon;

                polygon.setMap(districtsMap);

                google.maps.event.addListener(polygon, 'click', function (event) {
                    self.selectedPolygon = polygon;
                    $scope.$apply();
                });
                google.maps.event.addListener(polygon, 'mouseover', function () {
                    self.selectedPolygon = polygon;
                    polygon.setOptions({
                        fillOpacity: 0.35,
                        strokeWeight: 2,
                        fillColor: selectedColor,
                        strokeColor: selectedColor

                    });
                    angular.forEach(elem.mostFrequentSearches, function (e, i) {
                        self.districtPolygons[e.endDistrictId].setOptions({
                            fillOpacity: 0.7,
                            strokeWeight: 2,
                            strokeColor: colors[i],
                            fillColor: colors[i]
                        });
                    });

                    $scope.$apply();
                });
                google.maps.event.addListener(polygon, 'mouseout', function () {
                    polygon.setOptions({fillOpacity: 0, strokeWeight: 0});
                    angular.forEach(elem.mostFrequentSearches, function (e) {
                        self.districtPolygons[e.endDistrictId].setOptions({fillOpacity: 0, strokeWeight: 0});
                    });
                    $scope.$apply();
                });
            })
        }

        init();

    });

})();