function messageFlotante( theObj ) {

    document.getElementById('flt_image').src = `webComponents/03_items/media/img/${theObj.dataset.id}.jpg`;
    document.getElementById('flt_titulo').innerHTML = theObj.dataset.nombre;
    document.getElementById('flt_descri').innerHTML = theObj.dataset.descripcion;
    document.getElementById('flt_precio').innerHTML = `Precio: € ${theObj.dataset.precio}`;
    document.getElementById('flotantebg').style.display = 'block';

}

var objMenu = document.getElementById('lisstitems');

var menuDat = JSON.parse( mainData );

var tmphtml = "";

var tmpBg = true;

menuDat.forEach( theData => { tmpBg = !tmpBg; tmphtml += `<li ${tmpBg?'class="bgLigthgrey"':''} data-id="${theData.id}" data-grupo="${theData.grupo}" data-nombre="${theData.nombre}" data-descripcion="${theData.descripcion}" data-precio="${theData.precio}"><span onclick="messageFlotante(this.parentNode)">#${theData.id} - ${theData.nombre}</span><button>Agregar</button></li>`; });

objMenu.innerHTML = tmphtml;



filterItems( document.getElementById('listmenu').value );
