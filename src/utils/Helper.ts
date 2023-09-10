import { config as dotenv } from "dotenv";
import mv from "mv";
import moment from "moment";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
dotenv();

class Helper {
  public static uploadFile = async (
    model: string,
    file: any,
    location: string,
    id: string | null
  ): Promise<string> => {
    let pathOld = file.filepath;
    let name = file.originalFilename;
    let size = file.size;

    const durationInSeconds: number = moment().valueOf();
    name = durationInSeconds + "_" + file.originalFilename.split(" ").join("-");
    const rootDirectory = process.cwd();
    const pathNew = path.join(
      rootDirectory,
      "src",
      "public",
      "uploads",
      location,
      name
    );
    if (size > 0) {
      if (pathOld != null) {
        if (id != null) {
          await this.deleteFile(model, location, id);
        }

        mv(pathOld, pathNew, function (err) {
          if (err) {
            console.log(err);
          }
        });

        const fileName = pathNew.split("\\");
        const fileDb = fileName[fileName.length - 1];
        return fileDb;
      }
    }

    if (id != null) {
      let getFile = await mongoose.model(name).findOne({
        _id: id,
      });
      return getFile.picture;
    }

    return "default.png";
  };

  public static deleteFile = async (
    name: string,
    location: string,
    id: string | null
  ) => {
    if (id != null) {
      let getFile = await mongoose.model(name).findOne({
        _id: id,
      });

      const setLocation = `./src/public/uploads`;
      if (getFile.picture != "default.png" && getFile.picture != null) {
        const rootDirectory = process.cwd();
        const locationFile = path.join(
          rootDirectory,
          "src",
          "public",
          "uploads",
          location,
          getFile.picture
        );

        let unlink = locationFile;
        if (fs.existsSync(unlink)) {
          fs.unlinkSync(unlink);
        }
      }
    }
  };

  public static convertDate = (passDate: string) => {
    let splitDate = passDate.split("/");
    return new Date(
      parseInt(splitDate[2]),
      parseInt(splitDate[1]) - 1,
      parseInt(splitDate[0])
    );
  };
}

export default Helper;
