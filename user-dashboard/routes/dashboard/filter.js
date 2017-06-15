
/* Copyright IBM Corp, All Rights Reserved.

 SPDX-License-Identifier: Apache-2.0
 */

/**
 * Created by lixuc on 2017/5/3.
 */
var express = require("express");
var config = require("../../modules/configuration");
var Profile = require("../../modules/profile");

var router = express.Router();

router.get([
    "/",
    "/chain",
    "/chain/:id",
    "/contract",
    "/analytics",
    "/analytics/chaincode",
    "/analytics/fabric",
    "/analytics/infrastructure",
    "/store"
], function(req, res, next) {
    var userInfo = req.cookies[config.cookieName];
    if (userInfo) {
        userInfo = JSON.parse(userInfo);
        var profile = new Profile(userInfo.apikey);
        profile.init().then(function(result) {
            return profile.load();
        }).then(function(result) {
            res.locals.username = result.result.name || userInfo.username.split("@")[0];
            next();
        }).catch(function(err) {
            var e = new Error(err.message);
            e.status = 500;
            next(e);
        });
    } else {
        res.cookie("referer", req.originalUrl);
        res.redirect("/");
    }
});
module.exports = router;