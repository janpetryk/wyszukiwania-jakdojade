(function () {
    var app = angular.module("wyszukiwania-jakdojade");
    app.controller("districtMapController", function ($scope, mapService) {
        var self = this;
        var districtsMap;

        var colors = ["#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272", "#fcbba1", "#fee0d2", "#fff5f0", "#FFFFFF"];
        var selectedColor = "#9ecae1";
        self.districtPolygons = {};

        self.districts = districts;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;

        function init() {
            districtsMap = mapService.initMap("districts-map", 12);

            angular.forEach(self.districts, function (d) {
                var polygon = new google.maps.Polygon({
                    paths: d.district.polygonPoints.map(mapToPoint),
                    strokeColor: selectedColor,
                    strokeOpacity: 0.4,
                    strokeWeight: 0,
                    fillColor: selectedColor,
                    fillOpacity: 0.0
                });
                polygon.name = d.district.name;
                polygon.mostFrequentSearches = d.mostFrequentDistrictSearchInformations;
                self.districtPolygons[d.district.id] = polygon;

                polygon.setMap(districtsMap);

                google.maps.event.addListener(polygon, 'mouseover', function () {
                    if (!self.searchBoxSelectedItem) {
                        onDistrictSelect(polygon);
                        $scope.$apply();
                    }
                });
                google.maps.event.addListener(polygon, 'mouseout', function () {
                    if (!self.searchBoxSelectedItem) {
                        onDistrictUnselect();
                        $scope.$apply();
                    }
                });

                google.maps.event.addListener(polygon, 'click', function () {
                    if (self.searchBoxSelectedItem) {
                        onDistrictUnselect();
                        onDistrictSelect(polygon);
                    } else {
                        selectedItemChange(d);
                    }
                    $scope.$apply();
                });

            })

            onDistrictSelect(Object.values(self.districtPolygons).find(function (elem) {
                return "Stare Miasto" === elem.name;
            }));
        }

        function querySearch(query) {
            return query ? self.districts.filter(function (item) {
                return item.district.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
            }) : self.districts;
        }


        function selectedItemChange(item, searchText) {
            if (item) {
                var selectedPolygon = self.districtPolygons[item.district.id];
                onDistrictUnselect(selectedPolygon);
                onDistrictSelect(selectedPolygon);
                self.searchBoxSelectedItem = item;
            }

            if (!item && !searchText) {
                onDistrictUnselect();
            }
        }

        function onDistrictUnselect() {
            angular.forEach(Object.values(self.districtPolygons), function (e) {
                e.setOptions({fillOpacity: 0, strokeWeight: 0});
            });
            self.searchBoxSelectedItem = null;
        }


        function onDistrictSelect(polygon) {
            self.selectedPolygon = polygon;
            polygon.setOptions({
                fillOpacity: 0.35,
                strokeWeight: 2,
                fillColor: selectedColor,
                strokeColor: selectedColor

            });
            angular.forEach(polygon.mostFrequentSearches, function (e, i) {
                self.districtPolygons[e.endDistrictId].setOptions({
                    fillOpacity: 0.7,
                    strokeWeight: 2,
                    strokeColor: colors[i],
                    fillColor: colors[i]
                });
            });
        }

        function mapToPoint(elem) {
            return {lat: elem.latitude, lng: elem.longitude};
        }


        init();

    });

})();