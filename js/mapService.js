(function () {
    var app = angular.module("wyszukiwania-jakdojade");
    app.service("mapService", function () {

        this.initMap = function(id){
            var origin = new google.maps.LatLng(51.109083, 17.039550);

            var map =  new google.maps.Map(document.getElementById(id), {
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


            var outerBorder = new google.maps.Polyline({
                path: outer.map(mapToPoint),
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 1
            });

            outerBorder.setMap(map);

            return map;


        }

        function mapToPoint(elem) {
            return {lat: elem.latitude, lng: elem.longitude};
        }
    })
})()