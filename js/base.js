// JavaScript Document

// - - - - - - - - - - - - - - - - - - - setWebColor( thecolor )
function setWebColor( theobj ) {
	var theColor = theobj.style.backgroundColor;
	document.documentElement.style.setProperty('--colorFill', theColor );
	document.documentElement.style.setProperty('--colorOption', theColor );
	document.documentElement.style.setProperty('--colorTitle', theColor );
}

// - - - - - - - - - - - - - - - - - - - viewMenu()
function viewMenu() {
	objmnu = document.getElementById("menuUl");
	if (objmnu.style.display=='none') { objmnu.style.display='block'; }
	else if (objmnu.style.display=='block') { objmnu.style.display='none'; }
	else { 
		if(window.innerWidth<=2500) { objmnu.style.display='block'; }
		else { objmnu.style.display='none'; }
	}
}