import * as functions from 'firebase-functions';
import { dialogflow, Table } from 'actions-on-google';
import { 
    toKg, 
    ageToBroselowColor,
    lidocaineDosing, 
    bupivacaineDosing,
    ropivacaineDosing,
    buildInductionTable,
    buildParalyticTable
 } from './helpers';

const app = dialogflow({
    debug: true
});

app.intent('Default Welcome Intent', (conv => {
    console.log('Initialize welcome intent')
    conv.ask('Welcome to AI Consult');
}));

app.catch((conv, error) => {
    console.error(error);
    conv.ask('Sorry I encountered a glitch. Can you try again?')
});

app.fallback((conv) => {
    conv.ask(`I couldn't understand. Could you try again?`)
});

app.intent('Drug Reference: Local Anesthetic Dose', ((conv, params) => {
    console.log("Intiializing Drug Reference: Local Anesthetic Dose")
    const unitWeight: any = params.unitWeight;
    const localAnesthetic: any = params.localAnesthetic;
    const { amount, unit } = unitWeight;
    const actualWeight = toKg(params)

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

}));

app.intent('Reference: Intubation', ((conv, params) => {
    console.log('Initialize Reference: Intubation Intent');

    const unitWeight: any = params.unitWeight;
    const age: any = params.age;
    const color: any = params.color;
    const patientType = params.patientType;
    const weight = toKg(params);

    const table = new Table({
        title: `RSI medications`,
        columns: ['Medication', 'Dose', 'Duration of Action'],
        rows: buildInductionTable(params).concat(buildParalyticTable(params)),
        dividers: true
    })

    if (unitWeight) {
        conv.ask(`Weight based dosing based on input weight of ${weight}kg`);
        conv.ask(table)
    } else if (age) {
        conv.ask(`Estimated weight of a of ${age.amount} ${age.unit} old is ${weight}kg based on a broselow color of ${ageToBroselowColor(age)}`)
        conv.ask(table)
    } else if (color) {
        const broselowColors = ['gray', 'pink', 'red', 'purple', 'yellow', 'white', 'blue', 'orange', 'green'];

        if (broselowColors.indexOf(color) > -1) {
            conv.ask(`Assumed weight is ${weight}kg based on broselow color of ${color}`);
            conv.ask(table)
        } else {
            conv.ask(`A valid broselow color was not provided`);
        }

    } else if (patientType) {
        conv.ask(`Return dosing based on patient type`);
    } else {
        conv.ask('Return dosing based on standard adult size of 70kg');
    }
    
}));

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);