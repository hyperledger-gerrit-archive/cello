/**
 * Created by lixuc on 2017/5/2.
 */
import login from './login'
import register from './register'
import profile from './profile'
import sendResetEmail from './send_reset_email'
import chain from './chain'
import fabric from './fabric'
import chainCode from './chain_code'

const express = require("express");
const multer  = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Profile = require("../../modules/profile");
const Chain = require("../../modules/chain");
const Chaincode = require("../../modules/chaincode");
const mongoClient = require("../../modules/mongoclient");
const Contract = require("../../modules/contract");
const Analytics = require("../../modules/analytics");

const router = express.Router();

router.use("/login", login)
router.use("/register", register)
router.use("/profile", profile)
router.use("/send-reset-email", sendResetEmail)
router.use("/chain", chain)
router.use("/fabric", fabric)
router.use("/chain-code", chainCode)

router.post("/:apikey/contract/upload", function(req, res) {
    mongoClient.getGridFS().then(function(gfs) {
        return new Promise(function(resolve, reject) {
            var storage = GridFsStorage({
                gfs: gfs,
                root: "smartcontract",
                filename: function(req, file, cb) {
                    cb(null, file.originalname);
                },
                metadata: function(req, file, cb) {
                    cb(null, { apikey: req.params.apikey });
                }
            });
            var upload = multer({ storage: storage }).single("smartcontract");
            upload(req, res, function (err) {
                if (err) {
                    reject(err);
                } else {
                    res.json({
                        result: true,
                        name: req.file.filename,
                        url: req.baseUrl + "/contract?id=" + req.file.id
                    })
                }
            });
        });
    }).catch(function(err) {
        res.json({
            result: false,
            message: err.name + ": " + err.message
        });
    });
});
router.get("/contract", function(req, res) {
    mongoClient.getGridFS().then(function(gfs) {
        return new Promise(function(resolve, reject) {
            var readstream = gfs.createReadStream({
                _id: req.query.id,
                root: "smartcontract"
            });
            readstream.on("error", function (err) {
                reject(err);
            });
            readstream.pipe(res);
        });
    }).catch(function(err) {
        res.json({
            result: false,
            message: err.name + ": " + err.message
        });
    });
});
router.post("/:apikey/contract/create", function(req, res) {
    var contract = new Contract(req.params.apikey);
    contract.create(req.body.author,
                    req.body.name,
                    req.body.description,
                    req.body.version,
                    req.body.url)
    .then(function(result) {
        res.json(result);
    }).catch(function(err) {
        res.json(err);
    });
});
router.get("/:apikey/contract/list/:group", function(req, res) {
    var contract = new Contract(req.params.apikey);
    contract.list(req.params.group, req.query.page).then(function(result) {
        res.json(result);
    }).catch(function(err) {
        res.json(err);
    });
});
router.get("/:apikey/contract/list", function(req, res) {
    var contracts = {};
    var contract = new Contract(req.params.apikey);
    contract.list("public", -1).then(function(result) {
        contracts["public"] = result.contracts;
        return contract.list("private", -1);
    }).then(function(result) {
        contracts["private"] = result.contracts;
        res.json(Object.assign(contracts, { success: true }));
    }).catch(function(err) {
        res.json(err);
    });
});
router.post("/contract/:id/deploy", function(req, res) {
    var contract = new Contract();
    contract.deploy(req.body.chain,
                    req.params.id,
                    req.body.name,
                    req.body.func,
                    req.body.args)
    .then(function(result) {
        res.json(result);
    }).catch(function(err) {
        res.json(err);
    });
});
router.post("/:apikey/contract/:id/edit", function(req, res) {
    var contract = new Contract(req.params.apikey);
    contract.edit(req.params.id,
                  req.body.name,
                  req.body.description,
                  req.body.version,
                  req.body.author,
                  req.body.url)
    .then(function(result) {
        res.json(result);
    }).catch(function(err) {
        res.json(err);
    });
});
router.post("/:apikey/contract/:id/delete", function(req, res) {
    var contract = new Contract(req.params.apikey);
    contract.delete(req.params.id).then(function(result) {
        res.json(result);
    }).catch(function(err) {
        res.json(err);
    });
});
router.get("/chain/:id/analytics", function(req, res) {
    var analytics = new Analytics(req.params.id);
    analytics.overview().then(function(result) {
        res.json(result);
    }).catch(function(err) {
        res.json(err);
    });
});
router.get("/chain/:id/analytics/chaincode/list", function(req, res) {
    var analytics = new Analytics(req.params.id);
    analytics.chaincodeList().then(function(result) {
        res.json(result);
    }).catch(function(err) {
        res.json(err);
    });
});
router.get("/chain/:chainId/analytics/chaincode/:chaincodeId/operations", function(req, res) {
    var analytics = new Analytics(req.params.chainId);
    analytics.chaincodeOperations(req.params.chaincodeId, req.query.timestamp).then(function(result) {
        res.json(result);
    }).catch(function(err) {
        res.json(err);
    });
});
router.get("/chain/:id/analytics/fabric", function(req, res) {
    var analytics = new Analytics(req.params.id);
    analytics.fabric(req.query.timestamp).then(function(result) {
        res.json(result);
    }).catch(function(err) {
        res.json(err);
    });
});
router.get("/chain/:id/analytics/infrastructure", function(req, res) {
    var analytics = new Analytics(req.params.id);
    analytics.infrastructure(req.query.size).then(function(result) {
        res.json(result);
    }).catch(function(err) {
        res.json(err);
    });
});
module.exports = router;
