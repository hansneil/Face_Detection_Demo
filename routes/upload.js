/**
 * Created by Neil on 2016/11/10.
 */
var express = require('express');
var fs = require('fs');
var exec = require('child_process').exec;
var multiparty = require('multiparty');
var cmdStr = "bash /home/sjtuicat/hansneil/GFP-DCN/GFP-DCN-Code/code/codes/GFPDCN/mrun.sh upload.mp4 1";

function checkFinish(callback) {
    if (fs.existsSync('/home/sjtuicat/hansneil/GFP-DCN/GFP-DCN-Code/code/codes/GFPDCN/finish.txt')) {
        data = fs.readFileSync('/home/sjtuicat/hansneil/GFP-DCN/GFP-DCN-Code/code/codes/GFPDCN/finish.txt', 'utf-8');
        if (data == 'Finish') {
            console.log('Finished');
            callback();
        } else {
            setTimeout(function(){
                console.log("Not Yet");
                checkFinish(callback);
              }, 1000);
        }
    } else {
        setTimeout(function(){
            console.log("Not Yet");
            checkFinish(callback);
        }, 1000);
    }
}

exports.upload = function(req, res) {
    var form = new multiparty.Form();
    form.encoding = 'utf-8';
    form.uploadDir = "uploads/videos/";
    form.parse(req, function(err, fields, files){
        var uploads = files.uploads;
        fs.renameSync(uploads[0].path, form.uploadDir + uploads[0].originalFilename);
        exec(cmdStr);
        checkFinish(function () {
          res.send(200, {result: 100});
        });
    });
};
