const sampleData = require('../data/sample_stock_data.json');

// Safely 'run' user code: MVP stub - in real life, isolate process!
function sandboxBacktest(strategyCode) {
  // Example: the "strategy" is just a function that gets the mean return
  // Replace this with actual safe sandboxing for production!
  try {
    // Only accept code in the form: "return <number>;"
    // Or, accept string "buy_and_hold", "random", etc. for MVP
    if (strategyCode === "buy_and_hold") {
      // Simulate a simple buy & hold strategy
      const perf = sampleData[sampleData.length-1].price / sampleData[0].price - 1;
      return Number((perf * 100).toFixed(2)); // Percentage return
    }
    if (strategyCode === "random") {
      return (Math.random() * 10 - 5).toFixed(2); // between -5% and +5%
    }
    return 0;
  } catch (e) {
    return 0;
  }
}

module.exports = { sandboxBacktest };
