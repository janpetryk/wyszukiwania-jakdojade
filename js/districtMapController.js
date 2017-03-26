(function () {
    var app = angular.module("wyszukiwania-jakdojade", ["ngMaterial"]);
    app.controller("districtMapController", function ($scope) {
        var self = this;
        var stopsMap, districtsMap;
        var currentInfoWindow;

        var markers = {};

        self.districts = districts;
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;

        function init() {
            var origin = new google.maps.LatLng(51.126628, 17.036127);

            districtsMap = new google.maps.Map(document.getElementById('districts-map'), {
                mapTypeId: 'roadmap',
                center: origin,
                zoom: 13
            });

            var coords = self.districts.find(function (elem) {
                return "Świniary" === elem.name;
            }).polygonPoints.map(function (elem) {

                var newVar = {lat: elem.latitude, lng: elem.longitude};
                console.log(newVar);
                return newVar;
            });


            // Construct the polygon.
            var bermudaTriangle = new google.maps.Polygon({
                paths: coords,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });

            bermudaTriangle.setMap(districtsMap);

            angular.forEach(self.stops, function (value) {
                createMarker(value.stopInformation);
            });
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

        function createMarker(stop) {

            var placeLoc = new google.maps.LatLng(stop.latitude, stop.longitude);
            var marker = new google.maps.Marker({
                map: stopsMap,
                position: placeLoc

            });
            markers[stop.id] = marker;

            google.maps.event.addListener(marker, 'click', function () {
                // self.searchText = stop.name;
                showInfoWindow(stop);
            });
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