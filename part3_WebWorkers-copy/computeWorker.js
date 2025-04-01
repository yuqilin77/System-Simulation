self.onmessage = messageHandler;

function messageHandler(e) {
    let data = e.data;
   
    console.log("Received", data);

    let result = 0;

    // Compute the sum of squares of integers from 'start' to 'end'
    for (let i = data.start; i <= data.end; i++) {
        result += i * i;
    }

    // Prepare the result data to send back
    let resultData = {
        start: data.start,
        end: data.end,
        result: result,
    };

    // Simulate a random delay before sending the result
    setTimeout(function () {
        self.postMessage(resultData);
        self.close();
    }, Math.floor(Math.random() * 10000));
}