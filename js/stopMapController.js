(function () {
    var app = angular.module("wyszukiwania-jakdojade");
    app.controller("stopMapController", function ($scope) {
        var self = this;
        var stopsMap;
        var currentInfoWindow;

        var markers = {};
        var lines = [];
        var colors = ["#67000d", "#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272","#fcbba1","#fee0d2","#fff5f0", "#FFFFFF"];

        self.stops = stops;
        self.districts = districts;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;

        function init() {
            var origin = new google.maps.LatLng(51.126628, 17.036127);

            stopsMap = new google.maps.Map(document.getElementById('stops-map'), {
                mapTypeId: 'roadmap',
                center: origin,
                zoom: 13,
                styles:[
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

            angular.forEach(self.stops, function (value) {
                createMarker(value);
            });

            self.selectedItem = self.stops.find(function (elem) {
                return "Galeria Dominikańska" === elem.stopInformation.name;
            });
        }


        function closeInfoWindow() {
            if (currentInfoWindow) {
                currentInfoWindow.close();
                currentInfoWindow = null;
            }
        }

        function showInfoWindow(stopInformation) {
            if (!currentInfoWindow) {
                var marker = markers[stopInformation.id];
                var content = '<strong style="font-size:1.2em">' + stopInformation.name + '</strong>' +
                    '<br/><strong>Id:</strong>' + stopInformation.id +
                    '<br/><strong>Latitude:</strong>' + stopInformation.latitude +
                    '<br/><strong>Longitude:</strong>' + stopInformation.longitude +
                    '<br/>';
                currentInfoWindow = new google.maps.InfoWindow();
                currentInfoWindow.setContent(content);
                currentInfoWindow.open(stopsMap, marker);
            }
        }

        function clearLines() {
            lines.forEach(function (elem) {
                elem.setMap(null);
            });
            lines.length = 0;
        }

        function hideMarkers() {
            Object.values(markers).forEach(function (elem) {
                elem.setVisible(true);
            })
        }

        function hideOtherMarkers(stopId) {
            Object.keys(markers).filter(function (elem) {
                return elem != stopId;
            }).forEach(function (elem) {
                markers[elem].setVisible(false);
            });
        }

        function onStopSelect(stop) {
            self.selectedItem = stop;
            hideOtherMarkers(stop.stopInformation.id);
            // showInfoWindow(stop.stopInformation);
            drawLineToMostFrequentStops(stop);

        }

        function onStopUnselect() {
            self.searchBoxSelectedItem = null;
            // self.selectedItem = null;
            hideMarkers();
            clearLines();
            closeInfoWindow();
        }

        function createMarker(stop) {

            var placeLoc = new google.maps.LatLng(stop.stopInformation.latitude, stop.stopInformation.longitude);
            var marker = new google.maps.Marker({
                map: stopsMap,
                position: placeLoc

            });
            markers[stop.stopInformation.id] = marker;

            google.maps.event.addListener(marker, 'mouseover', function () {
                if (!self.searchBoxSelectedItem) {
                    onStopSelect(stop);
                    $scope.$apply();
                }
            });


            google.maps.event.addListener(marker, 'mouseout', function () {
                if (!self.searchBoxSelectedItem) {
                    onStopUnselect();
                    $scope.$apply();
                }
            });


            var update_timeout = null;

            google.maps.event.addListener(stopsMap, 'click', function (event) {
                update_timeout = setTimeout(function () {
                    if (self.searchBoxSelectedItem) {
                        onStopUnselect();
                        $scope.$apply();
                    }
                }, 200);
            });

            google.maps.event.addListener(stopsMap, 'dblclick', function (event) {
                clearTimeout(update_timeout);
            });

            google.maps.event.addListener(marker, 'click', function () {
                if (self.searchBoxSelectedItem) {
                    onStopUnselect();
                } else {
                    selectedItemChange(stop);
                }
                $scope.$apply();
            });
        }

        function drawLineToMostFrequentStops(stop) {
            stop.mostFrequentSearchInformationList.forEach(function (elem, index) {
                lines.push(line(stop.stopInformation.latitude, stop.stopInformation.longitude, elem.endStop.latitude, elem.endStop.longitude, colors[index], 1 - (index) / 10));
            });
        }

        function line(lat1, lon1, lat2, lon2, color, opacity) {
            return new google.maps.Polyline({
                path: [
                    new google.maps.LatLng(lat1, lon1),
                    new google.maps.LatLng(lat2, lon2)
                ],
                strokeColor: color,
                strokeOpacity: opacity,
                strokeWeight: 5,
                map: stopsMap
            });
        }

        function querySearch(query) {
            return query ? self.stops.filter(function (item) {
                    return item.stopInformation.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
                }) : self.stops;
        }

        function selectedItemChange(item, searchText) {
            if (item) {
                onStopUnselect();
                onStopSelect(item);
                self.searchBoxSelectedItem = item;
            }

            if (!item && !searchText) {
                onStopUnselect();
            }
        }

        init();
    });

})();