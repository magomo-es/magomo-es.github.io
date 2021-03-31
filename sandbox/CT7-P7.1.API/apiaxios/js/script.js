// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ONCLICK function =>

function selectColor() {

    const selectedColor = (document.getElementById("myColor").value).substring(1)

    const baseurl = 'https://www.thecolorapi.com/id';

    const params = '?format=json&hex=' + selectedColor;

    console.log('api url: '+baseurl + params);

    apiGetJsonClbk( baseurl + params, (dataapi) => {

        if ( dataapi ) {

            if ( !dataapi.code ) {

                // OK show => El nom del color escollit en un <h1> i el contingut JSON que ha generat la consulta en un <p>
                document.getElementById("elm_h1").innerHTML = "The name color is " + dataapi.name.value;
                document.getElementById("elm_p").innerHTML = JSON.stringify(dataapi);

            } else {

                // KO show => Que hi ha hagut un error en un <h1>
                document.getElementById("elm_h1").innerHTML = "API responds with error code " + dataapi.code;
                document.getElementById("elm_p").innerHTML = dataapi.message;

            }

        } else {

            document.getElementById("elm_h1").innerHTML = "An unexpected error occurred in the connection";
            document.getElementById("elm_p").innerHTML = "";            

        }

    } );

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ONCLICK function //

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - AJAX function =>

function apiGetJsonClbk( fullapilink, callbackfn ) {

    // Get One
    axios.get( fullapilink ).then(callbackfn);

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - AJAX function //