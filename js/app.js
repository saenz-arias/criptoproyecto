const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');



const objBusqueda = {
    moneda: '',
    criptomoneda : ''
}

// Crear un Promise
const obtenerCriptomonedas  = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then( respuesta => respuesta.json() ) 
        .then( resultado => obtenerCriptomonedas(resultado.Data))
        .then( criptomonedas => selectCriptomonedas(criptomonedas) )
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    })
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();
    
    // validar
    const { moneda, criptomoneda } = objBusqueda;

    if(moneda === '' || criptomoneda === '' ) {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar la API con los resultados
    consultarAPI();

}

function mostrarAlerta(msg) {

    const existeError = document.querySelector('.error');

    if(!existeError) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
    
        // mensaje de eror
        divMensaje.textContent = msg;
    
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( cotizacion => {
            mostrarCotizacionHTML(cotizacion.RAW[criptomoneda][moneda]);
        })
}

function mostrarCotizacionHTML(cotizacion) {

    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const cantidad = document.querySelector('#cantidad').value;
    const cant = parseFloat(cantidad);

    // const precioso = parseFloat(PRICE).value;
    // const precioso = parseFloat(PRICE.replace(/\$/, ''));
    // const avaluo = precioso / cant;

    const avaluo = cant / PRICE;

    console.log(avaluo);
    // console.log(PRICE);

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `La cotizacion actual es: <span>${PRICE}</span>`;

    const tipoCambio = document.createElement('p');
    tipoCambio.classList.add('equivalente');
    tipoCambio.innerHTML = `<h4>Su equivalente en Criptomoneda: <span>${avaluo}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;


    resultado.appendChild(precio);
    resultado.appendChild(tipoCambio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    

    // convertirBTC();
}


function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
}


// function convertirBTC(cambio){
 
//         const { PRICE } = cambio;

//         final = cambio * cantidad;

//     const final = document.createElement('p');
//     final.classList.add('precio');
//     final.innerHTML = `El Precio es: <span>${final}</span>`;


//     resultado.appendChild(ultimaActualización);

    
//         const cantidad = document.querySelector('#cantidad').textContent;
//         const cant = parseFloat(cantidad);
 
//         console.log(cant);
    
// }








