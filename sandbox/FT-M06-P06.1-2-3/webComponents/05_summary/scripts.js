// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FUNCTIONS =>

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function calcTotals( objElmt, isAdd )

function calcTotals( objElmt, isAdd ) {

    var tmpPrice = parseFloat( objElmt.dataset.precio );

    if ( isAdd ) {

        orderTotal += tmpPrice;
        ++orderQtty;

    } else {

        orderTotal -= tmpPrice;
        --orderQtty;

    }

    viewTotals();

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function calcTotals( objElmt, isAdd )

function viewTotals() {

    document.getElementById('orderQtty').innerHTML = orderQtty;
    document.getElementById('orderTotal').innerHTML = orderTotal.toFixed(2);

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FUNCTIONS //

var orderTotal = 0.0;

var orderQtty = 0.0;

