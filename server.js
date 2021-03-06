//Serverseitiges Javascript
const express = require("express");
const mysql = require("mysql2/promise");
const app = express();

mysql.createConnection({
        host: "localhost",
        user: "root",
        password: process.env.DB_PASSWORD,
        database: "travelbuddy",
    })
    .then((con) => {
        connection = con;
    });

app.use(express.static("public"));
app.use(express.json());


//Funktion, die Beiträge aus der DB holt
app.get("/beitraege", async(req, res) => {
    const [
        rows
    ] = await connection.execute("SELECT * FROM reise");
    res.json(rows);
});


//Funktion, die Beiträge hinzufügt
app.post("/beitraege", async(req, res) => {
    const [
        rows,
    ] = await connection.execute(
            "INSERT INTO reise (reiseTitel, inhalt) VALUES (?, ?)", [req.body.titel, req.body.beschreibung])
        .catch((err) => { res.status(500).send('Beitrag konnte nicht gepostet werden.'); });

    res.json({
        id: reise.insertId,
        titel: req.body.titel,
        inhalt: req.body.beschreibung,
    });
});


//Funktion, die Beiträge bearbeitet
app.put("/beitraege/:id", async(req, res) => {
    const [rows] = await connection.execute("SELECT * FROM reise WHERE id=?", [req.params.id]);
    try {
        if (req.neuer_Titel != rows.reiseTitel) {
            const [rows] = await connection.execute("UPDATE reise SET reiseTitel=? WHERE id=?", [req.neuer_Titel, req.params.id]);
        }
        if (req.neuer_Inhalt != rows.inhalt) {
            const [rows] = await connection.execute("UPDATE reise SET inhalt=? WHERE id=?", [req.neuer_Inhalt, req.params.id])
        }
    } catch (err) {
        return res.status(500).send('Aktualisieren fehlgeschlagen');
    }

    res.status(200).send();
});


//Funktion, die Beiträge löscht
app.delete("/beitraege/:id", async(req, res) => {
    console.log(req.params.id);

    const [rows] = await connection.execute("DELETE FROM reise WHERE id = ?", [
        req.params.id,
    ]);

    if (rows.affectedRows === 1) {
        res.status(200).send();
    } else {
        res.status(404).send();
    }
});


app.listen(3000);