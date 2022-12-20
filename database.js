const { DataSource } =require('typeorm');
require("dotenv").config();
const {student_credentials} = require('./entity/student')
const {otpSchema} =require('./entity/otp')
const dataSource = new DataSource({
    type : process.env.name,
    host : process.env.host,
    port : process.env.Default_port,
    username : process.env.username,
    password : process.env.password,
    database : process.env.databaseName,
    entities : [student_credentials,otpSchema],
    migrations :['migrations/*.js'],
    migrationsTableName : 'postgres_migrations',
    cli:{
        entitiesDir:[student_credentials,otpSchema]
    },
    synchronize :true,

})
module.exports = { dataSource }
