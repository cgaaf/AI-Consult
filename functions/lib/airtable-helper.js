"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyHXjHPi0Is0wuaJ'
});
const base = Airtable.base('appSgGFlFwpycQkxR');
// export async function getResidents() {
// const residents = [];
//     base('Residents').select({
//         view: 'Grid view'
//     }).firstPage(function(err, records) {
//         if (err) { console.error(err); return; }
//         records.forEach(function(record) {
//             residents.push(record.get('Name'));
//         });
//     });
// return residents;
// }
function getChris() {
    const chris = base('Residents').find('recty67sTbABP0kzo', function (err, record) {
        if (err) {
            console.error(err);
            return;
        }
        return record;
    });
    return chris;
}
exports.getChris = getChris;
//# sourceMappingURL=airtable-helper.js.map