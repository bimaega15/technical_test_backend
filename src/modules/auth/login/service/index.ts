import { Request } from "express";
import Users from "../../../master/users/model/index";
import Authentication from "../../../../utils/Authentication";
import UsersMapping from "../../../master/usersMapping/model/index";

class AuthService {
  body: Request["body"];
  params: Request["params"];

  constructor(req: Request) {
    this.body = req.body;
    this.params = req.params;
  }

  authentication = async () => {
    const { username, password } = this.body;
    const getUsers = await Users.countDocuments({
      username: username,
    });
    if (getUsers > 0) {
      const dataUsers: any = await Users.findOne({
        username: username,
      });
      const passwordCompare = await Authentication.passwordCompare(
        password,
        dataUsers.password
      );
      if (passwordCompare) {
        const getUsersMapping: any = await UsersMapping.findOne({
          usersRef: dataUsers._id,
        });
        let data: any = null;
        if (getUsersMapping.typeMapping == "admin") {
          data = await UsersMapping.aggregate([
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
                usersRef: 1,

                "admin._id": 1,
                "admin.name": 1,
                "admin.address": 1,
                "admin.phoneNumber": 1,
                "admin.email": 1,
                "admin.gender": 1,
                "admin.picture": 1,

                "users._id": 1,
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
                usersRef: dataUsers._id,
              },
            },
            {
              $limit: 1,
            },
          ]);
        }

        if (getUsersMapping.typeMapping == "client") {
          data = await UsersMapping.aggregate([
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
                usersRef: 1,

                "client._id": 1,
                "client.name": 1,
                "client.address": 1,
                "client.phoneNumber": 1,

                "users._id": 1,
                "users.username": 1,
                "users.isActive": 1,
                "users.email": 1,
              },
            },


            {
              $match: {
                usersRef: dataUsers._id,
              },
            },
            {
              $limit: 1,
            },
          ]);
        }

        return {
          status: true,
          message: "Berhasil login",
          result: Authentication.generateToken(data[0]),
        };
      } else {
        return {
          status: false,
          message: "Password anda salah",
        };
      }
    } else {
      return {
        status: false,
        message: "Username anda salah",
      };
    }
  };
}

export default AuthService;
