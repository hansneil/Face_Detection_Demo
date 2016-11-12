/**
 * Created by Neil on 2016/11/10.
 */
var express = require('express');
var fs = require('fs');
var exec = require('child_process').exec;
var multiparty = require('multiparty');

function generatePath(dir) {
  var baseDir = '/home/sjtuicat/hansneil/GFP-DCN/GFP-DCN-Code/code/codes/GFPDCN/';
  return baseDir + dir;
}

function checkFinish(callback) {
    if (fs.existsSync(generatePath('finish.txt'))) {
        data = fs.readFileSync(generatePath('finish.txt'), 'utf-8');
        if (data == 'Finish') {
            callback();
        } else {
            setTimeout(function(){
                checkFinish(callback);
              }, 1000);
        }
    } else {
        setTimeout(function(){
            checkFinish(callback);
        }, 1000);
    }
}

exports.upload = function(req, res) {
    var form = new multiparty.Form();
    form.encoding = 'utf-8';
    form.uploadDir = "uploads/videos/";
    form.parse(req, function(err, fields, files){
        if (fields.angle == -1) {
            var uploads = files.video;
            fs.renameSync(uploads[0].path, form.uploadDir + uploads[0].originalFilename);
            var plotData = fs.readFileSync('uploads/plot_data.txt', 'utf-8');
            var sliceData = fs.readFileSync('uploads/data_slice.txt', 'utf-8');
            setTimeout(() => {
                res.status(200).send({
                    success: true,
                    data: {
                        total: plotData,
                        slice: sliceData
                    }
                });
            }, 10000);
        } else {
            var cmdStr = "bash /home/sjtuicat/hansneil/GFP-DCN/GFP-DCN-Code/code/codes/GFPDCN/mrun.sh";
            var uploads = files.video;
            cmdStr += ' ' + uploads[0].originalFilename + ' 0';
            fs.renameSync(uploads[0].path, form.uploadDir + uploads[0].originalFilename);

            exec(cmdStr);
            checkFinish(function () {
                var plotData = fs.readFileSync(generatePath('plot_data.txt'), 'utf-8');
                var sliceData = fs.readFileSync(generatePath('data_slice.txt'), 'utf-8');
                var cmdClear = 'rm ' + generatePath('finish.txt');
                exec(cmdClear);
                res.status(200).send({
                    success: true,
                    data: {
                        total: plotData,
                        slice: sliceData
                    }
                });
            });
        }
    });
};

exports.uploadImage = function(req, res) {
    var form = new multiparty.Form();
    form.encoding = 'utf-8';
    form.uploadDir = "uploads/images/";
    form.parse(req, function(err, fields, files){
        if (fields.angle == -1) {
            var uploads = files.image;
            fs.renameSync(uploads[0].path, form.uploadDir + uploads[0].originalFilename);
            var plotData = fs.readFileSync('uploads/plot_data.txt', 'utf-8');
            var sliceData = fs.readFileSync('uploads/data_slice.txt', 'utf-8');
            setTimeout(() => {
                res.status(200).send({
                    success: true,
                    data: {
                        total: plotData,
                        slice: sliceData
                    }
                });
            }, 10000);
        } else {
            var cmdStr = "bash /home/sjtuicat/hansneil/GFP-DCN/GFP-DCN-Code/code/codes/GFPDCN/imrun.sh";
            var uploads = files.image;
            cmdStr += ' ' + uploads[0].originalFilename + ' 0';
            fs.renameSync(uploads[0].path, form.uploadDir + uploads[0].originalFilename);

            exec(cmdStr);
            checkFinish(function () {
                var plotData = fs.readFileSync(generatePath('plot_data.txt'), 'utf-8');
                var sliceData = fs.readFileSync(generatePath('data_slice.txt'), 'utf-8');
                var cmdClear = 'rm ' + generatePath('finish.txt');
                exec(cmdClear);
                res.status(200).send({
                    success: true,
                    data: {
                        total: plotData,
                        slice: sliceData
                    }
                });
            });
        }
    });
};
