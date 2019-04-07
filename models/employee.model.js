const mongoose = require('mongoose');

var EmployeeSchema = new mongoose.Schema({
    fullName:{
        type : String,
        required :'this field is required'
    },
    email:{
        type : String,
        required :'this field is required'
    },
    mobile:{
        type : Number
    },
    city:{
        type : String
    },
    avatar:{
        type : String
    }
});

EmployeeSchema.path('email').validate((val)=>{
    emailRegex= /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    return emailRegex.test(val);
},'Invalid e-mail...');

EmployeeSchema.path('mobile').validate((val)=>{
    mobileRegex= /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return mobileRegex.test(val);
},'Invalid mobile number...');

mongoose.model('Employee',EmployeeSchema);