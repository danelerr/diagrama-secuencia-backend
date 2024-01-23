import pkg from 'pg';
const { Pool } = pkg;

import {dbConfig} from './config.js';

const pool = new Pool(dbConfig);

export default pool;