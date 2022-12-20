const EntitySchema = require('typeorm').EntitySchema
const student_credentials = new EntitySchema({
    name:'student1',
    columns:{
        id:{
            primary:true,
            type:'int',
            generated:true
        },
        firstName:{
            type:'varchar',
            nullable:false
        },
        lastName:{
            type:'varchar',

            nullable:false
        },      
        userName:{
            type:'varchar',
            unique:true,
            nullable:false
        },
        password:{
            type:'varchar',
            unique:true,
            nullable:false
        },
        gender:{
            type:'varchar',
            nullable:false
        },
        phoneNumber:{
            type:'varchar',
            nullable:false
        },
        DOB:{
            type:Date,
            nullable:false
        }
        
    }
    
})

 
module.exports = { student_credentials }
