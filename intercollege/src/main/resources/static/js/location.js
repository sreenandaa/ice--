const locationButton =
    document.getElementById("locationButton");


locationButton.addEventListener(
    "click",
    getUserLocation
);


function getUserLocation() {

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by your browser."
        );

        return;
    }


    locationButton.textContent =
        "Getting location...";


    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);


            locationButton.textContent =
                "📍 Location Found";


            // Distance calculation will be added later.

        },

        error => {

            console.error(error);

            locationButton.textContent =
                "📍 Use My Location";

            alert(
                "Location access was denied. You can still search manually."
            );

        }

    );
}