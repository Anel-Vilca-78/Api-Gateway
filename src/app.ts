import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import dotenv from 'dotenv';
import { Signale } from "signale";
import proxy from "express-http-proxy";

const app: Application = express();
const signale = new Signale();

dotenv.config();

app.use(morgan('dev'));
const PORT = process.env.PORT || 3000;
const GATEWAY = "api-gateway";

// Configuración de las rutas proxy
app.use('/api/v1/ordenes/create', proxy('http://localhost:3002', { 
    proxyReqPathResolver: function (req: Request) {
        return '/api/orden';
    }
}));

app.use('/api/v1/ordenes/list', proxy('http://localhost:3002', { 
    proxyReqPathResolver: function (req: Request) {
        return '/api/orden';
    }
}));

app.use('/api/v1/ordernes-productos/create', proxy('http://localhost:3002', {
    proxyReqPathResolver: function (req: Request) {
        return '/api/ordenesProductos';
    }
}));

app.use('/api/v1/orden/update/:id', proxy('http://localhost:3002', {
    proxyReqPathResolver: function (req: Request) {
        return '/api/orden/' + req.params.id;
    }
}));

app.use('/api/v1/productos/create', proxy('http://localhost:3001', {
    proxyReqPathResolver: function (req: Request) {
        return '/products';
    }
}));
app.use('/api/v1/productos/delete/:id', proxy('http://localhost:3001', {
    proxyReqPathResolver: function (req: Request) {
        return '/products/' + req.params.id;
    }
}));
app.use('/api/v1/productos/list', proxy('http://localhost:3001', {
    proxyReqPathResolver: function (req: Request) {
        return '/products';
    }
}));

// Rutas de autenticación

app.listen(PORT, () => {
    signale.success(`Servicio ${GATEWAY} corriendo en http://localhost:${PORT}`);
});
