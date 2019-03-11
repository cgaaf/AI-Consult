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
    conv.ask('Welcome to AI Consult');
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
    const actualWeight = helpers_1.toKg(unitWeight);
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
app.intent('Reference: Intubation', ((conv, params) => {
    console.log('Initialize Reference: Intubation Intent');
    const unitWeight = params.unitWeight;
    const age = params.age;
    const color = params.color;
    const patientType = params.patientType;
    if (unitWeight) {
        conv.ask('Return dosing based on weight');
    }
    else if (age) {
        console.log(`AGE`, age);
        conv.ask('Return dosing based on age');
        conv.ask(`Assumed weight is ${helpers_1.ageToKg(age)} based on a broselow color of ${helpers_1.ageToBroselowColor(age)}`);
    }
    else if (color) {
        console.log(`COLOR`, color);
        const broselowColors = ['gray', 'pink', 'red', 'purple', 'yellow', 'white', 'blue', 'orange', 'green'];
        if (broselowColors.indexOf(color) > -1) {
            conv.ask(`Return dosing based on broselow color of ${color}`);
        }
        else {
            conv.ask(`A valid broselow color was not provided`);
        }
    }
    else if (patientType) {
        conv.ask(`Return dosing based on patient type`);
    }
    else {
        conv.ask('Return dosing based on standard adult size of 70kg');
    }
}));
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map