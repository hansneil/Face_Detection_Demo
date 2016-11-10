/**
 * Created by Neil on 2016/11/10.
 */
var express = require('express');
var fs = require('fs');
var exec = require('child_process').exec;
var multiparty = require('multiparty');

exports.upload = function(req, res) {
    var form = new multiparty.Form();
    form.encoding = 'utf-8';
    form.uploadDir = "uploads/videos/";
    form.parse(req, function(err, fields, files){
        var uploads = files.uploads;
        fs.renameSync(uploads[0].path, form.uploadDir + uploads[0].originalFilename);
    });

    res.send(200, {result: 100});
};
