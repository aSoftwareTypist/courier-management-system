import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import sessionConfig from './config/session.config.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import indexRouter from './routes/index.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Static Assets
app.use(express.static(path.join(__dirname, '../public')));

// Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session(sessionConfig));

// Flash message via res.locals
app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals['flash'] = req.session.flash;
    delete req.session.flash;
  } else {
    res.locals['flash'] = null;
  }
  res.locals['currentUser'] = req.session.user ?? null;
  next();
});

// Request Logger
app.use(requestLogger);

// Routes
app.use('/', indexRouter);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;