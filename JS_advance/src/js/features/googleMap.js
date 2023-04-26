/* eslint-disable no-undef */
export function initMap() {
  const dnipro = { lat: 48.464, lng: 35.046 };
  const map = new google.maps.Map(document.querySelector('.contact-us__map'),
    {
      zoom: 11,
      center: dnipro,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      }
    }
  );
  const infoWindow = new google.maps.InfoWindow();

  try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infoWindow.open(map);
        map.setCenter(pos);
      });
    } else {
      infoWindow.open(map);
    }
  } catch (error) {
    console.log(error);
  } 
}
