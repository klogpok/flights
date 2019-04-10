const elTableArrivalsBody = document.querySelector('#arrivalTableBody');
const elTableDepartsBody = document.querySelector('#departsTableBody');
const thFlightArrival = document.querySelectorAll('#arrivalTableHead th');
const thFlightDeparts = document.querySelectorAll('#departTableHead th');
const toggleSectionButtons = document.querySelectorAll('.toggleSection');
const arrivalsSection = document.querySelector('#arrivals');
const departsSection = document.querySelector('#departures');
const searchCityInput = document.querySelector('#citySearch');
const btnSearch = document.querySelector('#btn-search');
const btnClear = document.querySelector('#btn-clear');

let elString = '';
let keySort = 'arrival';
let flights = [];
let currentTable = elTableArrivalsBody;
let currentThs = thFlightArrival;
let currentDestination = 'from';
let searchValue = '';

const toggleTables = () => {
    [...toggleSectionButtons].forEach(button => {
        button.addEventListener('click', function (event) {
            clearActiveSection();
            button.classList.toggle('active');

            if (event.target.textContent === 'Arrivals') {
                arrivalsSection.classList.remove('hidden');
                departsSection.classList.add('hidden');
                currentTable = elTableArrivalsBody;
                currentThs = thFlightArrival;
                currentDestination = 'from';
                init(currentTable, currentThs, currentDestination);
            } else {
                arrivalsSection.classList.add('hidden');
                departsSection.classList.remove('hidden');
                currentTable = elTableDepartsBody;
                currentThs = thFlightDeparts;
                currentDestination = 'to';
                init(currentTable, currentThs, currentDestination);
            }
        });
    });
};

const clearActiveSection = () => {
    [...toggleSectionButtons].forEach(button => {
        button.classList.remove('active');
    });
};

// Order functionality event
const sortEventHandler = (table, thFlight, destination) => {
    [...thFlight].forEach(flight => {
        flight.addEventListener('click', function () {
            if (this.tagName === 'TH') {
                removeActive(thFlight, this);
                flights = sortByKey(flights, this.dataset.sortexpression, toggleOrder(this));
                renderTable(table, flights, destination);
            }
        });
    });
};

const removeActive = (thFlight, activeTh) => {
    [...thFlight].forEach(th => {
        if (th !== activeTh) {
            th.style.color = '#f1a931';
            th.children[0].children[1].innerHTML = '&uarr;';
        } else {
            th.style.color = '#fff';
        }
    });
};

const toggleOrder = currentTh => {
    let elSort = currentTh.children[0].children[1];
    let order = '';

    if (elSort.innerHTML === '↓') {
        order = 'ASC';
        elSort.innerHTML = '&uarr;';
    } else {
        order = 'DESC';
        elSort.innerHTML = '&darr;';
    }
    return order;
};

const setDefaultTh = () => {
    [...currentThs].forEach(th => {
        if (th.dataset.sortexpression === 'arrival' || th.dataset.sortexpression === 'departure') {
            th.style.color = '#fff';
        } else {
            th.style.color = '#f1a931';
        }
        th.children[0].children[1].innerHTML = '&uarr;';
    });
};

const getFlights = (table, destination, query) => {
    fetch('./flights.json')
        .then(data => data.json())
        .then(res => {
            if (res.length) {
                if (destination === 'from') {
                    if (query) {
                        flights = res.filter(
                            flight =>
                                flight.to.toLowerCase() === 'tel-aviv' &&
                                flight.from.toLowerCase() === query.toLowerCase()
                        );
                    } else {
                        flights = res.filter(flight => flight.to.toLowerCase() === 'tel-aviv');
                    }
                } else {
                    if (query) {
                        flights = res.filter(
                            flight =>
                                flight.to.toLowerCase() !== 'tel-aviv' &&
                                flight.to.toLowerCase() === query.toLowerCase()
                        );
                    } else {
                        flights = res.filter(flight => flight.to.toLowerCase() !== 'tel-aviv');
                    }
                }
                sortedRes = sortByKey(flights, keySort);
                renderTable(table, sortedRes, destination);
            }
        });
};

const renderTable = (table, flights, destination) => {
    removeFlights(table);
    elString = '';

    flights.forEach(flight => {
        let toFrom = flight[`${destination}`];
        let time = destination === 'from' ? flight.arrival : flight.departure;
        elString += `
        <tr>
          <td>${flight.by}</td>
          <td>${flight.id}</td>
          <td>${toFrom}</td>
          <td>${time}</td>
          <td>${flight.terminal}</td>
        </tr>
      `;
    });
    table.innerHTML = elString;
};

const removeFlights = table => {
    table.innerHTML = '';
};

searchCityInput.onchange = event => {
    if (event.target.value) {
        searchValue = event.target.value;
    }
};

btnClear.addEventListener('click', () => {
    searchValue = '';
    init(currentTable, currentThs, currentDestination);
});

btnSearch.addEventListener('click', event => {
    if (searchValue) {
        init(currentTable, currentThs, currentDestination, searchValue);
        searchValue = '';
        searchCityInput.value = '';
    }
});

// Helpers
const sortByKey = (obj, key, order = 'ASC') => {
    return order === 'ASC'
        ? obj.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0))
        : obj.sort((a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0));
};

const init = (tableBody, thFlight, destination, query = '') => {
    setDefaultTh();
    getFlights(tableBody, destination, query);
};

sortEventHandler(elTableArrivalsBody, thFlightArrival, 'from');
sortEventHandler(elTableDepartsBody, thFlightDeparts, 'to');
init(currentTable, currentThs, currentDestination);
toggleTables();
