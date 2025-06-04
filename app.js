const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const balancesRoutes = require('./routes/balanceRoutes');
const settlementRoutes = require('./routes/settlementRoutes');
const groupRoutes = require('./routes/groupRoutes');
const userRoutes = require('./routes/userRoutes'); 

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api', require('./routes/expenseRoutes')); 
app.use('/api', balancesRoutes);

app.use('/api', settlementRoutes); 
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

