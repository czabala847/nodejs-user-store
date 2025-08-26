import mongoose from "mongoose"

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(options: Options) {
    try {
      await mongoose.connect(options.mongoUrl, {
        dbName: options.dbName,
      });
      console.log("Connected to MongoDB");

      return true;
    } catch (error) {
      console.error(error);
    }
  }
}
