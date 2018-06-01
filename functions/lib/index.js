"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const dialogflow_fulfillment_1 = require("dialogflow-fulfillment");
const decision_instruments_1 = require("./decision_instruments");
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
// 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agentBot = new dialogflow_fulfillment_1.WebhookClient({ request, response });
    //   console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    //   console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
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
    // Run the proper function handler based on the matched Dialogflow intent name
    const intentMap = new Map();
    intentMap.set('Centor Criteria - yes', calculateCentorCriteria);
    intentMap.set('Decision Instrument: HEART Score', calculateHeartScore);
    agentBot.handleRequest(intentMap);
});
//# sourceMappingURL=index.js.map