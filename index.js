const express = require("express");
const app = express();

const mongodb = require("mongodb");
let MongoClient = mongodb.MongoClient;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

MongoClient.connect("mongodb://localhost:27017", function (err, client) {
  err
    ? (console.log("MongoDB no conectado"), console.log(`error: ${err}`))
    : ((app.locals.db = client.db("pruebas")),
      console.log("MongoDB se ha conectado correctamente"));
});

app.get("/api/mesas", (req, res) => {
  app.locals.db
    .collection("mesas")
    .find()
    .toArray((err, datos) => {
      err
        ? (console.log(err), res.send({ mensaje: "error:" + err }))
        : (console.log(datos), res.send({ results: datos }));
    });
});

app.post("/api/anyadir", (req, res) => {
  let mesa = {
    tamanyo: req.body.tamanyo,
    color: req.body.color,
    material: req.body.material,
    patas: parseInt(req.body.patas),
  };
  app.locals.db.collection("mesas").insertOne(mesa, function (err, datos) {
    err
      ? (console.log(err), res.send({ mensaje: "error:" + err }))
      : (console.log(datos), res.send({ results: datos }));
  });
});

app.put("/api/modificar/:color", (req, res) => {
  const color = req.params.color;

  app.locals.db
    .collection("mesas")
    .updateMany(
      { color: color },
      { $set: { color: "Granate" } },
      function (err, datos) {
        err
          ? (console.log(err), res.send({ mensaje: "error:" + err }))
          : (console.log(datos), res.send({ results: datos }));
      }
    );
});

app.delete("/api/borrar/:patas", function (req, res) {
  const patas = parseInt(req.params.patas);

  app.locals.db
    .collection("mesas")
    .deleteMany({ patas: patas }, function (err, datos) {
      err
        ? (console.log(err), res.send({ mensaje: "error:" + err }))
        : (console.log(datos), res.send({ results: datos }));
    });
});

app.listen(process.env.PORT || 3003);
