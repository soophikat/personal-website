import { config } from 'dotenv';
config({ path: '../../.env' });
import { initSchema } from "../lib/db";

initSchema()
    .then(() => {
        console.log('schema created!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('error schema!', err);
        process.exit(1);
    });
