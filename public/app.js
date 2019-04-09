const elTableArrivalsBody = document.querySelector('#arrivalTableBody');
const elTableDepartsBody = document.querySelector('#departsTableBody');
const thFlightArrival = document.querySelectorAll('#arrivalTableHead th');
const thFlightDeparts = document.querySelectorAll('#departTableHead th');
const toggleSectionButtons = document.querySelectorAll('.toggleSection');
const arrivalsSection = document.querySelector('#arrivals');
const departsSection = document.querySelector('#departures');

let elString = '';
let keySort = 'arrival';
let flights = [];

const toggleTables = () => {
    [...toggleSectionButtons].forEach(button => {
        button.addEventListener('click', event => {
            if (event.target.textContent === 'Arrivals') {
                arrivalsSection.classList.remove('hidden');
                departsSection.classList.add('hidden');
                init(elTableArrivalsBody, thFlightArrival, 'from');
            } else {
                arrivalsSection.classList.add('hidden');
                departsSection.classList.remove('hidden');
                init(elTableDepartsBody, thFlightDeparts, 'to');
            }
        });
    });
};

// Order functionality event
const sortEventHandler = (table, thFlight, destination) => {
    [...thFlight].forEach(flight => {
        flight.addEventListener('click', function() {
            if (this.tagName === 'TH') {
                removeActive(thFlight, this);
                flights = sortByKey(flights, this.dataset.sortexpression, toggleOrder(this));
                renderTable(table, flights, destination);
            }
        });
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

const getFlights = (table, destination) => {
    fetch('./flights.json')
        .then(data => data.json())
        .then(res => {
            if (res.length) {
                if (destination === 'from') {
                    flights = res.filter(flight => flight.to.toLowerCase() === 'tel-aviv');
                } else {
                    flights = res.filter(flight => flight.to.toLowerCase() !== 'tel-aviv');
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
        elString += `
        <tr>
          <td>${flight.by}</td>
          <td>${flight.id}</td>
          <td>${toFrom}</td>
          <td>${flight.arrival}</td>
          <td>${flight.terminal}</td>
        </tr>
      `;
    });
    table.innerHTML = elString;
};

const removeFlights = table => {
    table.innerHTML = '';
};

// Helpers
const sortByKey = (obj, key, order = 'ASC') => {
    return order === 'ASC'
        ? obj.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0))
        : obj.sort((a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0));
};

const init = (tableBody, thFlight, destination) => {
    sortEventHandler(tableBody, thFlight, destination);
    getFlights(tableBody, destination);
    toggleTables();
};

init(elTableArrivalsBody, thFlightArrival, 'from');
