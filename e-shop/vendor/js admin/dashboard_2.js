// Example JSON data
const siteVisitData = {
    "1st Mon": 30,
    "2nd Tue": 21,
    "3rd Wed": 25,
    "4th Thu": 40,
    "5th Fri": 35,
    "6th Sat": 50,
    "7th Sun": 60,
    "8th Mon": 45,
    "9th Tue": 55,
    "10th Wed": 65,
    "11th Thu": 30,
    "12th Fri": 75
  };

document.addEventListener('DOMContentLoaded', async function () {

    await getDorngAnalytics();

});
  
// Convert the data to the format expected by ApexCharts
var categories;
var dataSeries1; // For series1
var dataSeries2; // Example modification for series2

async function getDorngAnalytics() {
    const apiUrl = "https://api.payuee.com/get-dorng-analytics";

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include', // set credentials to include cookies
    };

    try {
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.error === 'failed to get user from request') {
                // need to do a data of just null event 
                // displayErrorMessage();
            } else if (errorData.error === 'failed to retrieve site visits') {
                // need to do a data of just null event 
                
            } else if  (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                // let's log user out the users session has expired
                logout();
            }else {
                // displayErrorMessage();
            }

            return;
        }

        const responseData = await response.json();
        updateAnalyticsData(responseData.user_analytics);
        categories = Object.keys(responseData.site_visits);
        dataSeries1 = Object.values(responseData.site_visits); // For series1
        dataSeries2 = dataSeries1.map(val => val * 0.8); // Example modification for series2
        renderChart();
} finally {

    }
}

function updateAnalyticsData(data) {
  // Helper function to format percentage with +/- sign
  function formatPercentage(change, isBetter) {
    return `${isBetter ? '+' : '-'}${formatNumber(change)}%`;
  }

  // Update Total Revenue
  document.getElementById("revenue-amount").innerText = `₦${formatNumber(data.total_revenue)}`;
  let revenuePercentageElement = document.getElementById("revenue-percentage");
  revenuePercentageElement.innerText = formatPercentage(data.revenue_change, data.is_revenue_better);
  revenuePercentageElement.className = data.is_revenue_better ? 'font-success' : 'font-danger';

  // Dynamically update the revenue arrow icon
  let revenueIcon = document.querySelector("#total-revenue .arrow-chart use");
  revenueIcon.setAttribute('href', data.is_revenue_better ? '#arrow-chart-up' : '#arrow-chart');

  // Update Total Sales
  document.getElementById("sales-amount").innerText = `${formatNumber(data.total_sales)} NGN`;
  let salesPercentageElement = document.getElementById("sales-percentage");
  salesPercentageElement.innerText = formatPercentage(data.sales_change, data.is_sales_better);
  salesPercentageElement.className = data.is_sales_better ? 'font-success' : 'font-danger';

  // Dynamically update the sales arrow icon
  let salesIcon = document.querySelector("#total-sales .arrow-chart use");
  salesIcon.setAttribute('href', data.is_sales_better ? '#arrow-chart-up' : '#arrow-chart');

  // Update Total Customer
  document.getElementById("customer-amount").innerText = `${formatNumber(data.total_customers)}`;
  let customerPercentageElement = document.getElementById("customer-percentage");
  customerPercentageElement.innerText = formatPercentage(data.customer_change, data.is_customers_better);
  customerPercentageElement.className = data.is_customers_better ? 'font-success' : 'font-danger';

  // Dynamically update the customer arrow icon
  let customerIcon = document.querySelector("#total-customer .arrow-chart use");
  customerIcon.setAttribute('href', data.is_customers_better ? '#arrow-chart-up' : '#arrow-chart');

  // Update Total Product
  document.getElementById("product-amount").innerText = `${formatNumber(data.total_products)}`;
  let productPercentageElement = document.getElementById("product-percentage");
  productPercentageElement.innerText = formatPercentage(data.product_change, data.is_products_better);
  productPercentageElement.className = data.is_products_better ? 'font-success' : 'font-danger';

  // Dynamically update the product arrow icon
  let productIcon = document.querySelector("#total-product .arrow-chart use");
  productIcon.setAttribute('href', data.is_products_better ? '#arrow-chart-up' : '#arrow-chart');
}

function formatNumber(num) {
  // Ensure the number is a float
  let parts = num.toString().split('.');
  
  // Format the integer part with commas
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Join the integer and decimal parts if any
  return parts.join('.');
}

function renderChart() {

var options = {
    series: [{
      name: 'Revenue',
      data: [92, 64, 43, 80, 58, 92, 46, 76, 80]
    }, {
      name: 'Revenue',
      data: [20, 48, 69, 32, 54, 20, 66, 36, 32],
    },
  ],
  chart: {
    type: 'bar',
    offsetY: 30,
    toolbar: {
      show: false
    },
    height: 100,
    stacked: true,
  },
   states: {          
    hover: {
      filter: {
        type: 'darken',
        value: 1,
      }
    }           
  },
  plotOptions: {
    bar: {
      horizontal: false,
      s̶t̶a̶r̶t̶i̶n̶g̶S̶h̶a̶p̶e̶: 'flat',
      e̶n̶d̶i̶n̶g̶S̶h̶a̶p̶e̶: 'flat',
      borderRadius: 3,
      columnWidth: '55%',
    }
  },  
  dataLabels: {
    enabled: false
  },
  grid: {
    yaxis: {
      lines: {
          show: false
      }
    },
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    dataLabels: {
      enabled: true
    },
  },
  fill: {
    opacity: 1,
    colors: [DorngAdminConfig.primary, '#dedffc']
  },
  legend: {
    show: false
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex,}) {
      return '<div class="apex-tooltip p-2">' + '<span>' + '<span class="bg-primary">' + '</span>' + 'Revenue' + '<h3>' + '$'+ series[seriesIndex][dataPointIndex] + '<h3/>'  + '</span>' + '</div>';
    },
  },
};

  // customer chart
  var chart = new ApexCharts(document.querySelector("#total-customer-chart"), options);
  chart.render();
  var income = {
    series: [80],
    chart: {
      type: 'radialBar',
      offsetY: 50,
      height: 180, 
      sparkline: {
        enabled: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '55%',
        },
        track: {
          background: "#daeef7",
          strokeWidth: '120%',
        },
        dataLabels: {
          name: {
            show: false,
            color: 'var(--title)',
            fontSize: '17px',
          },
          value: {
            offsetY: -2,
            fontSize: '22px',
          }
        }
      }
    },
    xaxis: {
    },
    stroke: {
      lineCap: 'round'
    },
    colors: ['#44A8D7'],
  };

var IncomechrtchartEl = new ApexCharts(document.querySelector("#total-product-chart"), income);
IncomechrtchartEl.render();
var options1 = {
    chart: {
      height: 200,
      type: 'area',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    series: [{
      name: 'Series 1',
      data: dataSeries1
    }, {
      name: 'Series 2',
      data: dataSeries2 // Modify this as per your requirement
    }],
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: "13px",
          colors: "#959595",
          fontFamily: "Lexend, sans-serif",
        },
      },
      axisBorder: {
        show: false
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val;
        },
        style: {
          fontSize: "14px",
          colors: "#000000",
          fontWeight: 500,
          fontFamily: "Lexend, sans-serif",
        },
      },
    },
    grid: {
      show: false,
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
    legend: {
      show: false,
    },
    fill: {
      colors: ['#44A8D7', '#dedffc'],
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      },
    },
    colors: ['#44A8D7', '#dedffc'],
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex }) {
        return '<div class="apex-tooltip p-2">' +
          '<span>' +
          '<span class="bg-primary">' +
          '</span>' +
          'Visitors' +
          '<h3>' + series[seriesIndex][dataPointIndex] + '<h3/>' +
          '</span>' +
          '</div>';
      },
    },
  };
  

var chart1 = new ApexCharts(
  document.querySelector("#area-line"),
  options1
);
chart1.render();

}

async function logout() {
    // also send a request to the logout api endpoint
    const apiUrl = "https://api.payuee.com/log-out";

    const requestOptions = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: 'include', // set credentials to include cookies
    };
    
try {
    const response = await fetch(apiUrl, requestOptions);
    
    if (!response.ok) {
            // alert('an error occurred. Please try again');
                if (!response.ok) {
        alert('an error occurred. Please try again');
        return;
    }
        return;
      }
        const data = await response.json();
        localStorage.removeItem('auth')
        window.location.href = '../shop.html'
    } finally{
        // do nothing
    }
}