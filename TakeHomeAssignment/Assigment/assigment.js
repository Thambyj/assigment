const fs = require('fs');
const path = require('path');

// Specify the path to the input JSON file relative to the script
const inputFilePath = path.join(__dirname, '../inputdata/input.json');

// Check if the file path is provided
if (!inputFilePath) {
    console.error('Error: Please provide the path to the input JSON file.');
    return;
}

// Read input data from the specified JSON file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading ${inputFilePath}:`, err);
        return;
    }

    // Parse JSON data
    const inputData = JSON.parse(data);

    // Function to calculate median
    function median(arr) {
        const sorted = arr.slice().sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        }
        return sorted[middle];
    }

    // Process data and generate output
    function processData(data) {
        const result = [];

        // Group data by day
        const groupedByDay = {};
        data.forEach(entry => {
            const date = entry.timestamps.startTime.split('T')[0];
            if (!groupedByDay[date]) {
                groupedByDay[date] = [];
            }
            groupedByDay[date].push(entry);
        });

        // Calculate statistics for each day
        for (const date in groupedByDay) {
            const measurements = groupedByDay[date].map(entry => entry.beatsPerMinute);
            const min = Math.min(...measurements);
            const max = Math.max(...measurements);
            const medianBPM = median(measurements);
            const latestTimestamp = groupedByDay[date][groupedByDay[date].length - 1].timestamps.endTime;

            result.push({
                date,
                min,
                max,
                median: medianBPM,
                latestDataTimestamp: latestTimestamp
            });
        }

        return result;
    }

    // Generate output
    const output = processData(inputData);

    // Write to output.json
    fs.writeFile('output.json', JSON.stringify(output, null, 2), err => {
        if (err) {
            console.error('Error writing to output.json:', err);
        } else {
            console.log('Output saved to output.json');
        }
    });
});
