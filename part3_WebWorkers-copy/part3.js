(function () {
    window.onload = init;

    var startButton;
    var rangeInput;
    var numWorkersInput;
    var resultOutput;
    var itemsList;
    var storageItemsList;

    var workers = [];
    var counter = 0;
    var totalResults = 0;

    function init() {
        startButton = document.getElementById("startButton");
        rangeInput = document.getElementById("range");
        numWorkersInput = document.getElementById("numWorkers");
        resultOutput = document.getElementById("sum");
        itemsList = document.getElementById("items");
        storageItemsList = document.getElementById("storageItems");

        startButton.onclick = sendDataToWorkers;
    }

    // Handle messages received from the Web Workers
    function handleReceipt(event) {
        var data = event.data;

        var range = parseInt(rangeInput.value, 10);
        var numWorkers = parseInt(numWorkersInput.value, 10);
        var resultObject = {
            index: (data.start - 1 ) / Math.ceil(range / numWorkers),
            start: data.start,
            end: data.end,
            result: data.result
        };

        counter+=1;

        // Display the received data in the list
        var li = document.createElement("li");
        li.textContent = JSON.stringify(resultObject);
        itemsList.appendChild(li);

        // Update the total sum of results
        totalResults += data.result;
        resultOutput.textContent = totalResults;

        // Store the new result in local storage
        storeResultInLocalStorage(resultObject);

        // Check if we've received results from all workers
        if (counter === numWorkers) {
            // Re-enable the start button
            startButton.disabled = false;
        }

        // Display all completed results from local storage
        displayReceivedResults();
    }

    // Send messages to the Web Workers
    function sendDataToWorkers(e) {
        startButton.disabled = true;
        counter = 0; // Reset counter
        totalResults = 0;
        resultOutput.textContent = totalResults; // Update the displayed total sum to 0

        // Clear the previous results list
        itemsList.innerHTML = "";
        storageItemsList.innerHTML = "";
        localStorage.clear();

        var range = parseInt(rangeInput.value, 10);
        var numWorkers = parseInt(numWorkersInput.value, 10);
        var step = Math.ceil(range / numWorkers);

        // Create and start workers
        for (var i = 0; i < numWorkers; i++) {
            var start = i * step + 1;
            var end = Math.min((i + 1) * step, range);

            var worker = new Worker("computeWorker.js");

            // Handle messages received from workers
            worker.onmessage = handleReceipt;

            // Send data to workers
            var data = {
                start: start,
                end: end,
            };
            worker.postMessage(data);

            workers.push(worker);
        }
    }

    // Store a single result in local storage
    function storeResultInLocalStorage(result) {
        var storedResults = localStorage.getItem("results");
        var resultsArray = storedResults ? JSON.parse(storedResults) : [];
        resultsArray.push(result);

        // Sort resultsArray based on the index property in ascending order
        resultsArray.sort((a, b) => a.index - b.index);

        localStorage.setItem("results", JSON.stringify(resultsArray));
    }

    // Display all received results in the "Local Storage" section
    function displayReceivedResults() {
        var results = JSON.parse(localStorage.getItem("results"));
        var li = document.createElement("li");
        var temp = new Array(1);
        for (var i = 0; i < results.length; i++) {
            var data = results[i];
            temp[data.index] = JSON.stringify(data)
        }
        console.log(temp.length);
        var output = "";
        var firstNonEmpty = false;
        for (var i = 0; i < temp.length; i++) {
            if (temp[i] === undefined) {
                output += ","
            } else {
                if (!firstNonEmpty) {
                    output += temp[i]
                } else {
                    output += ",\n" + temp[i]
                }
                firstNonEmpty = firstNonEmpty || true;
            }
        }
        var lastIndex = output.length - 1;
        while (lastIndex >= 0 && output[lastIndex] === ',') {
            lastIndex--;
        }
        output = output.substring(0, lastIndex + 1);
        li.textContent = output;
        storageItemsList.appendChild(li);

    }
})();