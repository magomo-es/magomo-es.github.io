// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - BUS eventBus =>  

var eventBus = new Vue()

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - BUS eventBus //

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MODAL comanda-payordermodal =>

Vue.component('comanda-payordermodal', {

    template: `
        <div id="flotantebg" v-show="showme">
            <div id="flotante">
                <form class="comanda-pay" @submit.prevent="onSubmit">
                    <label for="name">Name:</label><input type="text" v-model="name" placeholder="customer name">
                    <label for="card">Card #:</label><input type="text" v-model="card" placeholder="card number">
                    <button type="submit" value="Submit" style="float: right; padding: 5px; cursor: pointer">Pay {{ paytotal }}</button>
               </form>
            </div>
        </div>
    `,

    data() {
        return {
            errors: [],
            name: null,
            card: null,
            showme: false, 
            paytotal: 0,
            payqtty: 0
        }
    },

    methods: {

        onSubmit() {
            this.errors = []
            if ( this.name && this.card && this.paytotal>0 ) {
                let payOrder = {
                    name: this.name,
                    card: this.card,
                    paid: true
                }
                eventBus.$emit('orderpaid', payOrder)
                this.name = null
                this.card = null
                this.showme = false
            }
            else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.card) this.errors.push("Card number required.")
                if(this.paytotal==0) this.errors.push("No bill to pay.")
            }
        },

        showMe(total, qtty) {
            this.showme = true
            this.payqtty = qtty
            this.paytotal = total
        }

    },

    mounted() {

        eventBus.$on( 'callpayment', function (total, qtty) { this.showMe(total, qtty) }.bind(this) )

    }    

})


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MODAL comanda-payordermodal //

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ORDER comanda-order =>  

Vue.component('comanda-order', {

//    props: { },

    template: `
    <div>

        <h1 id="comandatitle">Comanda</h1>

        <ul id="listorder">
            <li v-for="(item, index) in orderitems">
                <span>{{ item.qtty }} x #{{ item.id  }} - {{ item.name }}</span>
                <button v-on:click="delItem(index)">Eliminar</button>
            </li>        
        </ul>

        <h2 id="orderSummary">
            Items comanda: {{ items }} | 
            Total comanda: € {{ thetotal }} 
            <button id="payButton" v-bind:class="{ activePay: total>0 }" v-on:click="callingPayment()" v-bind:disabled="total<=0">Pay</button>
        </h2>

    </div>
    `,

    data() {
        return {
            orderitems: [],
            total: 0.00,
            items: 0,
            name: "",
            card: 0,
            paid: false
        }
    },

    computed: {
        totalqtty() { Object.keys(this.orderitems).length },
        thetotal() { return this.total.toFixed(2) }
    },

    methods: {

        delItem(indice) {
            console.log( 'delItem -> this.orderitems[indice].name: ' + this.orderitems[indice].name + ' / this.orderitems[indice].id: ' + this.orderitems[indice].id )
            if (this.orderitems[indice]) {
                this.items -= 1
                this.total -= this.orderitems[indice].price
                if (this.orderitems[indice].qtty>1) { this.orderitems[indice].qtty -= 1 }
                else { this.orderitems.splice( indice, 1) }
            }
        }, 

        addItem(product) {
            console.log( 'addItem -> product.name: ' + product.name + ' / product.id: ' + product.id )
            var indice = -1
            var i = -1
            while ( (++i)<Object.keys(this.orderitems).length && indice<0 ) { 
                console.log( 'this.orderitems['+i+'].id: ' + this.orderitems[i].id + ' == '+ product.id )
                if (this.orderitems[i].id == product.id) { indice = i } 
            }
            if (indice>=0) { 
                ++this.orderitems[indice].qtty 
            } else  { 
                product.qtty = 1
                this.orderitems.push( product )
            }
            ++this.items
            this.total += product.price
        },

        registerOrder(payOrder) { 
            // name: this.name, card: this.card, paid: true

            this.name = payOrder.name
            this.card = payOrder.card
            this.paid = payOrder.paid
            
            let curseOrder = {
                orderitems: this.orderitems,
                total: this.total,
                items: this.items,
                name: this.name,
                card: this.card,
                paid: this.paid
            }

            this.orderitems = []
            this.total = 0
            this.items = 0
            this.name = ""
            this.card = ""
            this.paid = false

            eventBus.$emit('curseorder', curseOrder)

        }, 

        callingPayment() {

            console.log('callingPayment -> calling payment form')

            eventBus.$emit('callpayment', this.thetotal, this.qtty )

        }


    },

    mounted() {

        eventBus.$on( 'orderadditem', function (product) { this.addItem(product) }.bind(this) )

        eventBus.$on( 'orderpaid', payOrder => { this.registerOrder(payOrder) } )

    }

})

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ORDER comanda-order //

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MODAL comanda-viewprodmodal //

Vue.component('comanda-viewprodmodal', {

    props: {
        products: { type: Array, required: true },
        prodsel: { type: Number, required: true }
    },

    template: `
        <div id="flotantebg" v-show="prodsel>=0" v-on:click="$emit('hideprodmodal')">
            <div id="flotante">
                <img id="flt_image" v-bind:src="image">
                <h2 id="flt_titulo" v-text="name"></h2>
                <p id="flt_descri" v-text="description"></p>
                <p id="flt_precio" v-text="price"></p>
                <div style="clear: both;"></div>
            </div>
        </div>
    `,

    computed: {
        image() { 
            if (this.prodsel>=0) { 
                return 'media/img/' + this.products[this.prodsel].id + ".jpg" 
            } else { 
                return "" 
            }
        },
        name() { 
            if (this.prodsel>=0) { 
                return this.products[this.prodsel].name 
            } else { 
                return "" 
            }
        },
        description() { 
            if (this.prodsel>=0) { 
                return this.products[this.prodsel].description 
            } else { 
                return "" 
            }
        },
        price() { 
            if (this.prodsel>=0) { 
                return this.products[this.prodsel].price 
            } else { 
                return "" 
            }
        }
    }

})


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MODAL comanda-viewprodmodal //

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - TABS comanda-products =>  

Vue.component('comanda-products', {

    template: `
    <div>
        <div id="listmenu">
            <span class="tabs" v-bind:class="{ activeTab: tabsel === tab.id }" v-for="(tab, index) in tabs" v-bind:key="index" v-on:click="tabsel = tab.id" >{{ tab.name }}</span>
        </div>
        <ul id="lisstitems">
          <li v-for="(product, index) in products" v-show="product.group==tabsel">
                <span v-on:click="showProdModal(index)">#{{ product.id }} - {{ product.name }}</span>
                <button v-on:click="addToOrder(index)">Agregar</button>
            </li>
        </ul>
        <comanda-viewprodmodal v-bind:products="products" v-bind:prodsel="prodsel" v-on:hideprodmodal="hideProdModal()"></comanda-viewprodmodal>
    </div>
    `,
    
    data() {
        return {
            tabs: [ 
                { id: 1, name: 'Entrante'}, 
                { id: 2, name: 'Principal'},
                { id: 3, name: 'Postre'}, 
                { id: 4, name: 'Bebida'}
            ],
            tabsel: 1,
            prodsel: -1,
            products: [
                { id: 1, group: 1, name: 'Pequeños hojaldres con foie gras', description: 'Pequeños hojaldres delicados, rellenos con un cubito de foie gras crudo y sazonado.', price: 1.15 },
                { id: 2, group: 1, name: 'Enrollados de tocino y queso', description: 'Estas galletas de aperitivo se pueden preparar con antelación, o incluso servir frías.', price: 1.15 },    
                { id: 2, group: 1, name: 'Enrollados de tocino y queso', description: 'Estas galletas de aperitivo se pueden preparar con antelación, o incluso servir frías.', price: 1.15 }, 
                { id: 3, group: 1, name: 'Pequeños omelettes con verduras', description: 'Para degustar como aperitivo o como entrada, tortillas gruesas y esponjosas, con cubos de tomate, calabacín y jamón ahumado.', price: 1.15 }, 
                { id: 4, group: 1, name: 'Gougères', description: 'Son pequeños choux de queso, a veces (como aquí) le añadimos pequeños trozos de jamón.', price: 1.15 }, 
                { id: 5, group: 1, name: 'Canapés de huevos de codorniz', description: 'Esta entrada es un pequeño canapé compuesto por una rebanada de pan enmantequillada y tostada, cubierta con una rebanada de jamón ahumado apenas un poco tostada, sobre la que se coloca un huevo frito de codorniz.', price: 1.15 }, 
                { id: 6, group: 1, name: 'Sacristanes de salmón ahumado', description: 'Los sacristanes son pequeños pastelillos en masa de hojaldre que tienen forma de espiral. Encontramos todo tipo de sabores, salados o dulces. Esta es una versión rápida con salmón ahumado, que hace un muy buen acompañamiento para el aperitivo.', price: 1.15 }, 
                { id: 7, group: 1, name: 'Patatas delfina con jamón serrano', description: 'Pequeños aperitivos muy sabrosos, que se pueden servir como aperitivo, incluso como acompañamiento de un plato principal.', price: 1.15 }, 
                { id: 8, group: 1, name: 'Huevos de codorniz en botonera', description: 'Este pequeño aperitivo es una mini-tostada de pan tostado, una rebanada de jamón crudo y tres yemas de huevo de codorniz dispuestas sobre un rectángulo de clara. Es un poco complejo de preparar, pero muy bonito de presentar, y por supuesto muy sabroso.', price: 1.15 }, 
                { id: 9, group: 1, name: 'Caracoles de hojaldre y jamón', description: 'Estos pequeños caracoles hojaldrados con jamón ahumado son deliciosos y muy rápidos de preparar.', price: 1.15 }, 
                { id: 10, group: 1, name: 'Endibias rojas en aperitivo', description: 'Con las endibias rojas se puede hacer aperitivos muy elegantes, aquí rellenos con una preparación a base de queso y sardinas.', price: 1.15 }, 
                { id: 11, group: 1, name: 'Mini tostadas de queso y mostaza', description: 'Para un aperitivo que sale un poco de lo ordinario, les propongo estas tostadas de queso y mostaza, en una receta express que puede realizarse fácilmente en el último momento.', price: 1.15 }, 
                { id: 12, group: 1, name: 'Nueces de acajú tostadas con especias', description: 'Asar, tostar mas bien, los anacardos les aporta una textura mucho mas buena que cuando están crudos, y también puede ser la ocasión de condimentarlos un poco, como en esta receta muy simple.', price: 1.15 }, 
                { id: 13, group: 1, name: 'Puerros y vinagreta', description: 'Un plato clásico de la cocina familiar y de la cocina de bistrot, es a la vez muy simple, y muy sabroso. El secreto es: puerros apenas cocidos que conservan su hermoso color, y una vinagreta con hierbas y huevos duros picados.', price: 1.15 }, 
                { id: 14, group: 1, name: 'Tabulé de coliflor', description: 'En esta receta de tabulé, la sémola se sustituye por los cogollos de coliflor rallados, es muy fresca y de un sabor asombroso.', price: 1.15 }, 
                { id: 15, group: 1, name: 'Nabo total', description: 'Todo el nabo está en esta receta, donde para preparar una porción vamos a usar la verdura y sus hojas.', price: 1.15 }, 
                { id: 16, group: 1, name: 'Vaso de 4 pisos', description: 'Es un plato que se sirve en un vaso, está formado por cuatro capas de una delicada preparación de verduras. El conjunto se degusta como entrada e incluso se puede preparar la víspera. No es muy complicado de preparar, sólo el montaje es un poco delicado.', price: 1.15 }, 
                { id: 17, group: 1, name: 'Hummus', description: 'El hummus es un delicioso puré de garbanzos con puré de sésamo y limón. Es uno de los muchos y deliciosos platos que componen los famosos y deliciosos mezzes libaneses.', price: 1.15 }, 
                { id: 18, group: 1, name: 'Guacamole', description: 'Para esta receta tí-picamente mexicana, existen dos formas de preparación: o bien un puré suave de aguacates o bien se les aplasta con el tenedor (o se licua levemente) de manera que obtenga un puré con pequeños pedazos, agregándole después, o no, un poco de tomate. Encontrará a continuación el primer método.', price: 1.15 }, 
                { id: 19, group: 1, name: 'Boursin al ajo y hierbas finas', description: 'Es bastante fácil preparar su propio queso fresco al ajo y hierbas, un poco como el famoso queso Boursin. Es muy fresco, definitivamente mas sabroso, y delicioso sobre todo con un trocito de pan tostado.', price: 1.15 }, 
                { id: 21, group: 1, name: 'Sándwich club de pollo', description: 'Para estos sándwiches: pollo marinado en limón verde, tocino tostado, ensalada, cebolla roja y mayonesa.', price: 1.15 }, 
                { id: 22, group: 1, name: 'Sandwich croque-monsieur', description: 'Un clásico de la restauración de bistrot: una rebanada de jamón entre dos rebanadas de pan de miga untadas de salsa bechamel, todo ello espolvoreado de queso y cocido en el horno.', price: 1.15 }, 
                { id: 23, group: 1, name: 'Terrina de tomates y queso fresco', description: 'Tomates marinados con aceite de oliva y limón, alternados con una capa de queso fresco con hierbas y otra capa de queso con nueces.', price: 1.15 }, 
                { id: 24, group: 1, name: 'Terrina de foie gras', description: 'La terrina de foie gras es una manera bastante simple de preparar el foie gras, ideal para principiantes. En esta receta los trozos no se conservan intactos, el hígado se pasa por el tamiz o el molino de verduras. El aspecto final es mucho más suave, menos marmoleado, pero el sabor siempre delicioso.', price: 1.15 }, 
                { id: 25, group: 1, name: 'Terrina de aguacate y salmón ahumado', description: 'En esta colorida terrina, las capas de aguacate se alternan con las de salmón ahumado y los cubos de tomate con vinagre balsámico.', price: 1.15 }, 
                { id: 26, group: 1, name: 'Foie gras a la sal', description: 'Es una cocción bastante diferente a la de foie gras casero en terrina, esta vez (si se puede decir así) no se cocina al horno, el hígado se pone durante 48 horas en sal gorda y se cocina de esta manera.', price: 1.15 }, 
                { id: 27, group: 1, name: 'Tarta fina, gelatina de tomates y aguacates', description: 'Para esta receta bastante sofisticada, se va a preparar una gelatina de tomate en forma de disco, colocada sobre otro disco de masa hojaldre, y sobre la cual se dispondrán láminas de aguacate limonadas.', price: 1.15 }, 
                { id: 28, group: 1, name: 'Tarta fina de aguacate', description: 'Un fondo de hojaldre precocido, un relleno de queso y hierbas, láminas de aguacate, y un toque de limón verde y cilantro para esta crujiente y delicada tarta salada.', price: 1.15 }, 
                { id: 29, group: 1, name: 'Tatin de tomates', description: 'Es una masa sablé, salada, con queso parmesano, que recubre tomates en dos cocciones, a la sartén y al horno. En el último momento, le damos la vuelta como una tarta tatin clásica.', price: 1.15 }, 
                { id: 30, group: 1, name: 'Quiche salmón-espinaca', description: 'Esta receta de quiché utiliza una migaine tradicional, pero está rellena de lonchas de salmón ahumado y de espinacas blanqueadas.', price: 1.15 }, 
                { id: 31, group: 1, name: 'Sopa rústica con puerros y coles de Bruselas', description: 'Para esta receta se procederá de manera un poco atípica: primero asar al horno las coles de Bruselas, luego mezclarlas con el puerro, ya ligeramente cocido con la cebolla, antes de añadir caldo de ave. Servido con jamón crujiente, su sabor con bastante cuerpo, le sorprenderá sin duda.', price: 1.15 }, 
                { id: 32, group: 1, name: 'Sopa muy verde y barata', description: 'Muy seguido tendemos a tirar todo lo que es hojas o tallos de nuestras verduras habituales, lo que es una lástima porque la mayoría se puede cocinar, como por ejemplo en esta sopa muy verde donde se utilizan las hojas de rábano, tallos de cebolletas y vainas de guisantes.', price: 1.15 }, 
                { id: 33, group: 1, name: 'Crema de coliflor y haddock ahumado', description: 'Probablemente le sorprenda el delicioso sabor de esta asociación algo atípica: una crema de coliflor con nata y pequeños trozos de haddock ahumado.', price: 1.15 }, 
                { id: 34, group: 1, name: 'Sopa de hojas comestibles', description: 'No es muy obvio, pero en realidad las hojas de algunas verduras que crecen en la tierra, son completamente comestibles, por lo que sería una pena desperdiciarlas. Mejor aun, permiten preparar guarniciones muy interesantes con sus verduras, o sopas de sabores increíbles. Para esta receta, les propongo una sopa hecha con hojas de nabos y rábanos.', price: 1.15 }, 
                { id: 35, group: 1, name: 'Crema otoñal de calabaza potimarron y apionabo', description: 'Crema (velouté) natural que mezcla los sabores de mostaza, apionabo y potimarron.', price: 1.15 }, 
                { id: 36, group: 1, name: 'Sopa de cebolla gratinada', description: 'La sopa de cebolla es uno de los platos emblemáticos de la cocina francesa, tanto de la cocina de bistró, como de la cocina familiar.', price: 1.15 }, 
                { id: 37, group: 2, name: 'Atún marinado con hierbas', description: 'Esta es una receta muy sencilla de atún marinado, preferiblemente para la barbacoa o la Plancha, pero no es imperativo. Como es una receta rápida y deliciosa, al estilo de la cocina de verano, las proporciones son muy vagas, las puede adaptar según su gusto.', price: 1.15 }, 
                { id: 38, group: 2, name: 'Ceviche de Erika', description: 'El ceviche de Erika es la versión peruana de esta receta emblemática de la cocina sudamericana, donde los cubos de pescado se cocinan en zumo de limón verde. Es un plato bastante simple, pero delicioso y muy fresco.', price: 1.15 }, 
                { id: 39, group: 2, name: 'Crostada de mejillones ch\'ti', description: 'En un fondo de tartaleta de hojaldre cocida en blanco, depositamos los mejillones pelados y bañamos con una untuosa salsa de cerveza y queso Maroilles.', price: 1.15 }, 
                { id: 40, group: 2, name: 'Cubos de salmón al estilo de Creta', description: 'Un puerro picado cocinado con chalote, cubos de salmón, servido en una salsa de yogur, tomate y feta.', price: 1.15 }, 
                { id: 41, group: 2, name: 'Curry de mejillones y repollo', description: 'Partiendo de mejillones cocidos a la marinera, y después de haberles quitado la concha, vamos a servirlos con una sabrosa crema de curry y un picadillo de repollo apenas cocido tierno.', price: 1.15 }, 
                { id: 42, group: 2, name: 'Enrollados de pescado con jamón ahumado', description: 'Se prepara trozos de pescado blanco que se enrollan en una fina rebanada de jamón ahumado. Estos enrollados se ponen a dorar en un chorrito de aceite de oliva y se sirven con judías verdes. La asociación jamón ahumado-pescado puede parecer un poco rara, pero en realidad son sabores que van muy bien juntos.', price: 1.15 }, 
                { id: 43, group: 2, name: 'Espaguetis con mejillones y albahaca', description: 'Los mejillones y la pasta se cocinan por separado, y luego se lían con una salsa de nata hecha con el jugo de reducción de los mejillones.', price: 1.15 }, 
                { id: 44, group: 2, name: 'Filete de carbonero en dos cocciones', description: 'Para este filete de carbonero haremos 2 cocciones: una primera, rápida en la sartén para sellar y dorar por el exterior, y luego una segunda más lenta al horno, en papillote, sobre una fondue de cebolla, una juliana de zanahorias y guisantes. Esta doble cocción le dará un pescado ligeramente crujiente por fuera y fundente por dentro.', price: 1.15 }, 
                { id: 45, group: 2, name: 'Filete de pescado al vapor de romero', description: 'Se cocina el pescado al vapor con romero lo que lo deja muy tierno y aromático, se coloca sobre una pequeña fondue de ccebolla y se baña con una crema de vino blanco.', price: 1.15 }, 
                { id: 46, group: 2, name: 'Filetes de lenguado meunière', description: 'Los filetes de lenguado Meunière obtienen sin duda su nombre del uso de un poco de harina, es una receta clásica de bistró, más bien consistente (mucha mantequilla), fácil de hacer, pero al mismo tiempo bastante fácil de estropear.', price: 1.15 }, 
                { id: 47, group: 2, name: 'Filetes de pescado a la parrilla, repollo con Noilly Prat', description: 'En esta receta, cocinamos rápidamente y a cubierto (estofar), la col cortada finamente, antes de terminar su cocción con vino Noilly y un poco de nata. Se sirve como acompañamiento de un sencillo pero delicioso filete de pescado simplemente a la parrilla.', price: 1.15 }, 
                { id: 48, group: 2, name: 'Filetes de pescado en papillote express', description: 'Verduras cortadas en pequeños dados precocinados, filete de pescado, zumo de limón, aceite de oliva, y 2 minutos de microondas.', price: 1.15 }, 
                { id: 49, group: 2, name: 'Huevos revueltos con langostinos y puntas de espárragos', description: 'Para esta receta, se saltean los langostinos y las puntas de espárragos, luego se incorporan a los huevos batidos y se procede como si fueran huevos revueltos normales.', price: 1.15 }, 
                { id: 50, group: 2, name: 'Kulibiak en terrina', description: 'El kulibiak es un plato tradicional de la cocina rusa, que se sirve generalmente en un hojaldre plano, a menudo decorado en forma de pescado. Esta es mi versión en terrina, mucho más fácil de montar.', price: 1.15 }, 
                { id: 51, group: 2, name: 'Marmita tierra y mar', description: 'Cubos de pescado (mar), verduras escalfadas y tocino tostado (tierra), todo ligado con una salsa cremosa donde se mezclan todos los sabores de esta deliciosa receta.', price: 1.15 }, 
                { id: 52, group: 2, name: 'Marmita normanda', description: 'Una marmita normanda, es el encuentro entre una juliana de diferentes verduras de temporada y varios crustáceos que se habrán salteado rápidamente y desglasado con sidra. Ambos se ponen a cocinar juntos en nata, que se reduce y espesa lentamente, concentrando los sabores.', price: 1.15 }, 
                { id: 53, group: 2, name: 'Mejillones a la marinera', description: 'La forma más clásica de preparar mejillones, simple pero deliciosa.', price: 1.15 }, 
                { id: 54, group: 2, name: 'Mejillones con arroz negro', description: 'El arroz negro, el famoso Arroz negro de la cocina española, es un arroz cuya cocción se termina con tinta de sepia. Esto produce un arroz con un extraño color negro profundo, pero también deliciosos sabores marinos. En esta receta, sirve de cama para los mejillones simplemente cocidos y descascarillados, con los que combina perfectamente.', price: 1.15 }, 
                { id: 55, group: 2, name: 'Mejillones rellenos con mantequilla de caracol', description: 'Para esta receta primero se cocinan los mejillones rápidamente en agua salada, el tiempo que se abran, luego se descascarillan y se cocinan al horno con una nuez de mantequilla de caracol, durante algunos minutos.', price: 1.15 }, 
                { id: 56, group: 2, name: 'Pescado a la bordelesa', description: 'El pescado a la bordelesa, es un filete de pescado cubierto de una deliciosa corteza a base de cebollas cocidas con vino blanco, pan rallado y hierbas, que se cuece en el horno y sobre todo se gratina.', price: 1.15 }, 
                { id: 57, group: 2, name: 'Pescado de Nicolas', description: 'Es una receta muy sencilla, todo se trata de cocinar las verduras y luego el pescado.', price: 1.15 }, 
                { id: 58, group: 2, name: 'Salmón asado con crema de canónigos', description: 'Un filete de salmón, asado en cocción lenta para mantener su interior esponjoso, servido con arroz con sésamo y una pequeña crema de mache. Le va a encantar...', price: 1.15 }, 
                { id: 59, group: 2, name: 'Terrina de filetes de pescado, espinaca y tomates', description: 'Para componer esta terrina de pescado, se alternan las capas de filetes de pescado con espinacas y tomates confitados. Se cocina lentamente al horno, y se sirve en rebanadas (sí, sí, se trata de una terrina) acompañada, por ejemplo, de una salsa holandesa.', price: 1.15 }, 
                { id: 60, group: 2, name: 'Vieiras con fondue de puerros', description: 'En esta receta muy cremosa, luego se saltean las vieiras y finalmente los puerros se pasan por la sartén para tomar todo el sabor.', price: 1.15 }, 
                { id: 61, group: 2, name: 'Vieiras con puntas de espárragos verdes y parmesano', description: 'En esta receta se doran las vieiras en la sartén, se añaden las puntas de espárragos verdes cocidos por separado y justo antes de servir, se espolvorea con queso parmesano rallado.', price: 1.15 }, 
                { id: 62, group: 2, name: 'Albóndigas de carne con tomate', description: 'Albóndigas en una sabrosa salsa de tomate con hierbas y vino blanco.', price: 1.15 }, 
                { id: 63, group: 2, name: 'Asado de cerdo y verduras fundentes', description: 'La cocción en bolsa, es decir, muy simple pero larga, a temperatura moderada y en una bolsa de cocción hermética, permite obtener carnes de una suavidad y un sabor extraordinario. Las carnes así cocidas producen un delicioso jugo de cocción, sin ninguna adición, en él que se cocinarán las verduras hasta que estén fundentes, y que acompañarán maravillosamente la carne.', price: 1.15 }, 
                { id: 64, group: 2, name: 'Ave en cinco horas', description: 'Quizás la receta más sencilla del sitio, ¡pero qué resultado! El principio es cocinar el ave de corral durante mucho tiempo, sin añadir grasa, a una temperatura relativamente baja y a cubierto. De este modo, el ave se cocina hasta el punto de ser casi un confit: tierno y muy sabroso. El efecto es más espectacular con un pato porque es un animal bastante firme en general, incluso duro, pero con esta cocción se corta con un tenedor casi como un confit.', price: 1.15 }, 
                { id: 65, group: 2, name: 'Blanqueta de ternera', description: 'La blanqueta es un clásico de la cocina familiar francesa, pero también de la cocina de bistró. Es carne de ternera cocida durante mucho tiempo y cuya salsa está ligada (espesada) con una mezcla de yemas de huevo y nata. Aquí le propongo una forma especial de realizarla.', price: 1.15 }, 
                { id: 66, group: 2, name: 'Carbonada de res', description: 'La carbonada es un plato originario de Bélgica y del norte de Francia, son grandes cubos de carne de res que se cocinan lentamente en cerveza, cebollas y zanahorias. Esta es una versión personal.', price: 1.15 }, 
                { id: 67, group: 2, name: 'Cazuela de salchicha y lentejas', description: 'Para esta receta de salchichas con lentejas vamos a proceder de manera particular, casi como para un guiso: las lentejas van a cocinarse en la cantidad apenas necesaria de agua, con algunos ingredientes que forman un relleno aromático, y sobre todo la salchicha (ahumada si es posible) que, pinchada, dará todo su sabor a las lentejas durante la cocción.', price: 1.15 }, 
                { id: 68, group: 2, name: 'Cerdo asado con hierbas', description: 'Una buena pieza de cerdo, cocida lentamente con hierbas, servida con una grenaille de patatas, cocida en el jugo de la carne.', price: 1.15 }, 
                { id: 69, group: 2, name: 'Chili con carne express', description: 'Es una receta rápida, un verdadero chili tarda mas tiempo y es más complejo.', price: 1.15 }, 
                { id: 70, group: 2, name: 'Duo de jamones en cocción lenta', description: 'Dos piezas de jamón, aquí una salchicha ahumada y un trozo de espinazo, que se cocinan lentamente, en una cama de verduras, de hierbas y se mojan en caldo de verduras o de ave. Es uno de esos platos que puede ser calentado varias veces, y ponerse mejor con cada vez.', price: 1.15 }, 
                { id: 71, group: 2, name: 'Escalope vienés', description: 'El escalope vienés (Wiener Schnitzel) es un fino filete de ternera empanado.', price: 1.15 }, 
                { id: 72, group: 2, name: 'Escalopes de ternera con nata', description: 'Chuletas de ternera, champiñones salteados y salsa de crema.', price: 1.15 }, 
                { id: 73, group: 2, name: 'Estofado de ternera Bourguignon', description: 'La ternera bourguignon o borgoñón es uno de los platos tradicionales de la cocina francesa, son trozos de carne de ternera que se cocinan durante mucho tiempo en vino tinto, con pechito ahumado, cebollas, zanahorias y setas.', price: 1.15 }, 
                { id: 74, group: 2, name: 'Filete de res Wellington', description: 'El filete de res Wellington, es una pieza de carne que se sella, luego se cocina al horno en una corteza de masa hojaldre, con un duxelles de champiñones y trozos de foie gras.', price: 1.15 }, 
                { id: 75, group: 2, name: 'Filete mignon con hierbas y juliana de verduras', description: 'El filet mignon de cerdo se corta en trozos individuales, a los que se hace una hendidura y se rellenan con hierbas antes de cocinar. Se sirven con una juliana de verduras crujientes y salsa de nata.', price: 1.15 }, 
                { id: 76, group: 2, name: 'Hamburguesa de bistec picado con huevo montado', description: 'Un hamburguesa tierna de 100% res, sobre la que se coloca un huevo frito. Aquí le muestro los secretos para hacer bien las cocciones de este plato simple pero delicioso.', price: 1.15 }, 
                { id: 77, group: 2, name: 'Hamburguesas', description: 'Las hamburguesas no son necesariamente esa cosa grasosa y blanda que se come en los restaurantes de comida rápida. Además, es un plato ideal para compartir, porque lo ponemos todo sobre la mesa y cada uno compone la suya a su gusto.', price: 1.15 }, 
                { id: 78, group: 2, name: 'Involtini', description: 'Los involtini son pequeños rollitos de carne, de ternera en general, y de queso. Esta es una receta a mi manera.', price: 1.15 }, 
                { id: 79, group: 2, name: 'Pechugas de pollo al estragón', description: 'Las pechugas de pollo se cocinan lentamente en la sartén, luego la sartén se desglasa con un poco de vino blanco, caldo y estragón picado para constituir la salsa, todo servido con patatas salteadas.', price: 1.15 }, 
                { id: 80, group: 2, name: 'Picadillo de cerdo al estilo Cajún', description: 'En la cocina cajún, los platos a base de arroz y carne, como el famoso jambalaya, ocupan un lugar destacado. Aquí le propongo una versión simplificada con carne de cerdo marinada.', price: 1.15 }, 
                { id: 81, group: 2, name: 'Pollo lilés', description: 'Filetes de pollo fritos por separado, champiñones, también cocidos por separado, mezclados antes de servir con una sabrosa salsa de crema. Es una receta de sabor cocinado, un plato que lamentablemente se hace cada vez más raro en los restaurantes.', price: 1.15 }, 
                { id: 82, group: 2, name: 'Salchicha de Morteau campestre', description: 'Cocinamos una o varias salchichas de Morteau en una cama de patatas cortadas en trozos medianos. El punto de esta receta es que la salchicha de Morteau picada se va a cocinar lentamente y su sabor ahumado va a bajar sobre las patatas, es una delicia pura.', price: 1.15 }, 
                { id: 83, group: 2, name: 'Ternera Marengo', description: 'El ternero Marengo, es un pedazo de ternera cortado en grandes cubos, que se cocina largamente en puré de tomate, con setas y cebollas. Es una receta casi histórica, vinculada a una batalla napoleónica cerca de la ciudad de Marengo, en Italia, en junio de 1800.', price: 1.15 }, 
                { id: 84, group: 3, name: 'Tostadas francesas', description: 'Las tostadas francesas son rebanadas de pan que se sumergen en una mezcla de leche, nata, yemas de huevo y azúcar de vainilla, y que luego se doran en la sartén. Es muy simple y sobre todo delicioso!', price: 1.15 }, 
                { id: 85, group: 3, name: 'Arroz con leche', description: 'Para muchos ¡Un postre lleno de recuerdos de infancia! Esta es mi versión personal.', price: 1.15 }, 
                { id: 86, group: 3, name: 'Barritas de cereales esponjosas', description: 'En forma de barras o de discos, con esta receta obtendrá excelentes pastelillos de cereales.', price: 1.15 }, 
                { id: 87, group: 3, name: 'Bizcocho de castañas', description: 'Este delicioso bizcocho es de castañas por partida doble: contiene harina y crema de castañas.', price: 1.15 }, 
                { id: 88, group: 3, name: 'Bizcocho micuit de chocolate', description: 'Un bizcochito de chocolate muy esponjoso, servido con un culis de frambuesas.', price: 1.15 }, 
                { id: 89, group: 3, name: 'Blanc manger de albaricoques', description: 'El blanc manger es un postre muy antiguo, de la cocina de la Edad Media. Adaptado a nuestra época, es una leche de almendras a la que se añade nata batida y que se acompaña de una fina compota de albaricoques.', price: 1.15 }, 
                { id: 90, group: 3, name: 'Charlotte contesa de manzana', description: 'Una charlotte contesa es una versión más rústica del famoso postre. Esta compuesta de rebanadas de pan que se untan ligeramente con mantequilla y luego se tuestan, y rellena con pequeños trozos de manzanas dulces, que se riegan con mantequilla clarificada.', price: 1.15 }, 
                { id: 91, group: 3, name: 'Chaud-froid de pomelo-piña', description: 'Cuartos de pomelo fríos con trozos de piña caramelizada calientes, una crema inglesa al limon verde y un crocante de cítricos.', price: 1.15 }, 
                { id: 92, group: 3, name: 'Copa de fresas', description: 'Una crema pastelera de menta, unos cubos de fresa y una capa de crema batida.', price: 1.15 }, 
                { id: 93, group: 3, name: 'Cortezas de pomelo confitadas', description: 'No es exactamente un postre, más bien un dulce. Después de remojarlos para limitar el amargor, se confitan lentamente las tiras de corteza de pomelo. Es una verdadera delicia con el café, después de la comida.', price: 1.15 }, 
                { id: 94, group: 3, name: 'Crema de caramelo', description: 'La crema de caramelo (o crema volteada) es un clásico de la cocina de bistro, es una crema de vainilla y huevos enteros, que se cocina en baño maría en un ramekin o molde cuyo fondo está cubierto de caramelo. Tradicionalmente se desmolda en el plato de servicio y el caramelo que se ha vuelto liquido cubre la crema.', price: 1.15 }, 
                { id: 95, group: 3, name: 'Crema de chocolate crujiente', description: 'Es una crema de chocolate en la que se mezcla, para darle una textura crujiente, pequeños cubos de corteza de pomelo o naranja confitada y nueces caramelizadas. El recipiente con la crema está rematado por una espuma de café irlandés (café, azúcar, whisky y nata).', price: 1.15 }, 
                { id: 96, group: 3, name: 'Crème brûlée', description: 'La crema catalana es bastante fácil de preparar, es una simple crema de huevo. Todo el desafío esta en conseguir la deliciosa capa de caramelo que la cubre, lo ideal es (para mí) tener una crema fría y bien untuosa y encima una capa de caramelo bien caliente. Es una nueva versión de la receta original, con vídeo.', price: 1.15 }, 
                { id: 97, group: 3, name: 'Crumble canadiense de manzanas', description: 'El crumble canadiense es una declinación del crumble clásico en dos aspectos particulares: Hay copos de avena en la masa, y las frutas (aquí manzanas) se riegan con un chorrito de jarabe de arce.', price: 1.15 }, 
                { id: 98, group: 3, name: 'Cupcakes de Arizona', description: 'Los cupcakes son pastelillos de origen americano, con una masa tipo galleta y cuya parte superior está generalmente cubierta de una decoración dulce con colores muy llamativos. Esta es una versión con la masa clásica y una decoración inspirada en los famosos cactus saguaro, tan numerosos en Arizona.', price: 1.15 }, 
                { id: 99, group: 3, name: 'Ensalada de fresa y kiwi', description: 'Esta es una receta muy simple pero deliciosa, donde kiwis y fresas mezclan sus sabores y colores, para una refrescante y colorida ensalada de verano.', price: 1.15 }, 
                { id: 100, group: 3, name: 'Ensalada de frutas', description: 'Para preparar una buena ensalada de frutas. Elegir frutas que vayan bien juntas. Ligar todo con un buen jarabe casero para acompañar los zumos de fruta, que no son suficientes por sí solos.', price: 1.15 }, 
                { id: 101, group: 3, name: 'Feuillantines de manzanas tibias', description: 'Es una receta larga, pero da un resultado muy espectacular para una comida de fiesta, por ejemplo. Se trata de un conjunto de 3 discos: una teja de almendras y otras dos de hojas de brick caramelizadas, con entre cada disco cuartos de manzanas también caramelizadas, y flameados con calvados. Todo ello realzado con un rosetón de crema chantilly y servido rodeado de crema inglesa.', price: 1.15 }, 
                { id: 102, group: 3, name: 'Fresas a la reducción de vino tinto', description: 'Las fresas al vino tinto son un postre bastante clásico, pero aquí le propongo una versión más sofisticada, donde el vino tinto se reduce a un jarabe ligero con notas de tomillo y limón.', price: 1.15 }, 
                { id: 103, group: 4, name: 'Zumo de manzanas con especias', description: 'Esta receta, de gran sencillez, le dará una bebida caliente, con un sabor bastante extraordinario de manzana y especias. Lo puede servir a sus invitados, por ejemplo como trou normand (pequeño cóctel que se sirve a la mitad de una larga cena), o bien para terminar una comida y acompañar un postre.', price: 1.15 }, 
                { id: 104, group: 4, name: 'Vino caliente Belle-Plagne', description: 'Si está en la nieve o en un lugar frío, seguramente disfrutará de este vino caliente que calienta eficientemente el cuerpo y a veces la mente... Probablemente existen tantas recetas de vino caliente como pistas de esquí, así que aquí le propongo una receta bastante básica que se puede variar fácilmente a su gusto.', price: 1.15 }, 
                { id: 105, group: 4, name: 'Margarita', description: 'Algunas recetas de cócteles.', price: 1.15 }, 
                { id: 106, group: 4, name: 'Crema de cassis (grosella negra)', description: 'Las cremas de fruta son generalmente, una base de alcohol neutro que se aromatiza mediante la maceración de las frutas y a la que se agrega un jarabe de azúcar. Ésta es, por supuesto, la base del célebre kir, mezcla de vino blanco seco y crema de grosella, pero también de todas sus variaciones con otras cremas.', price: 1.15 }, 
                { id: 107, group: 4, name: 'Chocolate caliente', description: 'Esta es una receta sencilla, que hace que los días fríos sean mucho más soportables, o que convierte el regreso de un paseo bajo la lluvia en un momento delicioso.', price: 1.15 }
            ]

        }
    },

    methods: {
        addToOrder(indice) {
            console.log( 'addToOrder -> eventBus.emit -> product.name: ' + this.products[indice].name )
            eventBus.$emit( 'orderadditem', this.products[indice] )
        },
        showProdModal(indice) {
            this.prodsel = indice
            console.log( 'showProdModal -> indice: ' + indice )
        },
        hideProdModal() {
            this.prodsel = -1
            console.log( 'hideProdModal -> close: X' )
        },

    }

})

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - TABS  comanda-products //

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - COMANDA comanda =>  

Vue.component('comanda', {
    
    template: `
    <div>

        <comanda-products></comanda-products>

        <comanda-order></comanda-order>

        <comanda-payordermodal></comanda-payordermodal>

    </div>
    `,

    data() { 
        return {
            orders: []
        }
    },

    methods: {
        archiveOrder(curseOrder) {
            this.orders.push(curseOrder)
        }
    },

    mounted() {
        eventBus.$on( 'curseorder', curseOrder => { this.archiveOrder(curseOrder) } )
    }

})

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - COMANDA comanda //

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MAIN Vue #app =>

var app = new Vue({

    el: '#app'
      
})

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MAIN Vue #app //