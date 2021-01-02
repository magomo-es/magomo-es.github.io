var bdobj = document.getElementsByTagName('BODY')[0];
var frbox = document.getElementById('baseboxifrm');
var frobj = document.getElementById('iframeBox');


// - - - - - establece el alto del iframe según su contenido
function onIframeLoaded( theobj ) {
	if ( theobj ) { theobj.height = theobj.contentWindow.document.body.scrollHeight + "px"; }
}


function viewIframeBox( callingobj ) {

	if ( frbox.dataset.open == "0" ) {

		frbox.dataset.open = "1";
		frbox.style.display = "block";		
		frobj.src = callingobj.dataset.jsfiddle;
		bdobj.style.overflow = 'hidden';

	} else {

		frbox.dataset.open = "0";
		frbox.style.display = "none";		
		frobj.src = "";
		bdobj.style.overflow = 'auto';

	}
}