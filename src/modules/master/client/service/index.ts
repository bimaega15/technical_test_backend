import { Request } from "express";
import Client from "../model";
import Users from "../../users/model";
import UsersMapping from "../../usersMapping/model";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Authentication from "../../../../utils/Authentication";

class ClientService {
  body: Request["body"];
  params: Request["params"];
  user: any;

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
    this.user = req.user;
  }

  getAll = async () => {
    const datas = await UsersMapping.aggregate([
      {
        $lookup: {
          from: "client",
          localField: "usersMappingRef",
          foreignField: "usersMappingRef",
          as: "client",
        },
      },
      {
        $unwind: "$client",
      },

      {
        $lookup: {
          from: "users",
          localField: "usersRef",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unwind: "$users",
      },

      {
        $project: {
          _id: 1,

          typeMapping: 1,

          "client.name": 1,
          "client.address": 1,
          "client.phoneNumber": 1,

          "users.username": 1,
          "users.isActive": 1,
        },
      },
      {
        $match: {
          typeMapping: "client",
          "users.isActive": true,
        },
      },
    ]);

    return datas;
  };

  store = async () => {
    // users
    const { username, password, isActive, email } = this.body;

    // client
    const { name, address, phoneNumber } = this.body;

    // to db users
    let setIsActive =
      isActive != undefined ? (isActive == 1 ? true : false) : false;
    const setPassword = await Authentication.passwordHash(password);

    const dataUsers = await Users.create({
      email,
      username,
      password: setPassword,
      isActive: setIsActive,
    });

    const dataClient = await Client.create({
      name,
      address,
      phoneNumber,
      isActive: setIsActive,
      userCreate: this.user.usersRef,
      userUpdate: this.user.usersRef,
    });
    const getClient: any = await Client.findOne({
      _id: dataClient._id,
    });
    getClient.usersMappingRef = dataClient._id;
    getClient.save();

    // // to db users mapping
    await UsersMapping.create({
      typeMapping: "client",
      usersRef: dataUsers._id,
      usersMappingRef: dataClient._id,
    });

    return true;
  };

  getOne = async () => {
    const { id } = this.params;
    const findId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);

    const data = await UsersMapping.aggregate([
      {
        $lookup: {
          from: "client",
          localField: "usersMappingRef",
          foreignField: "usersMappingRef",
          as: "client",
        },
      },
      {
        $unwind: "$client",
      },

      {
        $lookup: {
          from: "users",
          localField: "usersRef",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unwind: "$users",
      },

      {
        $project: {
          _id: 1,

          typeMapping: 1,

          "client.name": 1,
          "client.address": 1,
          "client.phoneNumber": 1,

          "users.username": 1,
          "users.isActive": 1,
        },
      },
      {
        $match: {
          _id: findId,
          typeMapping: "client",
        },
      },
      {
        $limit: 1,
      },
    ]);

    return data[0];
  };

  update = async () => {
    const { id } = this.params;
    const findId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);
    const getUsersMapping: any = await UsersMapping.aggregate([
      {
        $lookup: {
          from: "client",
          localField: "usersMappingRef",
          foreignField: "usersMappingRef",
          as: "client",
        },
      },
      {
        $unwind: "$client",
      },
      {
        $lookup: {
          from: "users",
          localField: "usersRef",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unwind: "$users",
      },

      {
        $project: {
          _id: 1,

          typeMapping: 1,

          "client._id": 1,

          "users._id": 1,
          "users.password": 1,
        },
      },
      {
        $match: {
          _id: findId,
          typeMapping: "client",
        },
      },
      {
        $limit: 1,
      },
    ]);

    // users
    const { username, password, isActive, email } = this.body;
    // client
    const { name, address, phoneNumber } = this.body;

    // to db users
    let setIsActive =
      isActive != undefined ? (isActive == 1 ? true : false) : false;
    let setPassword = getUsersMapping[0].users.password;
    if (password != null) {
      setPassword = await Authentication.passwordHash(password);
    }

    await Users.updateOne(
      { _id: getUsersMapping[0].users._id },
      {
        $set: {
          email,
          username,
          password: setPassword,
          isActive: setIsActive,
        },
      }
    );

    const clientRef = getUsersMapping[0].client._id;
    const dataClient = await Client.updateOne(
      {
        _id: clientRef,
      },
      {
        name,
        address,
        phoneNumber,
        isActive: setIsActive,
        userUpdate: this.user.usersRef,
      }
    );

    return dataClient;
  };

  delete = async () => {
    const { id } = this.params;
    const findId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);
    const getUsersMapping: any = await UsersMapping.aggregate([
      {
        $lookup: {
          from: "client",
          localField: "usersMappingRef",
          foreignField: "usersMappingRef",
          as: "client",
        },
      },
      {
        $unwind: "$client",
      },
      {
        $lookup: {
          from: "users",
          localField: "usersRef",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unwind: "$users",
      },

      {
        $project: {
          _id: 1,

          typeMapping: 1,

          "client._id": 1,

          "users._id": 1,
          "users.password": 1,
        },
      },
      {
        $match: {
          _id: findId,
          typeMapping: "client",
        },
      },
      {
        $limit: 1,
      },
    ]);

    await Client.deleteOne({ _id: getUsersMapping[0].client._id });
    await Users.deleteOne({ _id: getUsersMapping[0].users._id });
    await UsersMapping.deleteOne({ _id: getUsersMapping[0]._id });

    return true;
  };
}

export default ClientService;
