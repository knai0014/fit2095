let express = require("express");
let ejs = require("ejs");
let path = require("path");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const parcel = require("./models/parcel");
const { update } = require("./models/parcel");
const MongoClient = mongodb.MongoClient;

let app = express();
const PORT_NUMBER = 8080; //27017

let post_db;


const Parcel = require(path.join(__dirname, "models/parcel"));

const url = "mongodb://127.0.0.1:27017/fit2095_lab06";

app.listen(PORT_NUMBER, () => {
    console.log(`Listening on PORT ${PORT_NUMBER}. Visit http://localhost:${PORT_NUMBER}`)
})

app.use(express.urlencoded({ extended: true }));
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use(express.static("public/images"));
app.use(express.static("public/css"));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/", function (request, response){
    response.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/newparcel", function (request, response){
    response.sendFile(path.join(__dirname, "views/newparcel.html"));
});

app.post("/newparcel", function (request, response){
    let parcelDetails = request.body;
    mongoose.connect(url, function (err) {
        if (err) {
            console.log('Error in Mongoose connection');
            throw err;
        }
        
        console.log('Successfully established Mongoose connection');
    
        let parcel1 = new Parcel({
            sender: parcelDetails.sender,
            address: parcelDetails.address,
            weight: parcelDetails.weight,
            fragile: parcelDetails.fragile,
            shipmentType: parcelDetails.shipmentType,
            cost: parcelDetails.cost
        });
    
        parcel1.save(function (err){
            if (err){
                response.sendFile(path.join(__dirname, "views/invalidData.html"));
                throw err;
            }
            console.log('Parcel successfully Added to DB');
        })
    });
    response.redirect("/listallparcel")
})

app.get("/listparcel", function (request, response){
    response.sendFile(path.join(__dirname, "views/listparcel.html"));
});

app.get("/listallparcel", function (request, response){
    mongoose.connect(url, function (err) {
        if (err) {
            console.log('Error in Mongoose connection');
            throw err;
        }
        Parcel.find({}, function (err, data) {
            if (err) {
                console.log(err);
                throw err;
            }
            response.render("listallparcel.html", { post_db: data });
        });
    });
});

app.post("/getallparcels", function (request, response){
    response.redirect("/listallparcel")
})

app.post("/getparcelsender", function (request, response){
    var getParcelSender = request.body;
    mongoose.connect(url, function (err) {
        if (err) {
            console.log('Error in Mongoose connection');
            throw err;
        }
        Parcel.find({sender: getParcelSender.Sender}, function (err, data) {
            if (err) {
                console.log(err);
                throw err;
            }
            response.render("listparcelsender.html", { post_db: data });
        });
    });
})

app.post("/getparcelweightrange", function (request, response){
    var getParcelWeightRange = request.body;
    var weightfrom = getParcelWeightRange.weightfrom;
    var weightto = getParcelWeightRange.weightto;
    mongoose.connect(url, function (err) {
        if (err) {
            console.log('Error in Mongoose connection');
            throw err;
        }

        Parcel.where('weight').gte(weightfrom).lte(weightto).exec(function (err, data) {
            if (err) {
                console.log(err);
                throw err;
            }
            response.render("listparcelweightrange.html", { post_db: data });
        });
    });
})

app.get("/deleteparcel", function (request, response){
    response.sendFile(path.join(__dirname, "views/deleteparcel.html"));
});

app.post("/deleteparcelid", function (request, response) {
    let deleteIdParcelDetails = request.body;
    Parcel.deleteMany({_id: deleteIdParcelDetails.ID}, function (err, doc){});
    response.redirect('/listallparcel');
  });

app.post("/deleteparcelsender", function (request, response) {
    let deleteSenderParcelDetails = request.body;
    Parcel.deleteMany({sender: deleteSenderParcelDetails.sender}, function (err, doc){});
    response.redirect('/listallparcel');
});

app.post("/deleteparcelidweight", function (request, response) {
    var deleteIdWeightParcelDetails = request.body;
    Parcel.deleteMany({_id: deleteIdWeightParcelDetails.ID}, function (err, doc){});
    Parcel.deleteMany({sender: deleteIdWeightParcelDetails.sender}, function (err, doc){});
    response.redirect('/listallparcel');
});

app.get("/updateparcel", function (request, response){
    response.sendFile(path.join(__dirname, "views/updateparcel.html"));
});

app.post("/updateparcel", function (request, response) {
    var updateIdParcelDetails = request.body;
    mongoose.connect(url, function (err) {
        if (err) {
            console.log('Error in Mongoose connection');
            throw err;
        }
        
        Parcel.findByIdAndUpdate({_id: updateIdParcelDetails.ID}, {
            sender: updateIdParcelDetails.sender,
            address: updateIdParcelDetails.address,
            weight: updateIdParcelDetails.weight,
            fragile: updateIdParcelDetails.fragile,
            shipmentType: updateIdParcelDetails.shipmentType,
            cost: updateIdParcelDetails.cost
        }, function (err){;
        if (err) {
            throw err;
        }
    });
    response.redirect('/listallparcel');
    });
});

app.get("/clearparcel", function (request, response){
    post_db.collection("parcels").remove({});
    response.redirect('/listallparcel');
});

app.get("*", function (request, response){
    response.sendFile(path.join(__dirname, "views/404.html"));
});