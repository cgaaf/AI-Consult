import * as functions from 'firebase-functions';

import { WebhookClient } from 'dialogflow-fulfillment';
import { Table }from 'actions-on-google';

import { centorCalc, heartCalc } from './decision_instruments';
import { toKg, lidocaineDosing, bupivacaineDosing, ropivacaineDosing } from './helpers';

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
// 
export const dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agentBot = new WebhookClient({ request, response });
      console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
      console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    
    // Centor Criteria Intent
        function calculateCentorCriteria(agent) {
            const { parameters } = request.body.queryResult;
            const { age, tonsilarExudate, cervicalLymph, fever, cough } = parameters;
            console.log('Test Function parameters: ' + JSON.stringify(parameters));
            
            agent.add(centorCalc(age, tonsilarExudate, cervicalLymph, fever, cough));
        }
    // Calculate Heart Score Intent
        function calculateHeartScore(agent) {
            const { parameters } = request.body.queryResult;
            const { suspicion, ekg, age, numRiskFactors, historyOfCAD, troponin } = parameters;
            console.log('Test Function parameters: ' + JSON.stringify(parameters));
            
            agent.add(heartCalc(suspicion, ekg, age, numRiskFactors, historyOfCAD, troponin));
        }

    // Calculate local anesthetic dosing
        function calculateLocalAnestheticDose(agent) {
            const { parameters } = request.body.queryResult;
            const { unitWeight, localAnesthetic } = parameters;
            const { amount, unit } = unitWeight;
            const actualWeight = toKg(unitWeight)

            console.log(`amount: ${amount}, unit: ${unit}, actualWeight: ${actualWeight}, localAnesthetic: ${localAnesthetic}`);

            const conv = agent.conv();

            let tableRows: string[][];

            switch (localAnesthetic) {
                case 'lidocaine': {
                    conv.ask(`Max dose of lidocaine in a ${amount}${unit} patient is ${lidocaineDosing(actualWeight)[1]}mg (4mg/kg; max 300mg) without addition of epinephrine and ${lidocaineDosing(actualWeight)[2]}mg (7mg/kg; max 500mg) if epinephrine is added.`);
                    tableRows = lidocaineDosing(actualWeight)[0];
                    break;
                }

                case 'bupivacaine': {
                    conv.ask(`Max dose of bupivacaine in a ${amount}${unit} patient is ${bupivacaineDosing(actualWeight)[1]}mg (2mg/kg; max 175mg) without addition of epinephrine and ${bupivacaineDosing(actualWeight)[2]}mg (3mg/kg; max 225mg) if epinephrine is added.`);
                    tableRows = bupivacaineDosing(actualWeight)[0];
                    break;
                }

                case 'ropivacaine': {
                    conv.ask(`Max dose of ropivacaine in a ${amount}${unit} patient is ${ropivacaineDosing(actualWeight)[1]}mg (3mg/kg; max 225mg)`);
                    tableRows = ropivacaineDosing(actualWeight)[0];
                    break;
                }

                default: {
                    conv.ask(`Sorry, I don't have information for that drug yet. I'm working hard to keep adding new information to my brain`);
                }
            }

            conv.ask(new Table({
                title: `${localAnesthetic[0].toUpperCase() + localAnesthetic.substring(1)} dosing`,
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
  intentMap.set('Drug Reference: Local Anesthetic Dose', calculateLocalAnestheticDose);
  
  agentBot.handleRequest(intentMap);
});