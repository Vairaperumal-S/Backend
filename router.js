const express = require('express');
const foodRouter = require('./food');

const app = express();
const PORT = 4000;

// Mount the foodRouter on the '/food' path
app.use('/food', foodRouter);

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
