function toggle(type) {
    switch (type) {
        case 'arri':
            document.querySelector('#dep-section').classList.add('hidden');
            document.querySelector('#arri-section').classList.remove('hidden');
            break;

        case 'dep':
            document.querySelector('#arri-section').classList.add('hidden');
            document.querySelector('#dep-section').classList.remove('hidden');
            break;
    }
}

const elTableArrivals = document.querySelector('#arrivalTable');
const elTableDeparts = document.querySelector('#departsTable');
const elTableArrivalsBody = document.querySelector('#arrivalTableBody');
const elTableDepartsBody = document.querySelector('#departsTableBody');
const thFlightArrival = document.querySelectorAll('#arrivalTableHead th');

//const thFlightDeparts = document.querySelectorAll('.thFlight');
let elString = '';
let keySort = 'arrival';
let flights = [];

// Order functionality event
const sortEventHandler = (table, thFlight) => {
    [...thFlight].forEach(flight => {
        flight.addEventListener('click', function() {
            if (this.tagName === 'TH') {
                removeActive(thFlight, this);
                flights = sortByKey(flights, this.dataset.sortexpression, toggleOrder(this));
                renderTable(table, flights);
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
                if (destination === 'Tel-Aviv') {
                    flights = res.filter(
                        flight => flight.to.toLowerCase() === destination.toLowerCase()
                    );
                } else {
                    flights = res.filter(flight => flight.to.toLowerCase() !== 'tel-aviv');
                }
                sortedRes = sortByKey(flights, keySort);
                renderTable(table, sortedRes);
            }
        });
};

const renderTable = (table, flights) => {
    removeFlights(table);
    elString = '';
    flights.forEach(flight => {
        elString += `
        <tr>
          <td>${flight.by}</td>
          <td>${flight.id}</td>
          <td>${flight.from}</td>
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

const init = () => {
    sortEventHandler(elTableArrivalsBody, thFlightArrival);
    getFlights(elTableArrivalsBody, 'Tel-Aviv');
};

init();
