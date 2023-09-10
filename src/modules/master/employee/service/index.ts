import { Request } from "express";
import Employee from "../model";
import Users from "../../users/model";
import Helper from "../../../../utils/Helper";
import UsersMapping from "../../usersMapping/model";
import mongoose from "mongoose";
import Authentication from "../../../../utils/Authentication";

class EmployeeService {
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
          from: "employee",
          localField: "usersMappingRef",
          foreignField: "usersMappingRef",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
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
        $addFields: {
          "employee.gender": {
            $cond: {
              if: { $eq: ["$employee.gender", "L"] },
              then: "laki-laki",
              else: "perempuan",
            },
          },
          "employee.birthDate": {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$employee.birthDate",
              },
              timezone: "Asia/Jakarta",
            },
          },
          "employee.dateOfEntry": {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$employee.dateOfEntry",
              },
              timezone: "Asia/Jakarta",
            },
          },
          "employee.outDate": {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$employee.outDate",
              },
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
      {
        $match: {
          typeMapping: "employee",
          "users.isActive": true,
        },
      },
    ]);

    return datas;
  };

  store = async () => {
    // users
    const { username, password, isActive, email } = this.body;

    // employee
    const {
      name,
      typeIdentity,
      numberIdentity,
      fullName,
      gender,
      placeOfBirth,
      birthDate,
      marriedStatus,
      religion,
      education,
      residenceAddress,
      ktpAddress,
      phoneNumber1,
      phoneNumber2,
      employeeNumber,
      dateOfEntry,
      outDate,
      picture,
    } = this.body;

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
      "Employee",
      picture,
      "master/employee",
      null
    );

    const dataEmployee = await Employee.create({
      clientRef: this.user.usersRef,
      name,
      typeIdentity,
      numberIdentity,
      fullName,
      gender,
      email,
      placeOfBirth,
      birthDate: Helper.convertDate(birthDate),
      marriedStatus,
      religion,
      education,
      residenceAddress,
      ktpAddress,
      phoneNumber1,
      phoneNumber2,
      employeeNumber,
      dateOfEntry: Helper.convertDate(dateOfEntry),
      outDate: Helper.convertDate(outDate),
      picture: getPicture,
      isActive: setIsActive,
      usersCreate: this.user.usersRef,
      usersUpdate: this.user.usersRef,
    });
    const getEmployee: any = await Employee.findOne({
      _id: dataEmployee._id,
    });
    getEmployee.usersMappingRef = dataEmployee._id;
    getEmployee.save();

    // // to db users mapping
    await UsersMapping.create({
      typeMapping: "employee",
      usersRef: dataUsers._id,
      usersMappingRef: dataEmployee._id,
    });

    return true;
  };

  getOne = async () => {
    const { id } = this.params;
    const findId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);

    const data = await UsersMapping.aggregate([
      {
        $lookup: {
          from: "employee",
          localField: "usersMappingRef",
          foreignField: "usersMappingRef",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
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
        $addFields: {
          "employee.gender": {
            $cond: {
              if: { $eq: ["$employee.gender", "L"] },
              then: "laki-laki",
              else: "perempuan",
            },
          },
          "employee.birthDate": {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$employee.birthDate",
              },
              timezone: "Asia/Jakarta",
            },
          },
          "employee.dateOfEntry": {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$employee.dateOfEntry",
              },
              timezone: "Asia/Jakarta",
            },
          },
          "employee.outDate": {
            $dateToString: {
              format: "%d/%m/%Y",
              date: {
                $toDate: "$employee.outDate",
              },
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
      {
        $match: {
          _id: findId,
          typeMapping: "employee",
          "users.isActive": true,
        },
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
          from: "employee",
          localField: "usersMappingRef",
          foreignField: "usersMappingRef",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
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
        $match: {
          _id: findId,
          typeMapping: "employee",
        },
      },
      {
        $limit: 1,
      },
    ]);

    // users
    const { username, password, isActive, email } = this.body;
    // employee
    const {
      name,
      typeIdentity,
      numberIdentity,
      fullName,
      gender,
      placeOfBirth,
      birthDate,
      marriedStatus,
      religion,
      education,
      residenceAddress,
      ktpAddress,
      phoneNumber1,
      phoneNumber2,
      employeeNumber,
      dateOfEntry,
      outDate,
      picture,
    } = this.body;

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

    const employeeRef = getUsersMapping[0].employee._id;

    const getPicture = await Helper.uploadFile(
      "Employee",
      picture,
      "master/employee",
      employeeRef
    );
    const dataEmployee = await Employee.updateOne(
      {
        _id: employeeRef,
      },
      {
        name,
        typeIdentity,
        numberIdentity,
        fullName,
        gender,
        email,
        placeOfBirth,
        birthDate: Helper.convertDate(birthDate),
        marriedStatus,
        religion,
        education,
        residenceAddress,
        ktpAddress,
        phoneNumber1,
        phoneNumber2,
        employeeNumber,
        dateOfEntry: Helper.convertDate(dateOfEntry),
        outDate: Helper.convertDate(outDate),
        picture: getPicture,
        isActive: setIsActive,
        usersUpdate: this.user.usersRef,
      }
    );

    return dataEmployee;
  };

  delete = async () => {
    const { id } = this.params;
    const findId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);
    const getUsersMapping: any = await UsersMapping.aggregate([
      {
        $lookup: {
          from: "employee",
          localField: "usersMappingRef",
          foreignField: "usersMappingRef",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
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
        $match: {
          _id: findId,
          typeMapping: "employee",
        },
      },
      {
        $limit: 1,
      },
    ]);

    await Helper.deleteFile(
      "Employee",
      "master/employee",
      getUsersMapping[0].employee._id
    );

    await Employee.deleteOne({ _id: getUsersMapping[0].employee._id });
    await Users.deleteOne({ _id: getUsersMapping[0].users._id });
    await UsersMapping.deleteOne({ _id: getUsersMapping[0]._id });

    return true;
  };
}

export default EmployeeService;
