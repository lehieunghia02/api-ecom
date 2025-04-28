require('dotenv').config()
//require mongoose module
import mongoose from 'mongoose'

//require chalk module to give colors to console text
import chalk from 'chalk'

//require database URL from properties file
// const dbURL = `mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@ecommerce.f2agf.mongodb.net/main?retryWrites=true&w=majority`
const connected = chalk.bold.cyan
const error = chalk.bold.yellow
const disconnected = chalk.bold.red
const termination = chalk.bold.magenta

//export this function and imported by server.js
export const connectMongoDB = async () => {
  try {
    // Validate environment variables
    const username = process.env.USERNAME_DB
    const password = process.env.PASSWORD_DB

    if (!username || !password) {
      throw new Error(
        'MongoDB credentials are not properly configured in environment variables'
      )
    }

    const dbURL = `mongodb+srv://${username}:${password}@ecom-cluster.7psgc3w.mongodb.net/main?retryWrites=true&w=majority`

    await mongoose.connect(dbURL, {
      ssl: true,
    })

    mongoose.connection.on('connected', function () {
      console.log(
        connected('Mongoose default connection is open to MongoDB Atlas')
      )
    })

    mongoose.connection.on('error', function (err) {
      console.log(error('Mongoose default connection error: ' + err))
    })

    mongoose.connection.on('disconnected', function () {
      console.log(disconnected('Mongoose default connection is disconnected'))
    })

    process.on('SIGINT', function () {
      mongoose.connection.close(function () {
        console.log(
          termination(
            'Mongoose default connection is disconnected due to application termination'
          )
        )
        process.exit(0)
      })
    })
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err)
    process.exit(1)
  }
}

export const isValidId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id)
}
