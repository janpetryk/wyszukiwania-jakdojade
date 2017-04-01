(function () {
    var app = angular.module("wyszukiwania-jakdojade");
    app.controller("districtMapController", function ($scope) {
        var self = this;
        var districtsMap;
        var currentInfoWindow;

        var colors = ["#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272","#fcbba1","#fee0d2","#fff5f0", "#FFFFFF"];
        var selectedColor = "#9ecae1";
        self.districtPolygons = {};

        self.districts = districts;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;

        function mapToPoint(elem) {
            return {lat: elem.latitude, lng: elem.longitude};
        }

        function init() {
            var origin = new google.maps.LatLng(51.126628, 17.036127);

            districtsMap = new google.maps.Map(document.getElementById('districts-map'), {
                mapTypeId: 'roadmap',
                center: origin,
                zoom: 12,
                styles: [
                    {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels.text",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.business",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "labels.text",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    }
                ]
            });

            var districtPolygons = self.districts.map(function (d) {
                return {
                    id: d.district.id,
                    name: d.district.name,
                    points: d.district.polygonPoints.map(mapToPoint),
                    mostFrequentSearches: d.mostFrequentDistrictSearchInformations
                };
            });

            function show(polygon) {
                polygon.setOptions({fillOpacity: 0.35, strokeWeight: 2});
            }

            angular.forEach(districtPolygons, function (elem) {
                // Construct the polygon.
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
                // polygon.hide();

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
                        if (e.endDistrictId != elem.id) {
                            self.districtPolygons[e.endDistrictId].setOptions({
                                fillOpacity: 0.7,
                                strokeWeight: 2,
                                strokeColor: colors[i],
                                fillColor: colors[i]
                            });
                        }
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

        function closeInfoWindow() {
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
        }

        function showInfoWindow(stop) {
            var marker = markers[stop.id];
            var content = '<strong style="font-size:1.2em">' + stop.name + '</strong>' +
                '<br/><strong>Id:</strong>' + stop.id +
                '<br/><strong>Latitude:</strong>' + stop.latitude +
                '<br/><strong>Longitude:</strong>' + stop.longitude +
                '<br/>';
            closeInfoWindow();
            currentInfoWindow = new google.maps.InfoWindow();
            currentInfoWindow.setContent(content);
            currentInfoWindow.open(stopsMap, marker);
        }


        function querySearch(query) {
            return query ? self.stops.filter(function (item) {
                return item.stopInformation.name.toLowerCase().indexOf(query.toLowerCase()) === 0;
            }) : self.stops;
        }

        function selectedItemChange(item) {
            if (item) {
                showInfoWindow(item);
            }
        }

        function searchTextChange(newValue) {
            if (!newValue) {
                closeInfoWindow();
            }
        }

        init();

    });

})();