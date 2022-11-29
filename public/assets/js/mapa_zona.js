const API = "https://tt-api-server.azurewebsites.net/map-api";

var markersPlaces = [];
/* Define async function */
async function getPlaceData() {
  const response = await fetch(API);
  const data = await response.json();
  // foreach loop to get all the data
  data.places.forEach((place) => {
    //Has myRadius and category value.
    let category_type;
    if (place.sentiment == "positive") {
      category_type = "positivo";
    } else if (place.sentiment == "negative") {
      category_type = "negativo";
    } else {
      category_type = "neutral";
    }
    // add data to markersPlaces
    markersPlaces.push(
      new atlas.data.Feature(
        new atlas.data.Point([Number(place.latitude), Number(place.longitude)]),
        {
          myRadius: 20,
          category: category_type,
          title: `Información: ${place.name}`,
          place: place.name,
          analysis: category_type,
          place_hashtag: "#" + place.hashtag,
          no_rates: no_rates,
          createDate: new Date(),
          url: "https://twitter.com/hashtag/" + place.hashtag,

          popupTemplate: {
            content: [
              {
                propertyPath: "createDate",
                label: "Fecha Actualizada",
              },
              {
                propertyPath: "place_hashtag",
                label: "Hashtag",
              },
              {
                propertyPath: "analysis",
                label: "Valoración Promedio",
              },
              {
                propertyPath: "no_rates",
                label: "Numero de Valoraciones",
              },
              {
                propertyPath: "url",
                label: "Opiniones en Twitter",
                hyperlinkFormat: {
                  label: "¡Ver!",
                  target: "_blank",
                },
              },
              {
                propertyPath: "url",
                label: "Code samples",
                hideLabel: true,
                hyperlinkFormat: {
                  label: "¡Visitar!",
                  target: "_blank",
                },
              },
            ],
          },
        }
      )
    );
  });
  // load the information in the map
  datasource.add(markersPlaces);
  return data;
}

async function searchHashtag(city_name) {
  const response = await fetch(API);
  const data = await response.json();
  data.places.forEach((place) => {
    if (place.city == city_name) {
      console.log("Hashtag encontrado:" + place.hashtag);
      return place.hashtag;
    }
  });
}
// Estructura Hashtag: #ttpenadebernal

var map, datasource;
// Tequisquiapan

var place_positon = [-99.88828, 20.5223];
// Santiago de Querétaro
var center_Queretaro = [-100.38333, 20.6];
var place_name = "Tequisquiapan";
var no_rates = 20;

var exampleData2 = [
  new atlas.data.Feature(new atlas.data.Point(center_Queretaro), {
    myRadius: 20,
    category: "neut",
    title: `Información: ${place_name}`,
    place: place_name,
    analysis: "positive",
    place_hashtag: "#tttequisquiapan",
    no_rates: no_rates,
    createDate: new Date(),
    url: "https://google.com",

    popupTemplate: {
      content: [
        {
          propertyPath: "createDate",
          label: "Fecha Actualizada",
        },
        {
          propertyPath: "place_hashtag",
          label: "Hashtag",
        },
        {
          propertyPath: "analysis",
          label: "Valoración Promedio",
        },
        {
          propertyPath: "no_rates",
          label: "Numero de Valoraciones",
        },
        {
          propertyPath: "url",
          label: "Code samples",
          hideLabel: true,
          hyperlinkFormat: {
            label: "¡Visitar!",
            target: "_blank",
          },
        },
      ],
    },
  }),
];

function GetMap() {
  //Initialize a map instance.
  map = new atlas.Map("myMap", {
    center: place_positon,
    zoom: 8,
    view: "Auto",

    //Add authentication details for connecting to Azure Maps.
    authOptions: {
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
    let ciudad = "Peña de Bernal";
    searchHashtag(ciudad);
    //Create a data source and add it to the map.
    datasource = new atlas.source.DataSource();
    map.sources.add(datasource);

    //Create a layer that defines how to render the points on the map.
    var layer = new atlas.layer.BubbleLayer(datasource);
    map.layers.add(layer);

    //Create a popup but leave it closed so we can update it and display it later.
    popup = new atlas.Popup();

    //Add a click event to the layer.
    map.events.add("click", layer, showPopup);

    function showPopup(e) {
      if (e.shapes && e.shapes.length > 0) {
        var properties = e.shapes[0].getProperties();

        popup.setOptions({
          //Update the content of the popup.
          content: atlas.PopupTemplate.applyTemplate(
            properties,
            properties.popupTemplate
          ),

          //Update the position of the popup with the pins coordinate.
          position: e.shapes[0].getCoordinates(),
        });

        //Open the popup.
        popup.open(map);
      }
    }

    //Load the test data.
    getPlaceData();

    console.log(markersPlaces);

    //Create a layer that defines how to render the shapes in the data source and add it to the map.
    map.layers.add(
      new atlas.layer.BubbleLayer(datasource, null, {
        //Define an expression to match on the category property and assign a value based on its color.
        color: [
          "match",
          ["get", "category"],
          "positivo",
          "Green",
          "negativo",
          "Red",
          "neutral",
          "Orange",

          //Specify a default color if no match found.
          "red",
        ],

        //Define an expression that checks to see if a custom property is defined on a feature, and if it is, use it as the setting for the radius.
        radius: [
          "case",
          //Check to see if the feature has a myRadius property.
          ["has", "myRadius"],
          ["get", "myRadius"],

          //Specify a default radius if the feature doesn't have a myRadius property.
          10,
        ],
      })
    );
  });
}
