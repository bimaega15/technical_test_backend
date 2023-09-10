import { Request } from "express";
import Admin from "../model";
import Users from "../../users/model";
import Employee from "../../employee/model";
import Helper from "../../../../utils/Helper";
import UsersMapping from "../../usersMapping/model";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Authentication from "../../../../utils/Authentication";

class AdminService {
  body: Request["body"];
  params: Request["params"];

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
  }

  getAll = async () => {
    const datas = await UsersMapping.aggregate([
      {
        $lookup: {
          from: "admin",
          localField: "usersMappingRef",
          foreignField: "usersMappingRef",
          as: "admin",
        },
      },
      {
        $unwind: "$admin",
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

          "admin.name": 1,
          "admin.address": 1,
          "admin.phoneNumber": 1,
          "admin.email": 1,
          "admin.gender": 1,
          "admin.picture": 1,

          "users.username": 1,
          "users.isActive": 1,
        },
      },

      {
        $addFields: {
          "admin.gender": {
            $cond: {
              if: { $eq: ["$admin.gender", "L"] },
              then: "laki-laki",
              else: "perempuan",
            },
          },
        },
      },

      {
        $match: {
          typeMapping: "admin",
          "users.isActive": true
        },
      },
    ]);

    return datas;
  };

  store = async () => {
    // users
    const { username, password, isActive, email } = this.body;

    // admin
    const { name, address, phoneNumber, gender, picture } = this.body;

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

    const getPicture = await Helper.uploadFile(
      "Admin",
      picture,
      "master/admin",
      null
    );

    const dataAdmin = await Admin.create({
      name,
      address,
      phoneNumber,
      email,
      gender,
      picture: getPicture,
      isActive: setIsActive,
    });
    const getAdmin: any = await Admin.findOne({
      _id: dataAdmin._id,
    });
    getAdmin.usersMappingRef = dataAdmin._id;
    getAdmin.save();

    // // to db users mapping
    await UsersMapping.create({
      typeMapping: "admin",
      usersRef: dataUsers._id,
      usersMappingRef: dataAdmin._id,
    });

    return true;
  };

  getOne = async () => {
    const { id } = this.params;
    const findId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);

    const data = await UsersMapping.aggregate([
      {
        $lookup: {
          from: "admin",
          localField: "usersMappingRef",
          foreignField: "usersMappingRef",
          as: "admin",
        },
      },
      {
        $unwind: "$admin",
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

          "admin.name": 1,
          "admin.address": 1,
          "admin.phoneNumber": 1,
          "admin.email": 1,
          "admin.gender": 1,
          "admin.picture": 1,

          "users.username": 1,
          "users.isActive": 1,
        },
      },

      {
        $addFields: {
          "admin.gender": {
            $cond: {
              if: { $eq: ["$admin.gender", "L"] },
              then: "laki-laki",
              else: "perempuan",
            },
          },
        },
      },

      {
        $match: {
          _id: findId,
          typeMapping: "admin",
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
          from: "admin",
          localField: "usersMappingRef",
          foreignField: "usersMappingRef",
          as: "admin",
        },
      },
      {
        $unwind: "$admin",
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

          "admin._id": 1,

          "users._id": 1,
          "users.password": 1,
        },
      },
      {
        $match: {
          _id: findId,
          typeMapping: "admin",
        },
      },
      {
        $limit: 1,
      },
    ]);

    // users
    const { username, password, isActive, email } = this.body;
    // admin
    const { name, address, phoneNumber, gender, picture } = this.body;

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

    const adminRef = getUsersMapping[0].admin._id;

    const getPicture = await Helper.uploadFile(
      "Admin",
      picture,
      "master/admin",
      adminRef
    );
    const dataAdmin = await Admin.updateOne(
      {
        _id: adminRef,
      },
      {
        name,
        address,
        phoneNumber,
        email,
        gender,
        picture: getPicture,
        isActive: setIsActive,
      }
    );

    return dataAdmin;
  };

  delete = async () => {
    const { id } = this.params;
    const findId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);
    const getUsersMapping: any = await UsersMapping.aggregate([
      {
        $lookup: {
          from: "admin",
          localField: "usersMappingRef",
          foreignField: "usersMappingRef",
          as: "admin",
        },
      },
      {
        $unwind: "$admin",
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

          "admin._id": 1,

          "users._id": 1,
          "users.password": 1,
        },
      },
      {
        $match: {
          _id: findId,
          typeMapping: "admin",
        },
      },
      {
        $limit: 1,
      },
    ]);

    await Helper.deleteFile("Admin", "master/admin", getUsersMapping[0].admin._id);

    await Admin.deleteOne({ _id: getUsersMapping[0].admin._id });
    await Users.deleteOne({ _id: getUsersMapping[0].users._id });
    await UsersMapping.deleteOne({ _id: getUsersMapping[0]._id });

    return true;
  };
}

export default AdminService;
