// script.js
document.addEventListener("DOMContentLoaded", function () {
    // Sample data for the charts
    const leavesData = [3, 5, 2, 8, 4];
    const hoursData = [160, 180, 170, 190, 175];
    const salaryData = [49000, 48000, 60000, 72000, 69000];

    // Create bar charts using Chart.js for leaves, working hours, and salary
    createBarChart('leavesChart', 'Leaves Taken', leavesData, 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)');
    createBarChart('hoursChart', 'Working Hours', hoursData, 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)');
    createBarChart('salaryChart', 'Past Salary', salaryData, 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)');

    // Populate the events list (replace with your events data)
    const eventsList = document.getElementById('eventsList');
    const events = ['Event 1 - 19/11/23', 'Event 2 - 11/12/23', 'Event 3 - 17/12/23'];
    events.forEach(event => {
        const li = document.createElement('li');
        li.textContent = event;
        eventsList.appendChild(li);
    });

    // Populate the payroll summary table (replace with your payroll data)
    const payrollTable = document.getElementById('payrollTable');
    const payrollData = [
        { month: 'January', salary: '$7000' },
        { month: 'February', salary: '$5200' },
        { month: 'March', salary: '$5300' },
        { month: 'April', salary: '$3000' },
        { month: 'May', salary: '$5200' },
        { month: 'June', salary: '$5300' },
        { month: 'July', salary: '$5000' },
        { month: 'August', salary: '$6200' },
        { month: 'September', salary: '$5300' },
        { month: 'October', salary: '$6000' }
        

        // Add more rows for each month
    ];

    payrollData.forEach(row => {
        const tr = document.createElement('tr');
        const tdMonth = document.createElement('td');
        tdMonth.textContent = row.month;
        const tdSalary = document.createElement('td');
        tdSalary.textContent = row.salary;
        tr.appendChild(tdMonth);
        tr.appendChild(tdSalary);
        payrollTable.appendChild(tr);
    });
});

function createBarChart(id, label, data, bgColor, borderColor) {
    const chart = new Chart(document.getElementById(id), {
        type: 'bar',
        data: {
            labels: ['Jay', 'Sahil', 'Rajan', 'Simar', 'Rahul'],
            datasets: [{
                label: label,
                data: data,
                backgroundColor: bgColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
