import * as functions from 'firebase-functions';
import { dialogflow, Table } from 'actions-on-google';
import { 
    toKg, 
    ageToBroselowColor, 
    ageToKg,
    lidocaineDosing, 
    bupivacaineDosing,
    ropivacaineDosing } from './helpers';

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
    const actualWeight = toKg(unitWeight)

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

    const unitWeight = params.unitWeight;
    const age = params.age;
    const color: any = params.color;
    const patientType = params.patientType;

    if (unitWeight) {
        conv.ask('Return dosing based on weight');
    } else if (age) {
        console.log(`AGE`, age)
        conv.ask('Return dosing based on age');
        conv.ask(`Assumed weight is ${ageToKg(age)} based on a broselow color of ${ageToBroselowColor(age)}`)
    } else if (color) {
        console.log(`COLOR`, color)
        const broselowColors = ['gray', 'pink', 'red', 'purple', 'yellow', 'white', 'blue', 'orange', 'green'];
        
        if (broselowColors.indexOf(color) > -1) {
            conv.ask(`Return dosing based on broselow color of ${color}`);
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