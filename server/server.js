const app = require("express")();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const rfs = require("rotating-file-stream");
// routers for services
const serviceRouter = require("./routes/service");
const authRouter = require("./routes/auth");
const routerRouter = require("./routes/router");
const configRouter = require("./routes/config");
const banRouter = require("./routes/bans");
const templateRouter = require("./routes/template");
const tagRouter = require("./routes/tag");
const ipRouter = require("./routes/ip");
const eventsRouter = require("./sse/index");

// configure initial app
if (!process.env.DEBUG) {
	const db = require("./db");
	const pad = num => (num > 9 ? "" : "0") + num;
	const generator = (time, index) => {
		if (!time) return "file.log";

		var month = time.getFullYear() + "" + pad(time.getMonth() + 1);
		var day = pad(time.getDate());
		var hour = pad(time.getHours());
		var minute = pad(time.getMinutes());

		return `${month}/${month}${day}-${hour}${minute}-${index}-file.log`;
	};
	const logStream = rfs.createStream(generator, { interval: "1d", path: "/logs" });
	// if there is a connection error, do this
	db.on("error", () => {
		console.error.bind(console, "[-] connection error: ");
	});

	// once a connection is established, do this
	db.once("open", () => {
		console.log("[+] Connection to database established");
	});
	app.use(morgan("combined", { stream: logStream }));
	app.use(morgan("dev"));
	// handle ctrl+C and `docker-compose down`
	process.on("SIGINT", async () => {
		console.log("[-] Stopping server");
		if (db) {
			await db.close();
			console.log("[-] Closing database connection");
		}
		process.exit(0);
	});
}
app.use(cors());
app.use(bodyParser.json());
app.use("/service", serviceRouter);
app.use("/auth", authRouter);
app.use("/router", routerRouter);
app.use("/config", configRouter);
app.use("/ban", banRouter);
app.use("/connections", eventsRouter);
app.use("/template", templateRouter);
app.use("/tag", tagRouter);
app.use("/ip", ipRouter);

app.get("/", (req, res) => {
	res.send("⚛ + 🦔 = 🦔 blue");
});

var http = require("http").createServer(app);


module.exports = http;
