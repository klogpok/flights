const elTableBody = document.querySelector('#arrivalTableBody');
const thFlight = document.querySelectorAll('.thFlight');
let elString = '';
let keySort = 'arrival';
let flights = [];

[...thFlight].forEach(flight => {
    flight.addEventListener('click', function(event) {
        if (this.tagName === 'TH') {
            removeActive();
            this.style.color = '#fff';
            flights = sortByKey(flights, this.dataset.sortexpression);
            renderTable(flights);
        }
    });
});

const removeActive = () => {
    [...thFlight].forEach(th => {
        th.style.color = '#f1a931';
    });
};

const getFlights = () => {
    fetch('./flights.json')
        .then(data => data.json())
        .then(res => {
            if (res.length) {
                flights = res;
                sortedRes = sortByKey(res, keySort);
                renderTable(sortedRes);
            }
        });
};

const renderTable = flights => {
    removeFlights();
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
    elTableBody.innerHTML = elString;
};

const removeFlights = () => {
    elTableBody.innerHTML = '';
};

const sortByKey = (obj, key) => {
    return obj.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
};

getFlights();
