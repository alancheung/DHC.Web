import express = require('express');
import { DhcDatabaseContext, DhcDatabase } from '../SQLite/database';
import { Request, Response } from 'express';
import { SqlCommand } from '../SQLite/common-db/SqlCommand';
import { nameof } from '../common/nameof';
import { isbooleantrue } from '../common/isbooleantrue';
import { Todo } from '../SQLite/tables/Todo';
import { Project } from '../SQLite/tables/Project';

/** Router responsible for all requests relating to project/todo controls. */
const projectRouter = express.Router();

// Register routes
const root: string = '/';
projectRouter.get(root, getRoot);
projectRouter.get(`${root}:id`, getTasksForID);

/**
 * ROUTE: GET ./todo
 * Returns all values from the AccessLog database table.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function getRoot(req: Request, resp: Response): void {
    let command = `SELECT * FROM ${Project.name} p ORDER BY ${nameof<Project>("StartDate")} DESC`;
    DhcDatabase.Context.all(command, (err, data: any[]) => {
        if (err) console.log(err);
        resp.json(data);
    });
}

/**
 * ROUTE: GET ./project/{name}
 * Add the object in the request body to the database.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function getTasksForID(req: Request, resp: Response): void {
    let searchName = `%${req.params.id}%`;
    let sqlCommand = `SELECT * FROM ${Todo.name} WHERE ${nameof<Todo>('ProjectId')} LIKE ? ORDER BY ${nameof<Todo>('Priority')}, ${nameof<Todo>('StartDate')} DESC`;

    DhcDatabase.Context.all(sqlCommand, searchName, (err, data: any[]) => {
        if (err) console.log(err);
        resp.json(data);
    });
}

export default projectRouter;