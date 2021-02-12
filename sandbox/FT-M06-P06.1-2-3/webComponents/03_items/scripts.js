// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FUNCTIONS =>

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function messageFlotante( theObj )
function messageFlotante( theObj ) {

    document.getElementById('flt_image').src = `webComponents/03_items/media/img/${theObj.dataset.id}.jpg`;
    document.getElementById('flt_titulo').innerHTML = theObj.dataset.nombre;
    document.getElementById('flt_descri').innerHTML = theObj.dataset.descripcion;
    document.getElementById('flt_precio').innerHTML = `Precio: € ${theObj.dataset.precio}`;
    document.getElementById('flotantebg').style.display = 'block';

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function addItem( theObj )
function addItem( theObj ) {

    var objElmt = document.querySelector("#listorder li[data-id='"+theObj.dataset.id+"']");

    if ( objElmt != null )  {

        objElmt.dataset.qtty = parseInt( objElmt.dataset.qtty ) + 1;
        objElmt.dataset.total = ( parseFloat( objElmt.dataset.total ) + parseFloat( objElmt.dataset.precio ) ).toFixed(2);
        document.getElementById('ordItmQtty_'+objElmt.dataset.id ).innerHTML = objElmt.dataset.qtty + ' x ';

    } else {

        objElmt = document.createElement( 'li' );
        objElmt.setAttribute( 'data-id', theObj.dataset.id );
        objElmt.setAttribute( 'data-grupo', theObj.dataset.grupo );
        objElmt.setAttribute( 'data-nombre', theObj.dataset.nombre );
        objElmt.setAttribute( 'data-descripcion', theObj.dataset.descripcion );
        objElmt.setAttribute( 'data-precio', theObj.dataset.precio );
        objElmt.setAttribute( 'data-qtty', '1' );
        objElmt.setAttribute( 'data-total', theObj.dataset.precio );
        objElmt.innerHTML = `<span id="ordItmQtty_${theObj.dataset.id}">1 x </span><span onclick="messageFlotante(this.parentNode)">#${theObj.dataset.id} - ${theObj.dataset.nombre}</span><button onclick="deleteItem(this.parentNode)">Eliminar</button>`;
        document.getElementById('listorder').appendChild(objElmt);

    }

    calcTotals( objElmt, true );

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function deleteItem( theObj )
function deleteItem( theObj ) {

    var objElmt = document.querySelector("#listorder li[data-id='"+theObj.dataset.id+"']");

    if ( objElmt != null )  {

        let tmpInt = parseInt( objElmt.dataset.qtty );

        if ( tmpInt > 1 ) {

            objElmt.dataset.qtty = tmpInt - 1;
            objElmt.dataset.total = ( parseFloat( objElmt.dataset.total ) - parseFloat( objElmt.dataset.precio ) ).toFixed(2);
            document.getElementById('ordItmQtty_'+objElmt.dataset.id ).innerHTML = objElmt.dataset.qtty + ' x ';

        } else {

            document.getElementById('listorder').removeChild( objElmt );

        }

    }

    calcTotals( objElmt, false );

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FUNCTIONS //


var objMenu = document.getElementById('lisstitems');

var menuDat = JSON.parse( mainData );

var tmphtml = "";

var tmpBg = true;

menuDat.forEach( theData => { tmpBg = !tmpBg; tmphtml += `<li ${tmpBg?'class="bgLigthgrey"':''} data-id="${theData.id}" data-grupo="${theData.grupo}" data-nombre="${theData.nombre}" data-descripcion="${theData.descripcion}" data-precio="${theData.precio}"><span onclick="messageFlotante(this.parentNode)">#${theData.id} - ${theData.nombre}</span><button onclick="addItem(this.parentNode)">Agregar</button></li>`; });

objMenu.innerHTML = tmphtml;



filterItems( document.getElementById('listmenu').value );
