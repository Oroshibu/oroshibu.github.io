const prevYears = {
    "notyoursagittarius": ["sarn."],
    "hapty": [],
    "minichibis": ["orisghost", "overgrown.robot"],
    "sarn.": ["attfooy"],
    "attfooy": ["oroshibu", "redrachis", "worshipsunfucker"],
    "redrachis": ["sarn.", "mistajub"],
    "orisghost": ["minichibis"],
    "overgrown.robot": [],
    "mistajub": ["minichibis", "notyoursagittarius"],
    "oroshibu": ["buckloose", "redrachis"],
    "buckloose": ["mistajub", "orisghost"],
    "worshipsunfucker": ["overgrown.robot"]
};

const participants = Object.keys(prevYears);

function secretSantaPicker(participants, prevYears) {
    const assignments = {};
    const remainingParticipants = [...participants];

    for (const participant of participants) {
        let possibleRecipients = participants.filter(p => p !== participant && !prevYears[participant].includes(p));

        // Remove participants already assigned in this year
        possibleRecipients = possibleRecipients.filter(p => !Object.values(assignments).includes(p));

        if (possibleRecipients.length === 0) {
            throw new Error(`No valid recipients for ${participant}`);
        }

        const recipient = possibleRecipients[Math.floor(Math.random() * possibleRecipients.length)];
        assignments[participant] = recipient;
        remainingParticipants.splice(remainingParticipants.indexOf(recipient), 1);
    }

    return assignments;
}

function loopSize(assignments, participant) {
    let recipient = assignments[participant];
    let loopSize = 0;

    while (recipient !== participant) {
        recipient = assignments[recipient];
        loopSize += 1;
    }

    return loopSize + 1;
}

function averageLoopSize(assignments) {
    const loopSizes = Object.keys(assignments).map(participant => loopSize(assignments, participant));
    const totalLoopSize = loopSizes.reduce((sum, size) => sum + size, 0);

    return totalLoopSize / Object.keys(assignments).length;
}

// let err = true;
// let santaAssignments;

// while (err === true || averageLoopSize(santaAssignments) < participants.length) {
//     try {
//         santaAssignments = secretSantaPicker(participants, prevYears);
//         err = false;
//     } catch (e) {
//         // console.log(`Error: ${e.message}`);
//         err = true;
//     }
// }

// for (const santa in santaAssignments) {
//     const recipient = santaAssignments[santa];
//     console.log(`${santa} -> ${recipient}`);
// }

function runSecretSanta() {
    let err = true;

    while (err === true || averageLoopSize(santaAssignments) < participants.length) {
        try {
            santaAssignments = secretSantaPicker(participants, prevYears);
            err = false;
        } catch (e) {
            // console.log(`Error: ${e.message}`);
            err = true;
        }
    }

    const outputElement = document.getElementById('output');
    outputElement.innerHTML = '';

    for (const santa in santaAssignments) {
        const recipient = santaAssignments[santa];
        outputElement.innerHTML += `${santa} -> ${recipient}<br>`;
    }

    // Create nodes and edges for the vis.js graph
    const nodes = participants.map(participant => ({ id: participant, label: participant }));
    const edges = participants.map(santa => ({ from: santa, to: santaAssignments[santa] }));

    const container = document.getElementById('network');
    const data = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges)
    };

    const options = {
        edges: {
            arrows: {
                to: {
                    enabled: true,
                    scaleFactor: 0.5 // Adjust the arrow size if needed
                }
            }
        },
        interaction: {
            dragNodes: false, // Disable dragging of nodes
            dragView: false, // Disable dragging of the view
            zoomView: false, // Disable zooming
        },
        height: '600px', // Set a specific height for the graph
        width: '100%', // Set width to 100% of the container
    };

    const network = new vis.Network(container, data, options);
}