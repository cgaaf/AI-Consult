import * as functions from 'firebase-functions';

import { WebhookClient } from 'dialogflow-fulfillment';
import { centorCalc, heartCalc } from './decision_instruments';

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
// 
export const dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agentBot = new WebhookClient({ request, response });
    //   console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    //   console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    
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



  // Run the proper function handler based on the matched Dialogflow intent name
  const intentMap = new Map();
  intentMap.set('Centor Criteria - yes', calculateCentorCriteria);
  intentMap.set('Calculate Heart Score', calculateHeartScore);
  agentBot.handleRequest(intentMap);
});