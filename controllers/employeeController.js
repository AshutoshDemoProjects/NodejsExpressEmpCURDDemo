const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

var router = express.Router();

var Employee = mongoose.model('Employee');

const multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/uploads')
        },
        filename: function (req, file, cb) {
            const ext = file.mimetype.split('/')[1];
            cb(null, file.fieldname + '-' + Date.now() + '.' + ext)
        }
    }),
    fileFilter: (req, file, next) => {
        if (!file) { next(); }
        const image = file.mimetype.startsWith('image/');
        if (image) {  next(null, true); } 
        else { next({ message: "File type not supported" }); }
    }

};
router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Insert Employee"
    });
});
router.post('/', multer(multerConfig).single('avatar'), (req, res) => {
    if (req.body._id == '') {
        insertRecord(req, res);
    }
    else {
        updateRecord(req, res);
    }
});
router.get('/list', (req, res) => {
    Employee.find((err, doc) => {
        if (!err) {
            res.render('employee/list', {
                list: doc
            });
        } else {
            console.log("list error:-" + err);
        }
    });
});
router.get("/delete/:id", (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {  res.redirect('/employee/list');  }
        else {
            console.log("remove error:-" + err);
        }
    });
});
router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    });
});

function insertRecord(req, res) {
    console.log(req.file);
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.avatar = req.file.filename;
    console.log(employee);
    employee.save((err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                handalValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body
                });
            }
        }
    });
}
function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                handalValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body
                });
            }
        }
    });
}
function handalValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'mobile':
                body['mobileError'] = err.errors[field].message;
                break;
            case 'city':
                body['cityError'] = err.errors[field].message;
                break;
        }
    }
}
module.exports = router;
