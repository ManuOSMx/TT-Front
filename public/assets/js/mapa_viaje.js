var map, geolocationControl;

function GetMapTrip() {
  //Initialize a map instance.
  map = new atlas.Map("tripMap", {
    view: "Auto",

    //Add authentication details for connecting to Azure Maps.
    authOptions: {
      //Use Azure Active Directory authentication.
      authType: "anonymous",
      clientId: "e6b6ab59-eb5d-4d25-aa57-581135b927f0", //Your Azure Maps client id for accessing your Azure Maps account.
      getToken: function (resolve, reject, map) {
        //URL to your authentication service that retrieves an Azure Active Directory Token.
        var tokenServiceUrl =
          "https://samples.azuremaps.com/api/GetAzureMapsToken";

        fetch(tokenServiceUrl)
          .then((r) => r.text())
          .then((token) => resolve(token));
      },

      //Alternatively, use an Azure Maps key. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
      authType: "subscriptionKey",
      subscriptionKey: "Ptq9tJErpQkEsSmLZ8kur4v2Mt-YULecLq9LiILSrtA",
    },
  });

  //Wait until the map resources are ready.
  map.events.add("ready", function () {
    map.controls.add(
      [
        //Optional. Add the map style control so we can see how the custom control reacts.
        new atlas.control.StyleControl(),

        //Add the geolocation control to the map.
        new atlas.control.GeolocationControl({
          style: "auto",
        }),
      ],
      {
        position: "top-right",
      }
    );
  });
}
