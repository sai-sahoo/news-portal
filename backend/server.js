const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const body_parser = require('body-parser');
const db_connect = require('./utils/db');

dotenv.config();
app.use(body_parser.json());
if(process.env.mode === 'production') {
    app.use(cors());
} else {
    app.use(cors({
        origin: ['http://localhost:5173', 'http://localhost:3000']
    }));
}

const port = process.env.port;
db_connect();

app.use('/', require('./routes/authRoutes'));
app.use("/api/categories", require('./routes/categoryRoutes'));
app.use("/api/public/categories", require('./routes/public/categoryRoutes'));
app.use("/api/public/news", require('./routes/public/newsRoutes'));
app.use("/api/polls", require("./routes/pollRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/ads/placements", require("./routes/placement.routes"));
app.use("/api/ads/advertisers", require("./routes/advertiser.routes"));
app.use("/api/ads/campaigns", require("./routes/campaign.routes"));
app.use("/api/ads/creatives", require("./routes/creative.routes"));
app.use('/', require('./routes/newsRoutes'));
app.get('/', (req, res) => {
    res.send('Hellooo');
});

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});