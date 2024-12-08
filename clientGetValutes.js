const soap = require('soap');
const proxiUrl = 'http://localhost:8000/wsdl?wsdl'; 
function getValute(code, startDate, endDate) {
    const args = {
        code: code,
        startDate: startDate,
        endDate: endDate
    };
    soap.createClient(proxiUrl, function(err, client) {
        if (err) throw err;
        client.getValute(args, function(err, result) {
            if (err) throw err;
            console.log('Полученные данные о валюте:', JSON.stringify(result.values));
        });
    });
}
getValute('R01010', '2023-03-01T00:00:00', '2023-03-15T00:00:00');