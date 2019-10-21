"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const actions_on_google_1 = require("actions-on-google");
const helpers_1 = require("./helpers");
const drug_dosing_1 = require("./drug-dosing");
const app = actions_on_google_1.dialogflow({
    debug: true
});
app.intent("Default Welcome Intent", conv => {
    console.log("Initialize welcome intent");
    conv.ask(`<speak>Hi I'm <sub alias="doctor">Dr.</sub> G!</speak>`);
});
app.catch((conv, error) => {
    console.error(error);
    conv.ask("Sorry I encountered a glitch. Can you try again?");
});
app.fallback(conv => {
    conv.ask(`I couldn't understand. Could you try again?`);
});
app.intent("Drug Reference - Local Anesthetic Dose", (conv, params) => {
    console.log("Intiializing Drug Reference: Local Anesthetic Dose");
    const weight = params.weight;
    const localAnesthetic = params.localAnesthetic;
    const { amount, unit } = weight;
    const actualWeight = helpers_1.toKg(params);
    let tableRows;
    switch (localAnesthetic) {
        case "lidocaine": {
            conv.ask(`Max dose of lidocaine in a ${amount}${unit} patient is ${drug_dosing_1.lidocaineDosing(actualWeight)[1]}mg (4mg/kg; max 300mg) without addition of epinephrine and ${drug_dosing_1.lidocaineDosing(actualWeight)[2]}mg (7mg/kg; max 500mg) if epinephrine is added.`);
            tableRows = drug_dosing_1.lidocaineDosing(actualWeight)[0];
            break;
        }
        case "bupivacaine": {
            conv.ask(`Max dose of bupivacaine in a ${amount}${unit} patient is ${drug_dosing_1.bupivacaineDosing(actualWeight)[1]}mg (2mg/kg; max 175mg) without addition of epinephrine and ${drug_dosing_1.bupivacaineDosing(actualWeight)[2]}mg (3mg/kg; max 225mg) if epinephrine is added.`);
            tableRows = drug_dosing_1.bupivacaineDosing(actualWeight)[0];
            break;
        }
        case "ropivacaine": {
            conv.ask(`Max dose of ropivacaine in a ${amount}${unit} patient is ${drug_dosing_1.ropivacaineDosing(actualWeight)[1]}mg (3mg/kg; max 225mg)`);
            tableRows = drug_dosing_1.ropivacaineDosing(actualWeight)[0];
            break;
        }
        default: {
            conv.ask(`Sorry, I don't have information for that drug yet. I'm working hard to keep adding new information to my brain`);
        }
    }
    conv.ask(new actions_on_google_1.Table({
        title: `${localAnesthetic[0].toUpperCase() +
            localAnesthetic.substring(1)} dosing`,
        columns: ["formulation", "max volume"],
        rows: tableRows,
        dividers: true
    }));
});
app.intent("REFERENCE_Intubation", (conv, params) => {
    console.log("Initialize Reference: Intubation Intent");
    conv.contexts.set("patient_size", 3, params);
    helpers_1.reportPatientType(conv, params);
    const table = new actions_on_google_1.Table({
        title: `RSI medications`,
        columns: ["Medication", "Dose", "Duration of Action"],
        rows: helpers_1.buildInductionTable(params).concat(helpers_1.buildParalyticTable(params)),
        dividers: true
    });
    conv.ask(table);
});
// app.intent("REFERENCE_Intubation - Equipment", (conv, params) => {
//   console.log("Initialize REFERENCE_Intubation - Equipment");
//   conv.ask("I've calculated ideal intubation equipment");
//   const table = new Table({
//     title: `Intubation Equipment`,
//     columns: ["", ""],
//     rows: buildIntubationEquipmentTable(params),
//     dividers: true
//   });
//   conv.ask(table);
//   conv.contexts.set("patient_size", 3, params);
// });
app.intent("REFERENCE_Intubation - Equipment", helpers_1.buildIntubationEquipmentTable);
exports.fulfillment = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map