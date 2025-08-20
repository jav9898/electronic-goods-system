const app = require('./src/app');
require('dotenv').config({ path: './src/.env' });

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database: ${process.env.DB_DATABASE}`);
});
