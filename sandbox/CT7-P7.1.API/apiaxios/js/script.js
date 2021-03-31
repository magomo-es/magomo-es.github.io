// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ONCLICK selectColor =>

function selectColor() {

    const selectedColor = (document.getElementById("myColor").value).substring(1);

    const baseurl = 'https://www.thecolorapi.com/id';

    const params = '?format=json&hex=' + selectedColor;

    console.log('api url: '+baseurl + params);

    apiGetJsonClbk( baseurl + params, (dataapi) => {

        if ( dataapi.data ) {

            if ( !dataapi.data.code ) { inserElmData( "clr", "The name color is " + dataapi.data.name.value, JSON.stringify(dataapi.data) ); } 
            else { inserElmData( "clr", "API responds with error code " + dataapi.data.code, dataapi.data.message ); }

        } else {

            inserElmData( "clr", "An unexpected error occurred in the connection" + dataapi.data.code, "" );
        }

    } );

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ONCLICK selectColor //

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ONCLICK searchFarmacy =>

function searchFarmacy() {

    const searchByCP = document.getElementById("PostalCode").value;

    console.log('searchByCP: '+searchByCP+' / searchByCP.length: '+(searchByCP.length));

    const baseurl = 'https://analisi.transparenciacatalunya.cat/resource/f446-3fny.json';

    const params = (searchByCP.length) ? '?codi_postal=' + searchByCP : '';

    console.log('api url: '+baseurl + params);

    apiGetJsonClbk( baseurl + params, (dataapi) => {

        console.log(JSON.stringify(dataapi.data));

        if ( dataapi.data ) {

            if ( !dataapi.data.error ) { 
                
                let strListData = "", size = 0, key;

                for ( key in dataapi.data) { 
                    strListData += '<li style="padding: 5px 0;">' +
                        dataapi.data[key].nom_farmacia + ' - ' + 
                        dataapi.data[key].tipus_via + ' ' + 
                        dataapi.data[key].nom_via + ' ' + 
                        dataapi.data[key].num_via + ' - ' + 
                        dataapi.data[key].codi_postal + ' ' +
                        dataapi.data[key].nom_municipi + '</li>'; 
                    ++size;
                }

                inserElmData( "frm", "Se han encontrado "+size+" farmacias", '<ul style="list-style: unset;">'+strListData+'</ul>' ); 

            } else { 

                inserElmData( "frm", "Se ha producido un error en la consulta", dataapi.data.message ); 

            }

        } else {

            inserElmData( "frm", "No se ha posido conectar con la fuente de datos", "" );
        }

    } );

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ONCLICK searchFarmacy //

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SHOW inserElmData =>

function inserElmData( block,  data_h1, data_p ) {

    document.getElementById(block+"_elm_h1").innerHTML = data_h1;
    document.getElementById(block+"_elm_p").innerHTML = data_p;

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SHOW inserElmData //

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - AJAX function =>

function apiGetJsonClbk( fullapilink, callbackfn ) {

    axios.get( fullapilink ).then(callbackfn);

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - AJAX function //