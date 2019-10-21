import * as functions from "firebase-functions";
import { dialogflow, Table } from "actions-on-google";
import {
  toKg,
  buildInductionTable,
  buildParalyticTable,
  reportPatientType,
  buildIntubationEquipmentTable
} from "./helpers";

import {
  lidocaineDosing,
  bupivacaineDosing,
  ropivacaineDosing
} from "./drug-dosing";

const app = dialogflow({
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
  const weight: any = params.weight;
  const localAnesthetic: any = params.localAnesthetic;
  const { amount, unit } = weight;
  const actualWeight = toKg(params);

  let tableRows: string[][];

  switch (localAnesthetic) {
    case "lidocaine": {
      conv.ask(
        `Max dose of lidocaine in a ${amount}${unit} patient is ${
          lidocaineDosing(actualWeight)[1]
        }mg (4mg/kg; max 300mg) without addition of epinephrine and ${
          lidocaineDosing(actualWeight)[2]
        }mg (7mg/kg; max 500mg) if epinephrine is added.`
      );
      tableRows = lidocaineDosing(actualWeight)[0];
      break;
    }

    case "bupivacaine": {
      conv.ask(
        `Max dose of bupivacaine in a ${amount}${unit} patient is ${
          bupivacaineDosing(actualWeight)[1]
        }mg (2mg/kg; max 175mg) without addition of epinephrine and ${
          bupivacaineDosing(actualWeight)[2]
        }mg (3mg/kg; max 225mg) if epinephrine is added.`
      );
      tableRows = bupivacaineDosing(actualWeight)[0];
      break;
    }

    case "ropivacaine": {
      conv.ask(
        `Max dose of ropivacaine in a ${amount}${unit} patient is ${
          ropivacaineDosing(actualWeight)[1]
        }mg (3mg/kg; max 225mg)`
      );
      tableRows = ropivacaineDosing(actualWeight)[0];
      break;
    }

    default: {
      conv.ask(
        `Sorry, I don't have information for that drug yet. I'm working hard to keep adding new information to my brain`
      );
    }
  }

  conv.ask(
    new Table({
      title: `${localAnesthetic[0].toUpperCase() +
        localAnesthetic.substring(1)} dosing`,
      columns: ["formulation", "max volume"],
      rows: tableRows,
      dividers: true
    })
  );
});

app.intent("REFERENCE_Intubation", (conv, params) => {
  console.log("Initialize Reference: Intubation Intent");

  conv.contexts.set("patient_size", 3, params);

  reportPatientType(conv, params);

  const table = new Table({
    title: `RSI medications`,
    columns: ["Medication", "Dose", "Duration of Action"],
    rows: buildInductionTable(params).concat(buildParalyticTable(params)),
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

app.intent("REFERENCE_Intubation - Equipment", buildIntubationEquipmentTable);

exports.fulfillment = functions.https.onRequest(app);
