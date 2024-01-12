const express = require('express');
const app = express();
const client = require("../db/connect")
const usersModel = require("../db/models/usersModel");
const { Types: { ObjectId } } = require('mongoose');

app.get("/users", async (req, res) => {
  let isconnect = await client.connect();
  if (isconnect) {

    const currentPage = req.query["currentPage"] ? parseInt(req.query["currentPage"]) : 1;
    const pageSize = req.query["pageSize"] ? parseInt(req.query["pageSize"]) : 10000;
    const userid = req.query["userid"] ? req.query["userid"] : null;
    let query = [
      {
        $match: {
          _id: new ObjectId(userid),
          isDeleted: false,
          Channels: {
            $elemMatch: {
              url: { $ne: "" }
            }
          }
        }
      },
      {
        $lookup: {
          from: "Users",
          localField: "Channels.toUserId",
          foreignField: "_id",
          as: "Users"
        }
      },
      { $addFields: {maxRowCount: {$size: "$Users"}}}
    ]
    let dte = await usersModel.aggregate(query).skip((currentPage - 1) * pageSize).limit(pageSize)    
    if (dte) {     
      res.status(200).send(dte)
    }
    else {
      res.status(400).send({ error: "can't find data." })
    }
  }

})
app.post("/users/get", async (req, res) => {
  let isconnect = await client.connect();
  if (isconnect) {
    let dte = await usersModel.findOne(req.body);
    if (dte) {
      res.status(200).send(dte)
    }
    else {
      res.status(400).send({ error: "can't find data." })
    }
  }

})
app.get("/users/:id", async (req, res) => {
  let isconnect = await client.connect();
  let _id = req.params.id;

  if (isconnect) {
    let dte = await usersModel.findById(_id);
    if (dte) {
      res.status(200).send(dte)
    }
    else {
      res.status(400).send({ error: `can't find admin with id: ${_id}` })
    }
  }

})
app.post("/users/create", async (req, res) => {
  let isconnect = await client.connect();
  if (isconnect) {
    const admin = new usersModel(req.body)
    try {
      let dte = await admin.save();
      if (dte) {
        res.status(200).send(dte)
      }
    }
    catch (ex) {
      res.status(400).send({ status: "failed", error: ex.toString() })
    }

  }
})
app.patch("/users/:id", async (req, res) => {
  let isconnect = await client.connect();
  let _id = req.params.id;
  if (isconnect) {
    let dte = await usersModel.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if (dte) {
      res.status(200).send({ success: true, user: dte })
    }
    else {
      res.status(400).send({ error: `can't update admin with id: ${_id}` })
    }
  }
})
app.delete("/users/:id", async (req, res) => {
  let isconnect = await client.connect();
  let _id = req.params.id;
  if (isconnect) {
    let dte = await usersModel.findByIdAndUpdate(_id, { isDeleted: true }, { new: true, runValidators: true });
    if (dte) {
      res.status(200).send({ success: true })
    }
    else {
      res.status(400).send({ error: `can't delete admin with id: ${_id}` })
    }
  }
})

module.exports = app;