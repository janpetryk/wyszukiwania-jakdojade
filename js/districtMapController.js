(function () {
    var app = angular.module("wyszukiwania-jakdojade");
    app.controller("districtMapController", function ($scope) {
        var self = this;
        var districtsMap;
        var currentInfoWindow;

        self.districtPolygons = {};

        self.districts = districts;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;

        function mapToPoint(elem) {
            return {lat: elem.latitude, lng: elem.longitude};
        }

        function init() {
            initPolygons();

            var origin = new google.maps.LatLng(51.126628, 17.036127);

            districtsMap = new google.maps.Map(document.getElementById('districts-map'), {
                mapTypeId: 'roadmap',
                center: origin,
                zoom: 13,
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
                    id: d.id,
                    name: d.name,
                    points: d.polygonPoints.map(mapToPoint)
                };
            });

            angular.forEach(districtPolygons, function (elem) {
                // Construct the polygon.
                var polygon = new google.maps.Polygon({
                    paths: elem.points,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.4,
                    strokeWeight: 0,
                    fillColor: '#FF0000',
                    fillOpacity: 0.0
                });
                polygon.name = elem.name;
                self.districtPolygons[elem.id] = polygon;

                polygon.setMap(districtsMap);
                // polygon.hide();

                google.maps.event.addListener(polygon, 'click', function (event) {
                    self.selectedPolygon = polygon;
                    $scope.$apply();
                });
                google.maps.event.addListener(polygon, 'mouseover', function () {
                    self.selectedPolygon = polygon;
                    this.setOptions({fillOpacity: 0.35, strokeWeight: 2});
                    $scope.$apply();
                });
                google.maps.event.addListener(polygon, 'mouseout', function () {
                    polygon.hide();
                    this.setOptions({fillOpacity: 0, strokeWeight: 0});
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

        function initPolygons() {
            google.maps.Polygon.prototype._visible = true;

            google.maps.Polygon.prototype.hide = function () {
                if (this._visible) {
                    this._visible = false;
                    this._strokeOpacity = this.strokeOpacity;
                    this._fillOpacity = this.fillOpacity;
                    this.strokeOpacity = 0;
                    this.fillOpacity = 0;
                    this.setMap(districtsMap);
                }
            }

            google.maps.Polygon.prototype.show = function () {
                if (!this._visible) {
                    this._visible = true;
                    this.strokeOpacity = this._strokeOpacity;
                    this.fillOpacity = this._fillOpacity;
                    this.setMap(districtsMap);
                }
            }
        }

    });

})();