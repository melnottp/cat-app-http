//main app / service
//app.js
const http = require("http");
const Cat = require("./controller");
const { getReqData } = require("./utils");

//const PORT = process.env.PORT || 5000;
// Constants
const PORT = 8080;
const HOST = "localhost";

const server = http.createServer(async (req, res) => {
    console.log("Called" + req.method + " : " + req.url);

    if (req.url === "/" && req.method === "GET") {
        // set the status code, and content-type
        res.writeHead(200, { "Content-Type": "application/json" });
        // send the data
        res.end("Welcome, this is your Home page\n");
    }

    //Health check and uptime endpoint
    else if (req.url === "/health" && req.method === "GET") {
        // console.log("Called GET : 0.0.0.0:8080/health");
        const healthcheck = {
            uptime: process.uptime(),
            message: "OK",
            timestamp: Date.now(),
        };
        res.end(JSON.stringify(healthcheck));
    }

    // /api/cats : GET
    else if (req.url === "/api/cats" && req.method === "GET") {
        // console.log("Called GET : 0.0.0.0:8080/api/cats");
        // get the cats.
        const cats = await new Cat().getCats();
        // set the status code, and content-type
        res.writeHead(200, { "Content-Type": "application/json" });
        // send the data
        res.end(JSON.stringify(cats));
    }

    // /api/cats/:id : GET
    else if (req.url.match(/\/api\/cats\/([0-9]+)/) && req.method === "GET") {
        // console.log("Called GET : 0.0.0.0:8080/api/cats/{id}");
        try {
            // get id from url
            const id = req.url.split("/")[3];
            // get cat
            const cat = await new Cat().getCat(id);
            // set the status code and content-type
            res.writeHead(200, { "Content-Type": "application/json" });
            // send the data
            res.end(JSON.stringify(cat));
        } catch (error) {
            // set the status code and content-type
            res.writeHead(404, { "Content-Type": "application/json" });
            // send the error
            res.end(JSON.stringify({ message: error }));
        }
    }

    // /api/cats/:id : DELETE
    else if (
        req.url.match(/\/api\/cats\/([0-9]+)/) &&
        req.method === "DELETE"
    ) {
        // console.log("Called DELETE : 0.0.0.0:8080/api/cats/{id}");
        try {
            // get the id from url
            const id = req.url.split("/")[3];
            // delete cat
            let message = await new Cat().deleteCat(id);
            // set the status code and content-type
            res.writeHead(200, { "Content-Type": "application/json" });
            // send the message
            res.end(JSON.stringify({ message }));
            //or response status = 204 if no response body is sent
               // res.writeHead(204, { "Content-Type": "application/json" }); 

        } catch (error) {
            // set the status code and content-type
            res.writeHead(404, { "Content-Type": "application/json" });
            // send the error
            res.end(JSON.stringify({ message: error }));
        }
    }

    // /api/cats/:id : UPDATE
    else if (
        req.url.match(/\/api\/cats\/([0-9]+)/) &&
        req.method === "PATCH"
    ) {
        // console.log("Called PATCH : 0.0.0.0:8080/api/cats/{id}");
        try {
            // get the id from the url
            const id = req.url.split("/")[3];
            // update cat
            let updated_cat = await new Cat().updateCat(id);
            // set the status code and content-type
            res.writeHead(200, { "Content-Type": "application/json" });
            // send the message
            res.end(JSON.stringify(updated_cat));
        } catch (error) {
            // set the status code and content type
            res.writeHead(404, { "Content-Type": "application/json" });
            // send the error
            res.end(JSON.stringify({ message: error }));
        }
    }

    // /api/cats/ : POST
    else if (req.url === "/api/cats" && req.method === "POST") {
        // console.log("Called POST : 0.0.0.0:8080/api/cats");
        // get the data sent along
        let cat_data = await getReqData(req);
        // create the cat
        let cat = await new Cat().createCat(JSON.parse(cat_data));
        // set the status code and content-type
        res.writeHead(201, { "Content-Type": "application/json" }); //was 200
        //send the cat
        res.end(JSON.stringify(cat));
    }

    // No route present
    else {
        console.log(
            "This endpoint is not implemented / unavailable at the moment !!"
        );
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
     console.log(`server started on ${HOST}  port: ${PORT}`);
//     console.log(`server started on port: ${PORT}`);
});
