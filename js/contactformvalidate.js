// JavaScript Document basev30
// ------------------------------------------------------------------------------------------------------- DATA FORM VALIDATION
// ----------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------- validatecform - controla que name, email y phone tengan caracteristicas basicas
function validatecform(idform)
	{
	objform = document.getElementById(idform);
	var control;
	var formmsg = 'Error: contacto, email y teléfono son datos obligatorios. Por favor, introduzca sus datos para completar la solicitud.';
	control = cformmorenchars(objform.name.value,3);
	control = cformonlyalphanum(objform.name.value);
	control = cformmorenchars(objform.email.value,3);
	control = cformwithat(objform.email.value);
	control = cformmorenchars(objform.phone.value,4);
	if (control==1) { objform.submit(); } else { alert(formmsg); }
	return;
	} 
// ----------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ cformmorenchars - control que el string del objeto contenga al menos nchars
function cformmorenchars(thevalue,nchars)
	{ if (thevalue.length < nchars) { return 0; } else { return 1; }	}
// ----------------------------------------------------------------------------------------------------------------------------
// -------------------------------- cformonlyalphanum - control que el string del objeto contenga solo caracteres alfanumericos
function cformonlyalphanum(thevalue)
	{
	if (thevalue=="") { return 0; }
	var alfanumchars = "01234567890 "+"ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ"+"abcdefghijklmnñopqrstuvwxyzáéíóú";
	var charfinded = false;
	for (ciclo1=0; ciclo1 < thevalue.length; ciclo1++) 
		{
		onecharacter = thevalue.charAt(ciclo1);
		finded = false;
		for (ciclo2=0; ciclo2<alfanumchars.length; ciclo2++)
			{
			if (onecharacter == alfanumchars.charAt(ciclo2)) { /*Finded*/ charfinded = true; break; }
			}
		if (!charfinded) { return 0; }
		}
	return 1;
	}
// ----------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------- cformwithat - control que el string contenga caracter @
function cformwithat(thevalue) { if ( thevalue.indexOf('@',0)<0 ) { return 0; } else { return 1; } }
// ----------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------------- 20190724
// ----------------------------------------------------------------------------------------------------- validate and call ajax
function validajaxcform( callurl, idreceip, idform ) 
	{
	objform = document.getElementById( idform );
	var control;
	var formmsg = 'Error: contacto, email y teléfono son datos obligatorios. Por favor, introduzca sus datos para completar la solicitud.';
	control = cformmorenchars( objform.name.value, 3 );
	control = cformonlyalphanum( objform.name.value );
	control = cformmorenchars( objform.email.value, 3 );
	control = cformwithat( objform.email.value );
	control = cformmorenchars( objform.phone.value, 4 );
	if ( control == 1 ) { MostrarZmain( callurl, idreceip, idform ); } else { alert( formmsg ); }
	return;
	}
// ----------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------
