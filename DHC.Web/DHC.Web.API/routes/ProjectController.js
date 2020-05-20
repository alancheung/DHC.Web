"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const database_1 = require("../SQLite/database");
const nameof_1 = require("../common/nameof");
const Todo_1 = require("../SQLite/tables/Todo");
// Register routes
const router = express.Router();
const root = '/';
router.get(root, getRoot);
/**
 * ROUTE: GET ./todo
 * Returns all values from the AccessLog database table.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function getRoot(req, resp) {
    database_1.db.all(`SELECT * FROM ${Todo_1.Todo.name} ORDER BY ${nameof_1.nameof("Priority")}`, (err, data) => {
        if (err)
            console.log(err);
        data = data.map(d => new Todo_1.Todo(d));
        resp.json(data);
    });
}
exports.default = router;
//# sourceMappingURL=ProjectController.js.map