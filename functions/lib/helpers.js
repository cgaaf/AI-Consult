"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toKg({ amount, unit }) {
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
exports.toKg = toKg;
function lidocaineDosing(weight) {
    let noEpi = weight * 4;
    let addEpi = weight * 7;
    if (noEpi > 300) {
        noEpi = 300;
    }
    ;
    if (addEpi > 500) {
        addEpi = 500;
    }
    ;
    const table = [
        ['0.5%', (noEpi / 5).toFixed(1) + ' mL'],
        ['1%', (noEpi / 10).toFixed(1) + ' mL'],
        ['1.5%', (noEpi / 15).toFixed(1) + ' mL'],
        ['2%', (noEpi / 20).toFixed(1) + ' mL'],
        ['0.5% + epinephrine', (addEpi / 5).toFixed(1) + ' mL'],
        ['1% + epinephrine', (addEpi / 10).toFixed(1) + ' mL'],
        ['1.5% + epinephrine', (addEpi / 15).toFixed(1) + ' mL'],
        ['2% + epinephrine', (addEpi / 20).toFixed(1) + ' mL']
    ];
    return [table, noEpi.toFixed(0), addEpi.toFixed(0)];
}
exports.lidocaineDosing = lidocaineDosing;
function bupivacaineDosing(weight) {
    let noEpi = weight * 2;
    let addEpi = weight * 3;
    if (noEpi > 175) {
        noEpi = 175;
    }
    ;
    if (addEpi > 225) {
        addEpi = 225;
    }
    ;
    const table = [
        ['0.25%', (noEpi / 2.5).toFixed(1) + ' mL'],
        ['0.5%', (noEpi / 5).toFixed(1) + ' mL'],
        ['0.25% + epinephrine', (addEpi / 2.5).toFixed(1) + ' mL'],
        ['0.5% + epinephrine', (addEpi / 0.5).toFixed(1) + ' mL']
    ];
    return [table, noEpi.toFixed(0), addEpi.toFixed(0)];
}
exports.bupivacaineDosing = bupivacaineDosing;
function ropivacaineDosing(weight) {
    let noEpi = weight * 3;
    if (noEpi > 225) {
        noEpi = 225;
    }
    ;
    const table = [
        ['0.2%', (noEpi / 2).toFixed(1) + ' mL'],
        ['0.5%', (noEpi / 5).toFixed(1) + ' mL'],
        ['0.75%', (noEpi / 7.5).toFixed(1) + ' mL']
    ];
    return [table, noEpi.toFixed(0)];
}
exports.ropivacaineDosing = ropivacaineDosing;
function ageToBroselowColor(age) {
    let amount = age.amount;
    let unit = age.unit;
    if (unit === 'month') {
        amount = amount / 12;
    }
    let color = null;
    // Conditional statements for each age range
    if (amount <= (2 / 12)) {
        color = 'gray';
    }
    else if (amount <= (4 / 12)) {
        color = 'pink';
    }
    else if (amount <= 0.5) {
        color = 'red';
    }
    else if (amount <= 1) {
        color = 'purple';
    }
    else if (amount <= 2) {
        color = 'yellow';
    }
    else if (amount <= 4) {
        color = 'white';
    }
    else if (amount <= 6) {
        color = 'blue';
    }
    else if (amount <= 8) {
        color = 'orange';
    }
    else if (amount <= 10) {
        color = 'green';
    }
    else {
        color = 'No color for this age group';
    }
    return color;
}
exports.ageToBroselowColor = ageToBroselowColor;
function ageToKg(age) {
    let amount = age.amount;
    let unit = age.unit;
    if (unit === 'month') {
        amount = amount / 12;
    }
    let weight;
    // Conditional statements for each age range
    if (amount <= (2 / 12)) {
        weight = 5;
    }
    else if (amount <= (4 / 12)) {
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
exports.ageToKg = ageToKg;
//# sourceMappingURL=helpers.js.map