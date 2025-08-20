
var ImageKit = require("imagekit");
var mongoose = require("mongoose");

var imagekit = new ImageKit({
    publicKey : process.env.IMGKITPUBLICKEY,
    privateKey : process.env.IMGKITPRIVATEKEY,
    urlEndpoint : process.env.IMGKITURLENDPT
});

const uploadFile = (file) => {
    return new Promise((resolve,reject) => {
        imagekit.upload({
            file: file.buffer,
            fileName: (new mongoose.Types.ObjectId()).toString(),
            folder:"cohort-audio"
        }, (error,result) => {
            if(error){
                reject(error);
            }else {
                resolve(result);
            }
        })
    });
}

module.exports = uploadFile