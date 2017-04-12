(function () {
    var app = angular.module("wyszukiwania-jakdojade");
    app.controller("heatmapController", function ($scope, mapService) {
        var self = this;
        var stopsMap;
        var heatmap;
        var currentInfoWindow;
        var markers = {};
        var lines = [];
        var colors = ["#67000d", "#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272", "#fcbba1", "#fee0d2", "#fff5f0", "#FFFFFF"];

        self.stops = stopPointSearch;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;

        function init() {
            stopsMap = mapService.initMap('heat-map', 14);
            heatmap = new HeatmapOverlay(stopsMap,
                {
                    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
                    "radius": 0.0025,
                    "maxOpacity": 0.4,
                    // scales the radius based on map zoom
                    "scaleRadius": true,
                    // if set to false the heatmap uses the global maximum for colorization
                    // if activated: uses the data maximum within the current map boundaries
                    //   (there will always be a red spot with useLocalExtremas true)
                    "useLocalExtrema": false,
                    // which field name in your data represents the latitude - default "lat"
                    latField: 'lat',
                    // which field name in your data represents the longitude - default "lng"
                    lngField: 'lng',
                    // which field name in your data represents the data value - default "value"
                    valueField: 'count'
                }
            );


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

        function showMarkers() {
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
            var data = self.selectedItem.stopPointSearchList.map(function (item) {
                return {
                    lng: item.lng,
                    lat: item.lat,
                    count: item.searchCount
                }

            });

            heatmap.setData({max : data[0].count / 2, data: data});

            hideOtherMarkers(stop.stopInformation.id);
            // drawLineToMostFrequentStops(stop);

        }

        function onStopUnselect() {
            self.searchBoxSelectedItem = null;
            heatmap.setData({data: []});

            showMarkers();
            // clearLines();
            // closeInfoWindow();
        }

        function createMarker(stop) {

            var placeLoc = new google.maps.LatLng(stop.stopInformation.latitude, stop.stopInformation.longitude);
            var marker = new google.maps.Marker({
                map: stopsMap,
                position: placeLoc,
                icon: {
                    url: "icons/method-draw-image.svg",
                    scaledSize: new google.maps.Size(22, 35)

                }

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
            stop.mostFrequentStopSearchInformationList.forEach(function (elem, index) {
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