import express = require('express');
import { db } from '../SQLite/database';
import { Request, Response } from 'express';
import { SqlCommand } from '../SQLite/sqlCommand';
import { nameof } from '../common/nameof';
import { isbooleantrue } from '../common/isbooleantrue';
import { Todo } from '../SQLite/tables/Todo';

// Register routes
const router = express.Router();
const root: string = '/';
router.get(root, getRoot);

/**
 * ROUTE: GET ./todo
 * Returns all values from the AccessLog database table.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function getRoot(req: Request, resp: Response): void {
    db.all(`SELECT * FROM ${Todo.name} ORDER BY ${nameof<Todo>("Priority")}`, (err, data: Todo[]) => {
        if (err) console.log(err);
        data = data.map(d => new Todo(d));

        resp.json(data);
    });
}

export default router;