"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function centorCalc(age, tonsilarExudate, cervicalLymph, fever, cough) {
    let score = 0;
    let inclusionMet = true;
    const outputString = [
        "Based on Centor Score of 0, probability of Group A Strep in this patient is between 1-2.5%. No further testing or antibiotics are recommended at this time",
        "Based on Centor Score of 1, probability of Group A Strep in this patient is between 5-10%. No further testing or antibiotics are recommended at this time",
        "Based on Centor Score of 2, probability of Group A Strep in this patient is between 11-17%. Rapid strep testing and/or culture is optional",
        "Based on Centor Score of 3, probability of Group A Strep in this patient is between 28-35%. Consider rapid strep testing and/or culture. Note: IDSA and ASIM no longer recommend empiric treatment for strep based on symptomatology alone.",
        "Based on Centor Score of 4, probability of Group A Strep in this patient is between 51-53%. Consider rapid strep testing and/or culture. Note: IDSA and ASIM no longer recommend empiric treatment for strep based on symptomatology alone.",
        "Based on Centor Score of 5, probability of Group A Strep in this patient is between 51-53%. Consider rapid strep testing and/or culture. Note: IDSA and ASIM no longer recommend empiric treatment for strep based on symptomatology alone.",
        "Group A Strep is exceedingly rare in children under 3 years of age and thus the Centor Criteria should not be applied to this patient"
    ];
    // Calculate the score
    // Check age criteria
    if (age < 3) {
        inclusionMet = false;
    }
    if (age >= 3 && age <= 14) {
        score += 1;
    }
    if (age >= 45) {
        score -= 1;
    }
    // Check tonsil criteria
    if (tonsilarExudate === "true") {
        score += 1;
    }
    // Check lymph node criteria
    if (cervicalLymph === "true") {
        score += 1;
    }
    // Check fever crtieria
    if (fever === "true") {
        score += 1;
    }
    // Check cough criteria
    if (cough !== "true") {
        score += 1;
    }
    // Return recommendation string
    if (!inclusionMet) {
        return outputString[6];
    }
    switch (score) {
        case 0 || -1: return outputString[0];
        case 1: return outputString[1];
        case 2: return outputString[2];
        case 3: return outputString[3];
        case 4: return outputString[4];
        case 5: return outputString[5];
        default: return "There was an error returning the appropriate string";
    }
}
exports.centorCalc = centorCalc;
function heartCalc(suspicion, ekg, age, numRiskFactors, historyOfCAD, initialTrop) {
    let score = 0;
    const outputString = [
        "HEART Score = 0, data suggests a LOW risk of major adverse cardiac event between 0.9-1.7%.",
        "HEART Score = 1, data suggests a LOW risk of major adverse cardiac event between 0.9-1.7%.",
        "HEART Score = 2, data suggests a LOW risk of major adverse cardiac event between 0.9-1.7%.",
        "HEART Score = 3, data suggests a LOW risk of major adverse cardiac event between 12-16.6%.",
        "HEART Score = 4, data suggests a MODERATE risk of major adverse cardiac event between 12-16.6%.",
        "HEART Score = 5, data suggests a MODERATE risk of major adverse cardiac event between 12-16.6%.",
        "HEART Score = 6, data suggests a MODERATE risk of major adverse cardiac event between 12-16.6%.",
        "HEART Score = 7, data suggests a HIGH risk of major adverse cardiac event between 50-65%.",
        "HEART Score = 8, data suggests a HIGH risk of major adverse cardiac event between 50-65%.",
        "HEART Score = 9, data suggests a HIGH risk of major adverse cardiac event between 50-65%.",
        "HEART Score = 10, data suggests a HIGH risk of major adverse cardiac event between 50-65%."
    ];
    switch (suspicion) {
        case "slightly suspicious":
            score += 0;
            break;
        case "moderately suspicious":
            score += 1;
            break;
        case "highly suspicious":
            score += 2;
            break;
        default: break;
    }
    switch (ekg) {
        case "normal":
            score += 0;
            break;
        case "non-specific repolarization disturbance":
            score += 1;
            break;
        case "significant st depression":
            score += 2;
            break;
        default: break;
    }
    if (age < 45) {
        score += 0;
    }
    else if (age <= 64) {
        score += 1;
    }
    else {
        score += 2;
    }
    if (historyOfCAD === 'true') {
        score += 2;
    }
    else if (numRiskFactors < 1) {
        score += 0;
    }
    else if (numRiskFactors < 3) {
        score += 1;
    }
    else {
        score += 2;
    }
    switch (initialTrop) {
        case "normal":
            score += 0;
            break;
        case "1-3x normal":
            score += 1;
            break;
        case "beyond 3x normal":
            score += 2;
            break;
    }
    return outputString[score];
}
exports.heartCalc = heartCalc;
//# sourceMappingURL=decision_instruments.js.map