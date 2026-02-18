require('dotenv').config()
import mongoose from 'mongoose'
import chalk from 'chalk'
import { UserModel } from '../database/models/user.model'
import { CategoryModel } from '../database/models/category.model'
import { ProductModel } from '../database/models/product.model'
import { hashValue } from '../utils/crypt'
import { ROLE } from '../constants/role.enum'

const dbURL = `mongodb://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@${process.env.HOST_DB}:${process.env.PORT_DB}/${process.env.NAME_DB}?authSource=${process.env.AUTH_SOURCE}`

const categories = [
  { name: 'Điện thoại' },
  { name: 'Laptop' },
  { name: 'Tai nghe' },
  { name: 'Đồng hồ' },
]

const users = [
  {
    email: 'admin@lehieunghia.com',
    password: hashValue('123456'),
    name: 'Admin',
    roles: [ROLE.ADMIN],
  },
  {
    email: 'user@lehieunghia.com',
    password: hashValue('123456'),
    name: 'User Test',
    roles: [ROLE.USER],
  },
]

const runSeed = async () => {
  try {
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(chalk.cyan('Connected to MongoDB'))

    // Seed Categories
    await CategoryModel.deleteMany({})
    const createdCategories = await CategoryModel.insertMany(categories)
    console.log(chalk.green(`Seeded ${createdCategories.length} categories`))

    // Seed Users
    await UserModel.deleteMany({})
    await UserModel.insertMany(users)
    console.log(chalk.green(`Seeded ${users.length} users`))

    // Seed Products (optional - cần categoryId)
    const catIds = createdCategories.map((c) => c._id)
    const products = [
      {
        name: 'iPhone 15',
        image: '/images/product/sample.jpg',
        category: catIds[0],
        price: 25000000,
        quantity: 10,
      },
      {
        name: 'MacBook Pro',
        image: '/images/product/sample.jpg',
        category: catIds[1],
        price: 45000000,
        quantity: 5,
      },
      {
        name: 'AirPods Pro',
        image: '/images/product/sample.jpg',
        category: catIds[2],
        price: 6000000,
        quantity: 20,
      },
    ]
    await ProductModel.deleteMany({})
    await ProductModel.insertMany(products)
    console.log(chalk.green(`Seeded ${products.length} products`))

    console.log(chalk.bold.green('Seed completed!'))
  } catch (error) {
    console.error(chalk.red('Seed failed:'), error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

runSeed()
