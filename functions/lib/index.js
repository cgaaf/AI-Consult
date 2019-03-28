"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const actions_on_google_1 = require("actions-on-google");
const helpers_1 = require("./helpers");
const app = actions_on_google_1.dialogflow({
    debug: true
});
app.intent('Default Welcome Intent', (conv => {
    console.log('Initialize welcome intent');
    conv.ask(`<speak>Hi I'm <sub alias="doctor">Dr.</sub> G!</speak>`);
}));
app.catch((conv, error) => {
    console.error(error);
    conv.ask('Sorry I encountered a glitch. Can you try again?');
});
app.fallback((conv) => {
    conv.ask(`I couldn't understand. Could you try again?`);
});
app.intent('Drug Reference: Local Anesthetic Dose', ((conv, params) => {
    console.log("Intiializing Drug Reference: Local Anesthetic Dose");
    const unitWeight = params.unitWeight;
    const localAnesthetic = params.localAnesthetic;
    const { amount, unit } = unitWeight;
    const actualWeight = helpers_1.toKg(params);
    let tableRows;
    switch (localAnesthetic) {
        case 'lidocaine': {
            conv.ask(`Max dose of lidocaine in a ${amount}${unit} patient is ${helpers_1.lidocaineDosing(actualWeight)[1]}mg (4mg/kg; max 300mg) without addition of epinephrine and ${helpers_1.lidocaineDosing(actualWeight)[2]}mg (7mg/kg; max 500mg) if epinephrine is added.`);
            tableRows = helpers_1.lidocaineDosing(actualWeight)[0];
            break;
        }
        case 'bupivacaine': {
            conv.ask(`Max dose of bupivacaine in a ${amount}${unit} patient is ${helpers_1.bupivacaineDosing(actualWeight)[1]}mg (2mg/kg; max 175mg) without addition of epinephrine and ${helpers_1.bupivacaineDosing(actualWeight)[2]}mg (3mg/kg; max 225mg) if epinephrine is added.`);
            tableRows = helpers_1.bupivacaineDosing(actualWeight)[0];
            break;
        }
        case 'ropivacaine': {
            conv.ask(`Max dose of ropivacaine in a ${amount}${unit} patient is ${helpers_1.ropivacaineDosing(actualWeight)[1]}mg (3mg/kg; max 225mg)`);
            tableRows = helpers_1.ropivacaineDosing(actualWeight)[0];
            break;
        }
        default: {
            conv.ask(`Sorry, I don't have information for that drug yet. I'm working hard to keep adding new information to my brain`);
        }
    }
    conv.ask(new actions_on_google_1.Table({
        title: `${localAnesthetic[0].toUpperCase() + localAnesthetic.substring(1)} dosing`,
        columns: ['formulation', 'max volume'],
        rows: tableRows,
        dividers: true
    }));
}));
app.intent('REFERENCE_Intubation', ((conv, params) => {
    console.log('Initialize Reference: Intubation Intent');
    // const unitWeight: any = params.unitWeight;
    // const age: any = params.age;
    // const color: any = params.color;
    // const patientType = params.patientType;
    // const weight = toKg(params);
    helpers_1.reportPatientType(conv, params);
    const table = new actions_on_google_1.Table({
        title: `RSI medications`,
        columns: ['Medication', 'Dose', 'Duration of Action'],
        rows: helpers_1.buildInductionTable(params).concat(helpers_1.buildParalyticTable(params)),
        dividers: true
    });
    conv.ask(table);
    // if (unitWeight) {
    //     conv.ask(`Weight based dosing based on input weight of ${weight}kg`);
    //     conv.ask(table)
    // } else if (age) {
    //     conv.ask(`Estimated weight of a of ${age.amount} ${age.unit} old is ${weight}kg based on a broselow color of ${toBroselow(params)}`)
    //     conv.ask(table)
    // } else if (color) {
    //     const broselowColors = ['gray', 'pink', 'red', 'purple', 'yellow', 'white', 'blue', 'orange', 'green'];
    //     if (broselowColors.indexOf(color) > -1) {
    //         conv.ask(`Assumed weight is ${weight}kg based on broselow color of ${color}`);
    //         conv.ask(table)
    //     } else {
    //         conv.ask(`A valid broselow color was not provided`);
    //     }
    // } else if (patientType) {
    //     conv.ask(`Return dosing based on patient type`);
    // } else {
    //     conv.ask('Return dosing based on standard adult size of 70kg');
    // }
}));
app.intent('REFERENCE_Intubation - Equipment', ((conv, params) => {
    conv.ask("Initialize Intubation Equipment");
}));
app.intent('REFERENCE_VentilatorSettings', ((conv, params) => {
    console.log('Initialize REFERENCE_VentilatorSettings');
    const patientSize = conv.contexts.get('patientSize');
    console.log(patientSize);
    const contextParameters = patientSize.parameters;
    console.log('Conext Parameters:');
    console.log(contextParameters);
    conv.ask('Here are starter vent settings');
}));
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map