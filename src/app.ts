import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import session from 'express-session';
import express from 'express';
import "reflect-metadata";
import "./utils/types";
import { engine } from 'express-handlebars';
import path from 'path';
import { HomestayRepoClass } from './repos/homestay.repo';
import { UserRepoClass } from './repos/user.repo';
import { UserRouter } from './routers/router.user';
import { HomestayService } from './services/service.homestay';
import { UserService } from './services/service.user';
import { Middleware } from './helpers/midddleware';
import { AppRouter } from './routers/router.app';
import { HomestayRouter } from './routers/router.homestay';
import { RoomRepo } from './repos/repo.room';
import { RoomService } from './services/service.room';
import { RoomRouter } from './routers/router.room';
import { BookingRepo } from './repos/repo.booking';
import { BookingService } from './services/service.booking';
import { BookingRouter } from './routers/router.booking';
import cors from 'cors'
import { Token } from './helpers/token';

export interface Routers {
    path: string,
    router: express.Router
}

class App {
    private app: express.Application
    constructor(routers: Routers[]) {
        this.app = express()
        this.intializeEngines()
        this.intializeStaticFiles()
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(cookieParser())
        this.app.use(session({ resave: true, saveUninitialized: true, secret: 'XCR3rsasa%RDHHH'}));
        this.initializeRouters(routers)
        this.serve()
    }  
    intializeStaticFiles() {
        const files = path.join(__dirname, "../public")
        const frontend = path.join(__dirname, "/frontend")
        this.app.use(express.static(files))
        this.app.use("/scripts", express.static(frontend))
    }
    intializeEngines() {
        const views = path.join(__dirname, "../public/views")
        const layouts = path.join(__dirname, "../public/views/layouts")
        const partials = path.resolve(__dirname, "../public/views/partials")
        this.app.engine('handlebars', engine({
            defaultLayout: "default",
            layoutsDir: layouts,
            partialsDir: partials
        }))
        this.app.set('view engine', 'handlebars')
        this.app.set('views', views);
        this.app.use(cors(
            {
                origin: ["http://localhost:3000"],
                credentials: true
            }
        ))
    }
    initializeRouters(routers: Routers[]) {
        routers.forEach((router) => {
            this.app.use(router.path, router.router)
        })
    }
    serve() {
        this.app.listen(4000, () => {
            console.log("Server is up and running on Port: 4000")
        });
    }
}

const ur = new UserRepoClass()
const hr = new HomestayRepoClass()
const rr = new RoomRepo()
const br = new BookingRepo()
const ts = new Token()
const us = new UserService(ur,ts)
const hs = new HomestayService(hr,rr)
const rs = new RoomService(rr,hr)
const bs = new BookingService(br,hr)
const md = new Middleware(ur,ts)
const uRouter = new UserRouter(us, md)
const aRouter = new AppRouter(md)
const hRouter = new HomestayRouter(hs,md)
const rRouter = new RoomRouter(rs, md)
const bRouter = new BookingRouter(bs,md)
// const aRouter = AppRouter.getInstance()
// const hRouter = HomestayRouter.getInstance(hs) 
new App([{ path: uRouter.getPath(), router: uRouter.getRouter() }, { path: aRouter.getPath(), router: aRouter.getRouter() }, { path: hRouter.getPath(), router: hRouter.getRouter() },{path: rRouter.getPath(),router: rRouter.getRouter()},{path: bRouter.getPath(),router: bRouter.getRouter()}])
