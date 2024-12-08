const soap = require('soap');
const http = require('http');
const myService = {
    DailyInfo: {
        DailyInfoSoap: {
            getValutes: function(args, callback) {
                const url = 'https://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx?WSDL';
                soap.createClient(url, function(err, client) {
                    if (err) throw err;
                    client.EnumValutesXML({ Seld: false }, function(err, result) {
                        if (err) throw err;
                        const valutes = result.EnumValutesXMLResult.Valute.map(valute => ({
                            code: valute.Code,
                            name: valute.Name,
                            value: valute.Value
                        }));
                        callback(null, { valutes });
                    });
                });
            },
            getValute: function(args, callback) {
                const url = 'https://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx?WSDL';
                soap.createClient(url, function(err, client) {
                    if (err) throw err;
                    client.GetCursDynamicXML({
                        FromDate: args.startDate,
                        ToDate: args.endDate,
                        ValutaCode: args.code
                    }, function(err, result) {
                        if (err) throw err;

                        // Преобразуем результат в нужный формат
                        const values = result.GetCursDynamicXMLResult.Curs.map(entry => ({
                            date: entry.Date,
                            value: entry.Value
                        }));
                        callback(null, { values });
                    });
                });
            }
        }
    }
};

const xml = require('fs').readFileSync('myservice.wsdl', 'utf8');
const server = http.createServer((request, response) => {
    response.end('404: Not Found: ' + request.url);
}).listen(8000);
soap.listen(server, '/wsdl', myService, xml);
console.log('SOAP сервер запущен на порту 8000');