import { envs } from "../../config"
import { CategoryModel } from "../mongo/models/category.model"
import { ProductModel } from "../mongo/models/product.model"
import { UserModel } from "../mongo/models/user.model"
import { MongoDatabase } from "../mongo/mongo-database"
import { seedData } from "./data"

(async () => {
  MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  await main();

  MongoDatabase.disconnect();
})();

const randomBetween0AndX = (x: number) => Math.floor(Math.random() * x);

async function main() {
  // 0. Borrar todo
  await Promise.all([
    UserModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    ProductModel.deleteMany({}),
  ]);

  //1 . crear usuarios
  const users = await UserModel.insertMany(seedData.users);

  //2. crear categorias
  const categories = await CategoryModel.insertMany(
    seedData.categories.map((category) => ({
      ...category,
      user: users[0]._id,
    }))
  );

  //3. crear productos
  await ProductModel.insertMany(
    seedData.products.map((product) => ({
      ...product,
      user: users[randomBetween0AndX(users.length - 1)]._id,
      category: categories[randomBetween0AndX(categories.length - 1)]._id,
    }))
  );

  console.log("Seed completed");
}
