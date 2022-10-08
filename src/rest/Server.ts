import express, {Application, Request, Response} from "express";
import * as http from "http";
import cors from "cors";
import {IInsightFacade, InsightDatasetKind, InsightError, NotFoundError} from "../controller/IInsightFacade";
import InsightFacade from "../controller/InsightFacade";
import {getContentFromArchives} from "../../test/TestUtility";


export default class Server {
	private readonly port: number;
	private express: Application;
	private server: http.Server | undefined;
	private insightFacade: InsightFacade;

	constructor(port: number) {
		console.info(`Server::<init>( ${port} )`);
		this.insightFacade = new InsightFacade();
		this.port = port;
		this.express = express();

		this.registerMiddleware();
		this.registerRoutes();

		// NOTE: you can serve static frontend files in from your express server
		// by uncommenting the line below. This makes files in ./frontend/public
		// accessible at http://localhost:<port>/
		// Todo: uncomment line below
		this.express.use(express.static("./frontend/public"));
	}

	/**
	 * Starts the server. Returns a promise that resolves if success. Promises are used
	 * here because starting the server takes some time and we want to know when it
	 * is done (and if it worked).
	 *
	 * @returns {Promise<void>}
	 */
	public start(): Promise<void> {
		return new Promise((resolve, reject) => {
			console.info("Server::start() - start");
			if (this.server !== undefined) {
				console.error("Server::start() - server already listening");
				reject();
			} else {
				this.server = this.express.listen(this.port, () => {
					console.info(`Server::start() - server listening on port: ${this.port}`);
					resolve();
				}).on("error", (err: Error) => {
					// catches errors in server start
					console.error(`Server::start() - server ERROR: ${err.message}`);
					reject(err);
				});
			}
		});
	}

	/**
	 * Stops the server. Again returns a promise so we know when the connections have
	 * actually been fully closed and the port has been released.
	 *
	 * @returns {Promise<void>}
	 */
	public stop(): Promise<void> {
		console.info("Server::stop()");
		return new Promise((resolve, reject) => {
			if (this.server === undefined) {
				console.error("Server::stop() - ERROR: server not started");
				reject();
			} else {
				this.server.close(() => {
					console.info("Server::stop() - server closed");
					resolve();
				});
			}
		});
	}

	// Registers middleware to parse request before passing them to request handlers
	private registerMiddleware() {
		// JSON parser must be place before raw parser because of wildcard matching done by raw parser below
		this.express.use(express.json());
		this.express.use(express.raw({type: "application/*", limit: "10mb"}));

		// enable cors in request headers to allow cross-origin HTTP requests
		this.express.use(cors());
	}

	// Registers all request handlers to routes
	private registerRoutes() {
		// This is an example endpoint this you can invoke by accessing this URL in your browser:
		// http://localhost:4321/echo/hello
		// this.express.get("/handleGET/:msg", this.handleGET);
		this.express.get("/datasets", this.handleGET.bind(this));

		// TODO: your other endpoints should go here
		// credit to TAs for need to use .bind(this) function
		this.express.post("/query", this.handlePOST.bind(this));
		// console.log("Called PUT");
		this.express.put("/dataset/:id/:kind", this.handlePUT.bind(this));
		this.express.delete("/dataset/:id", this.handleDELETE.bind(this));
	}

	// The next two methods handle the handleGET service.
	// These are almost certainly not the best place to put these, but are here for your reference.
	// By updating the Server.handleGET function pointer above, these methods can be easily moved.
	// handles endpoint for GET
	private async handleGET(req: Request, res: Response) {
		try {
			// console.log(`Server::echo(..) - params: ${JSON.stringify(req.params)}`);
			const response = await this.insightFacade.listDatasets();
			res.status(200).json({result: response});
		} catch (err) {
			res.status(400).json({error: "400 err"});
		}
	}

	// handles endpoint for PUT
	private async handlePUT(req: Request, res: Response) {
		try {
			// console.log(`Server::echo(..) - params: ${JSON.stringify(req.params)}`);
			let kind: InsightDatasetKind = this.convertStringToInsightDatasetKind(req.params.kind);
			// TODO: is this how I'm supposed to pass the body in?
			let myFile = (req.body).toString("base64");
			const response = await this.insightFacade.addDataset(req.params.id, myFile,kind);
			// req.body for addDataset zip file
			res.status(200).json({result: response});
		} catch (err) {
			res.status(400).json({error: "400 err"});
		}
	}

	// converts string passed in as kind into a InsightDatasetKind
	private convertStringToInsightDatasetKind(input: string): InsightDatasetKind{
		let result = InsightDatasetKind.Courses;
		switch (input){
			case "courses":
				result = InsightDatasetKind.Courses;
				break;
			case "rooms":
				result = InsightDatasetKind.Rooms;
				break;
			default:
				throw new InsightError();
		}
		return result;
	}

	// handles endpoint for POST
	private async handlePOST(req: Request, res: Response) {
		try {
			const response = await this.insightFacade.performQuery(req.body);
			res.status(200).json({result: response});
		} catch (err: any) {
			// console.log("caught an error in post! " + err);
			res.status(400).json({error: "400 err"});
		}
	}

	// handles endpoint for DELETE
	private async handleDELETE(req: Request, res: Response) {
		try {
			// console.log(`Server::echo(..) - params: ${JSON.stringify(req.params)}`);
			const response = await this.insightFacade.removeDataset(req.params.id);
			// req.body for addDataset zip file
			res.status(200).json({result: response});
		} catch (err) {
			if(err instanceof NotFoundError) {
				res.status(404).json({error: "404 err"});
			} else {
				res.status(400).json({error: "400 err"});
			}

		}
	}

	// private static performEcho(msg: string): string {
	// 	if (typeof msg !== "undefined" && msg !== null) {
	// 		return `${msg}...${msg}`;
	// 	} else {
	// 		return "Message not provided";
	// 	}
	// }
}
