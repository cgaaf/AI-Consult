"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drug_dosing_1 = require("./drug-dosing");
const actions_on_google_1 = require("actions-on-google");
function toKg(params) {
    // Helper functions
    // Convert age inputs into estimated weight in (kg).
    function ageToKg(age) {
        let amount = age.amount;
        const unit = age.unit;
        if (unit === "month") {
            amount = amount / 12;
        }
        let weight;
        // Return estimated weight by age group
        if (amount <= 2 / 12) {
            weight = 5;
        }
        else if (amount <= 4 / 12) {
            weight = 6;
        }
        else if (amount <= 0.5) {
            weight = 8;
        }
        else if (amount <= 1) {
            weight = 10;
        }
        else if (amount <= 2) {
            weight = 12;
        }
        else if (amount <= 4) {
            weight = 15;
        }
        else if (amount <= 6) {
            weight = 20;
        }
        else if (amount <= 8) {
            weight = 25;
        }
        else if (amount <= 10) {
            weight = 35;
        }
        else {
            weight = 50;
        }
        return weight;
    }
    // Conver broselow inputs into estimated weight (kg)
    function broselowToKg(color) {
        let weight;
        // Return estimated weight by broselow color
        switch (color) {
            case "gray": {
                weight = 5;
                break;
            }
            case "pink": {
                weight = 6;
                break;
            }
            case "red": {
                weight = 8;
                break;
            }
            case "purple": {
                weight = 10;
                break;
            }
            case "yellow": {
                weight = 12;
                break;
            }
            case "white": {
                weight = 15;
                break;
            }
            case "blue": {
                weight = 20;
                break;
            }
            case "orange": {
                weight = 25;
                break;
            }
            case "green": {
                weight = 35;
                break;
            }
            default: {
                weight = null;
            }
        }
        return weight;
    }
    // Convert input weight to metric (kg)
    function toMetric(weight) {
        const { unit, amount } = weight;
        if (unit === "kg") {
            return amount;
        }
        else if (unit === "lb") {
            return amount / 2.2;
        }
        else {
            return null;
        }
    }
    // Conditional statement to prioritize weight over other measurements.
    if (params.weight) {
        return toMetric(params.weight).toFixed(0);
    }
    else if (params.age) {
        return ageToKg(params.age);
    }
    else if (params.color) {
        return broselowToKg(params.color);
    }
    else {
        console.log("Invalid input into toKg function");
        return null;
    }
}
exports.toKg = toKg;
function toBroselow(params) {
    // Converts input parameters into a broselow color
    // Acceptable inputs include age and weight
    function ageToBroselowColor(age) {
        // Convert age to broslow color
        let amount = age.amount;
        const unit = age.unit;
        if (unit === "month") {
            amount = amount / 12;
        }
        let color = null;
        // Conditional statements for each age range
        if (amount <= 2 / 12) {
            color = "gray";
        }
        else if (amount <= 4 / 12) {
            color = "pink";
        }
        else if (amount <= 0.5) {
            color = "red";
        }
        else if (amount <= 1) {
            color = "purple";
        }
        else if (amount <= 2) {
            color = "yellow";
        }
        else if (amount <= 4) {
            color = "white";
        }
        else if (amount <= 6) {
            color = "blue";
        }
        else if (amount <= 8) {
            color = "orange";
        }
        else if (amount <= 10) {
            color = "green";
        }
        else {
            color = "No color for this age group";
        }
        return color;
    }
    function weightToBroselow(weight) {
        // Create conversion of weight to broselow color
        // Input weight assumed to be in Kg
        let color;
        if (weight < 3.5) {
            color = "gray";
        }
        else if (weight < 5) {
            color = "gray";
        }
        else if (weight < 6) {
            color = "gray";
        }
        else if (weight < 8) {
            color = "pink";
        }
        else if (weight < 10) {
            color = "red";
        }
        else if (weight < 12) {
            color = "purple";
        }
        else if (weight < 15) {
            color = "yellow";
        }
        else if (weight < 20) {
            color = "white";
        }
        else if (weight < 25) {
            color = "blue";
        }
        else if (weight < 35) {
            color = "orange";
        }
        else if (weight < 50) {
            color = "green";
        }
        else {
            color = null;
        }
        return color;
    }
    if (params.weight) {
        const weight = toKg(params);
        return weightToBroselow(weight);
    }
    else if (params.age) {
        const age = params.age;
        return ageToBroselowColor(age);
    }
    else {
        return null;
    }
}
exports.toBroselow = toBroselow;
function weightToAge(weight) {
    // Input weight assumed to be in Kg
    let age;
    if (weight <= 2) {
        age = -1;
    }
    else if (weight <= 5) {
        age = 0;
    }
    else if (weight <= 8) {
        age = 0.5;
    }
    else if (weight <= 10) {
        age = 1;
    }
    else if (weight <= 12) {
        age = 2;
    }
    else if (weight <= 15) {
        age = 4;
    }
    else if (weight <= 20) {
        age = 6;
    }
    else if (weight <= 25) {
        age = 8;
    }
    else if (weight <= 35) {
        age = 10;
    }
    else {
        age = 18;
    }
    return age;
}
exports.weightToAge = weightToAge;
function buildInductionTable(params) {
    const weight = toKg(params);
    return [
        ["propofol", drug_dosing_1.propofolDosing(weight) + "mg", "3-10 min"],
        ["etomidate", drug_dosing_1.etomidateDosing(weight) + "mg", "3-5 min"],
        ["ketamine", drug_dosing_1.ketamineDosing(weight) + "mg", "5-10 min"]
    ];
}
exports.buildInductionTable = buildInductionTable;
function buildParalyticTable(params) {
    const weight = toKg(params);
    return [
        ["succinylcholine", drug_dosing_1.succinylcholineDosing(weight) + "mg", "5-10 min"],
        ["rocuronium", drug_dosing_1.rocuroniumDosing(weight) + "mg", "30-90 min"],
        ["vecuronium", drug_dosing_1.vecuroniumDosing(weight) + "mg", "25-30 min"]
    ];
}
exports.buildParalyticTable = buildParalyticTable;
exports.buildIntubationEquipmentTable = (conv, params) => {
    console.log("Initialize REFERENCE_Intubation - Equipment");
    // Check for age parameter, if !exist then convert weight to estimated age
    let age;
    if (params.age) {
        if (params.age.unit === "year") {
            age = params.age.amount;
        }
        else if (params.age.unit === "month") {
            age = params.age.amount / 12;
        }
        else {
            age = 0;
        }
    }
    else {
        const weight = toKg(params);
        age = weightToAge(weight);
    }
    let tubeDiameter;
    let tubeDepth;
    let bladeSize;
    if (age < 0) {
        tubeDiameter = 2.5;
        bladeSize = 0;
    }
    else if (age <= 0.5) {
        tubeDiameter = 3;
        bladeSize = 0;
    }
    else if (age <= 1) {
        tubeDiameter = 3;
        bladeSize = 1;
    }
    else if (age <= 2) {
        tubeDiameter = 3.5;
        bladeSize = 1;
    }
    else if (age <= 4) {
        tubeDiameter = 4;
        bladeSize = 2;
    }
    else if (age <= 6) {
        tubeDiameter = 4.5;
        bladeSize = 2;
    }
    else if (age <= 8) {
        tubeDiameter = 5;
        bladeSize = 3;
    }
    else if (age <= 10) {
        tubeDiameter = 5.5;
        bladeSize = 3;
    }
    else {
        tubeDiameter = 7.5;
        bladeSize = 3;
    }
    tubeDepth = tubeDiameter * 3;
    const table = new actions_on_google_1.Table({
        title: `Intubation Equipment`,
        columns: ["", ""],
        rows: [
            ["Tube Diameter", tubeDiameter + "mm"],
            ["Tube Depth", tubeDepth + "cm"],
            ["Blade Size", `Mac or Miller ${bladeSize}`]
        ],
        dividers: true
    });
    conv.ask("I've calculated ideal intubation equipment");
    conv.ask(table);
    conv.contexts.set("patient_size", 3, params);
};
function reportPatientType(conv, params) {
    const weight = params.weight;
    const age = params.age;
    const color = params.color;
    const patientType = params.patientType;
    if (weight) {
        conv.ask(`Weight based dosing based on input weight of ${toKg(params)}kg`);
    }
    else if (age) {
        conv.ask(`Estimated weight of a of ${age.amount} ${age.unit} old is ${toKg(params)}kg based on a broselow color of ${toBroselow(params)}`);
    }
    else if (color) {
        const broselowColors = [
            "gray",
            "pink",
            "red",
            "purple",
            "yellow",
            "white",
            "blue",
            "orange",
            "green"
        ];
        if (broselowColors.indexOf(color) > -1) {
            conv.ask(`Assumed weight is ${toKg(params)}kg based on broselow color of ${color}`);
        }
        else {
            conv.ask(`A valid broselow color was not provided`);
        }
    }
    else if (patientType) {
        conv.ask(`Return dosing based on patient type`);
    }
    else {
        conv.ask("Return dosing based on standard adult size of 70kg");
    }
}
exports.reportPatientType = reportPatientType;
//# sourceMappingURL=helpers.js.map