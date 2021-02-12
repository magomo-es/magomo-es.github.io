// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FUNCTIONS =>

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function filterItems( ex )

function filterItems( ex ) {

    var thevalue;

    if ( typeof ex != 'object' ) { thevalue = ex; } 
    else { thevalue = ex.target.value; } 

    (document.querySelectorAll('li[data-grupo]')).forEach( theData => { theData.classList.remove("showItem");});

    (document.querySelectorAll('li[data-grupo="'+thevalue+'"]')).forEach( theData => { theData.classList.add("showItem"); } );

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FUNCTIONS //

var objMenu = document.getElementById('listmenu');

var menuDat = JSON.parse( groupsData );

var tmphtml = "";

menuDat.forEach( theData => { tmphtml +=  `<option value="${theData.id}">${theData.nombre}</option>`; });

objMenu.innerHTML = tmphtml;

objMenu.dataset.sel = objMenu.value;




