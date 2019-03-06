"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const dialogflow_fulfillment_1 = require("dialogflow-fulfillment");
const actions_on_google_1 = require("actions-on-google");
const decision_instruments_1 = require("./decision_instruments");
const helpers_1 = require("./helpers");
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
// 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agentBot = new dialogflow_fulfillment_1.WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    // Centor Criteria Intent
    function calculateCentorCriteria(agent) {
        const { parameters } = request.body.queryResult;
        const { age, tonsilarExudate, cervicalLymph, fever, cough } = parameters;
        console.log('Test Function parameters: ' + JSON.stringify(parameters));
        agent.add(decision_instruments_1.centorCalc(age, tonsilarExudate, cervicalLymph, fever, cough));
    }
    // Calculate Heart Score Intent
    function calculateHeartScore(agent) {
        const { parameters } = request.body.queryResult;
        const { suspicion, ekg, age, numRiskFactors, historyOfCAD, troponin } = parameters;
        console.log('Test Function parameters: ' + JSON.stringify(parameters));
        agent.add(decision_instruments_1.heartCalc(suspicion, ekg, age, numRiskFactors, historyOfCAD, troponin));
    }
    // Calculate local anesthetic dosing
    function calculateLocalAnestheticDose(agent) {
        const { parameters } = request.body.queryResult;
        const { unitWeight, localAnesthetic } = parameters;
        const { amount, unit } = unitWeight;
        const actualWeight = helpers_1.toKg(unitWeight);
        console.log(`amount: ${amount}, unit: ${unit}, actualWeight: ${actualWeight}, localAnesthetic: ${localAnesthetic}`);
        const conv = agent.conv();
        let tableRows;
        switch (localAnesthetic) {
            case 'lidocaine': {
                conv.ask(`Max dose of lidocaine in a ${amount}${unit} patient is ${helpers_1.lidocaineDosing(actualWeight)[1]}mg (4mg/kg) without addition of epinephrine and ${helpers_1.lidocaineDosing(actualWeight)[2]}mg (7mg/kg) if epinephrine is added.`);
                tableRows = helpers_1.lidocaineDosing(actualWeight)[0];
                break;
            }
            case 'bupivacaine': {
                conv.ask(`Max dose of bupivacaine in a ${amount}${unit} patient is ${(actualWeight * 2).toFixed(1)}mg (2mg/kg) without addition of epinephrine and ${actualWeight * 3}mg (3mg/kg) if epinephrine is added.`);
                tableRows = helpers_1.bupivacaineDosing(actualWeight)[0];
                break;
            }
            case 'ropivacaine': {
                conv.ask(`Max dose of ropivacaine in a ${amount}${unit} patient is ${(actualWeight * 3).toFixed(1)}mg (3mg/kg)`);
                tableRows = helpers_1.ropivacaineDosing(actualWeight)[0];
                break;
            }
            default: {
                conv.ask(`Sorry, I don't have information for that drug yet. I'm working hard to keep adding new information to my brain`);
            }
        }
        conv.ask(new actions_on_google_1.Table({
            title: `${localAnesthetic} dosing`,
            columns: ['formulation', 'max volume'],
            rows: tableRows,
            dividers: true
        }));
        agent.add(conv);
    }
    // Run the proper function handler based on the matched Dialogflow intent name
    const intentMap = new Map();
    intentMap.set('Centor Criteria - yes', calculateCentorCriteria);
    intentMap.set('Decision Instrument: HEART Score', calculateHeartScore);
    intentMap.set('CALC Anesthetic Dose', calculateLocalAnestheticDose);
    agentBot.handleRequest(intentMap);
});
//# sourceMappingURL=index.js.map