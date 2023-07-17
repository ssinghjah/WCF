function initMap() {    
  const dc = new google.maps.LatLng(38.906624, -77.065774);
//  const parking1 = new google.maps.LatLng(38.8976095, -77.0544204);
//  const parking2 = new google.maps.LatLng(38.8498907, -77.0546018);
//  const acco1 = new google.maps.LatLng(38.894771, -77.093290);
//  const acco2 = new google.maps.LatLng(38.854771, -77.013290);
//  const parking1Nav = "https://www.google.com/maps/dir//2400+Virginia+Ave+NW,+Washington,+DC+20037/@38.8976095,-77.0544204,17z/"
//  const parking2Nav = "https://www.google.com/maps/dir//2611+S+Clark+St,+Arlington,+VA+22202/@38.8498907,-77.0546018,17z/"
  const markerMap = new google.maps.Map(document.getElementById("map"), {
    center: dc,
    zoom: 15,
  });

  const iconBase =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/";

  const icons = {
    parking: iconBase + "parking_lot_maps.png",
    library: iconBase + "library_maps.png",
    info: iconBase + "info-i_maps.png"
  };

//const iconBase =
//    "http://localhost:3000/";
//
//  const icons = {
//    parking: iconBase + "parking.png",
//    library: iconBase + "library_maps.png",
//    info: iconBase + "info-i_maps.png"
//  };

   $.post( "http://localhost:3000/getdata", function(data) {
	    console.log(data);
	    addMapMarkers(data, icons, markerMap);
	});

//  const features = [
//    {
//      position: parking1,
//      type: "parking",
//      infoWindow: '<div class="popUp">' +  [
//          "<strong>PMI Parking Garage 1</strong>",
//            "Total spots: 100",
//            "Cost per day: $14",
//            "Address: 2400 Virginia Ave., NW location",
//	  '<a href="' + parking1Nav + '"' + 'target="_blank">Navigate</a>'
//          ].join("<br>") + "</div>"
//    },
//     {
//      position: parking2,
//      type: "parking",
//      infoWindow: '<div class="popUp">' +  [
//            "<strong>PMI Parking Garage 2</strong>",
//            "Total spots: 200",
//            "Cost per day: $14",
//          "Address: 2611 South Clark Street, Arlington, VA",
//	 '<a href="' + parking2Nav + '"' + 'target="_blank">Navigate</a>'
//          ].join("<br>") + "</div>"
//    },
//    {
//      position: acco1,
//      type: "library",
//      infoWindow:'<div class="popUp">' +  [
//            "<strong>Acoomodation 1</strong>",
//            "Total rooms: 35",
//            "Cost per day: $85",
//            "Address: 123 Street"
//          ].join("<br>") + "</div>"
//    },
//    {
//      position: acco2,
//      type: "library",
//      infoWindow: '<div class="popUp">' + [
//            "<strong>Acoomodation 2</strong>",
//            "Total rooms: 45",
//            "Cost per day: $95",
//            "Address: 445 Street"
//          ].join("<br>") + "</div>"
//    }
//  ];

  // Create markers.
//  for (let i = 0; i < features.length; i++)
//  {
//    addMarker(features[i], icons[features[i].type].icon, map    )
//  }
}
function addMapMarkers(data, icons, markerMap){
 for (var i=0; i < data.values.length; i++)
 {
    addMarker(data.headers, data.values[i], icons, markerMap);
 }
}

//
//function addParkingIcon(lat,lon,){
//}
//
//function addAccoIcon(){
//
//}
//
//function addMetroIcon(){
//}

var ToDisplay = ["Name", "Address", "Cost", "Distance to the Mall", "Nearest Exit from VA", "Nearest Exit from MD", "Website", "Navigate_URL"];
var HyperLinks = ["Navigate_URL", "Website"];

function addMarker(infoHeaders, infoValues, icons, markerMap){
    var latIndex = infoHeaders.indexOf("Lat");
    var lngIndex = infoHeaders.indexOf("Lng");

    var lat = Number(infoValues[latIndex]);
    var lng = Number(infoValues[lngIndex]);

    var markerPosition = new google.maps.LatLng(lat, lng);
    
    var infoHTML = "";
    var numHeaders = infoHeaders.length;

    for (var i = 0; i < ToDisplay.length; i++)
    {
        var header = ToDisplay[i];
        var headerIndex = $.inArray(header, infoHeaders);
        if (headerIndex !== -1)
        {
            var info = infoValues[headerIndex];
            if($.inArray(header, HyperLinks) !== -1)
            {
                infoHTML += '<strong><a href = "' + info + '" target="_blank"> ' + header + ' </a></strong><br>';
            }
            else
            {
                infoHTML += '<strong>' + header + '</strong>: ' + info + '<br> ';
            }
        }
    }
    var marker = new google.maps.Marker({
    position: markerPosition,
    icon: icons.parking,
    map: markerMap});

    var coordInfoWindow = new google.maps.InfoWindow({pixelOffset: new google.maps.Size(0, -25)});
      coordInfoWindow.setContent(infoHTML);
      coordInfoWindow.setPosition(markerPosition);
      marker.addListener("click", () =>
      {
            coordInfoWindow.open({anchor: marker, map});
            $("#sideInfo").empty();
            $("#sideInfo").html(infoHTML);
      });

      $("#parkingList").append(infoHTML + "<br>")
}

function addMarkerV1(markerFeature, markerIcon, markerMap){
    // features = lat, lon, type
    // info window = Name, Other Properties
     var marker = new google.maps.Marker({
      position: markerFeature.position,
      icon: markerIcon,
      map: markerMap,});

      var coordInfoWindow = new google.maps.InfoWindow({pixelOffset: new google.maps.Size(0, -25)});
      coordInfoWindow.setContent(markerFeature.infoWindow);
      coordInfoWindow.setPosition(markerFeature.position);
      marker.addListener("click", () =>
      {
            coordInfoWindow.open({anchor: marker, map});
      });
}

function makeInfoWindowEvent(map, infowindow, marker) {
  google.maps.event.addListener(marker, 'click', function() {
       infowindow.open(map, marker);
  });
}

const TILE_SIZE = 256;

function createInfoWindowContent(latLng, zoom) {
  return [
    "PMI Parking",
    "Spots remaining: " + zoom,
    "Cost per day: " + zoom,
  ].join("<br>");
}

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng) {
  let siny = Math.sin((latLng.lat() * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);
  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng() / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  );
}

function toggleView(elem){
    var current_state = $(elem).data("state");
    if (current_state == "map")
    {
        $(elem).data("state", "list");
        $(elem).text("View Map");
        $("#map").hide();
        $("#list").show();
    }
    else if(current_state == "list")
    {
        $(elem).data("state", "map");
        $(elem).text("View List");
        $("#map").show();
        $("#list").hide();
    }
}

window.initMap = initMap;

$(function()
{

	$("#viewToggle").data("state", "map");
	$("#viewToggle").click(function(){
	    toggleView(this);
	})
})

