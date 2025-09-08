import { Settings } from "../models/Settings";
import { NextFunction, Request, Response } from 'express';
import { Users } from "../models/Users";
import { get_role_permissions_function } from "../services/admin.service";
import { errorMessages, infoMessages, moduleNames } from '../helpers/stringHelpers'
import { UserSessions } from "../models/UserSessions";
import jwt from 'jsonwebtoken';
import fs from "fs";
import path from "path";
import { constants } from '../../utils/constants';
import { logger } from "../config/logger";

export async function isAdminLoggedIn(request: Request, response: Response, next: NextFunction) {
    //get the admin_login_token setting from the settings table
    try {
        const setting = await Settings.findOne({
            where: {
                name: 'admin_login_token'
            }
        });
        //if nothing found, not logged in
        if (!setting) {
            response.status(500).json({ message: errorMessages.INCORRECT_SYSTEM_CONFIG });
            return;
        }
        logger.info(request.headers)
        //check if the headers are valid
        const userToken = request.headers['Authorization'] as string;
        if (!userToken) {
            response.status(403).json({ message: errorMessages.INCORRECT_REQUEST_CONFIG });
            return;
        }
        else {
            //check if the token is valid
            if (!validateAdminToken(userToken)) {
                response.status(401).json({ message: errorMessages.NOT_LOGGED_IN_AS_ADMIN });
                return;
            }
            if (userToken.substring(-20) !== setting?.value) {
                response.status(401).json({ message: errorMessages.NOT_LOGGED_IN_AS_ADMIN });
                return;
            }
        }
        next();
    } catch (error) {
        console.error(error);
        logger.error({ message: `error in receiving : ${error}` })
        throw error;
    }

}


export async function isUserLoggedIn(request: Request, response: Response, next: NextFunction) {

    //check if the headers are valid
    const userToken = request.headers['token'];
    const userId = request.headers['user_id'];
    if (!userToken || !userId) {
        response.status(403).json({ message: errorMessages.INCORRECT_REQUEST_CONFIG });
    }
    const user = await Users.findOne({
        where: {
            id: userId,
            token: userToken
        }
    })
    if (!user || user.token !== userToken) {
        response.status(403).json({ message: errorMessages.NOT_LOGGED_IN });
    }
    request.user_id = user!.id.toString();
    next();
}


export function validateAdminToken(token: string): boolean {
    try {
        const jwtSecret = getJWTSecret();
        const decoded = jwt.verify(token, jwtSecret);
        return !!decoded && typeof decoded === 'object' && decoded.role === 'admin';
    } catch (error) {
        console.error(error);
        logger.error({ message: `error in receiving : ${error}` })
        return false;
    }
}

/**
 * checks if the user has permission to access an endpoint. for admin, no permission check needed
 * @param permission the name of the permission
 * @returns void
 */
export async function hasPermission(request: Request, response: Response, next: NextFunction) {
    const setting = await Settings.findOne({
        where: {
            name: 'admin_login_token'
        }
    });
    //if nothing found, not logged in
    if (!setting) {
        response.status(500).json({ message: errorMessages.INCORRECT_SYSTEM_CONFIG });
        return;
    }
    Object.keys(request.headers).forEach((key) => {
        logger.info(`${key}: ${request.headers[key]}`)
    })
    logger.info(request.headers['authorization'])
    //check if the headers are valid
    const userToken = request.headers['authorization'] as string;
    if (!userToken) {
        response.status(403).json({ message: errorMessages.INCORRECT_REQUEST_CONFIG });
        return;
    }
    const token = userToken.split(' ')[1];
    //check if the token is valid for the admin
    if (validateAdminToken(token)) {
        if (token.substring(-20) !== setting?.value) {
            response.status(401).json({ message: errorMessages.NOT_LOGGED_IN_AS_ADMIN });
            return;
        }
        request.user_id = '0';
        next();
        return;
    }
    response.status(403).json({ message: errorMessages.NOT_LOGGED_IN });
    return;
    //check if it's a user
    // if (userToken.substring(-20) !== setting?.value) {
    //     response.status(401).json({ message: errorMessages.NOT_LOGGED_IN_AS_ADMIN });
    //     return;
    // }

    // const userSession = userId ? await UserSessions.findOne({
    //     where: {
    //         user_id: userId,
    //         token: userToken
    //     }
    // }) : null;

    // const user = userId ? await Users.findOne({
    //     where: {
    //         id: userId,
    //         token: userToken
    //     }
    // }) : null;

    // const adminSession = await UserSessions.findOne({
    //     where: {
    //         user_id: '0',
    //         token: userToken
    //     }
    // });
    // if (userSession) {
    //     //check the permission, set the request user_id and call next
    //     const permission = routePermissions[request.path]
    //     if (permission) {
    //         const rolePermissions = await get_role_permissions_function({ id: user!.role_id.toString() });
    //         if (!rolePermissions.find(item => item.name === permission)) {
    //             response.status(403).json({ message: errorMessages.NO_PERMISSION });
    //             return;
    //         }
    //     }
    //     request.user_id = user!.id.toString();
    //     next();
    // }
    // else if (adminSession) {
    //     //set the request user_id to "0" for admin and call next
    //     request.user_id = "0";
    //     next();
    // }
    // else {
    //     //user is not logged in at all
    //     response.status(403).json({ message: errorMessages.NOT_LOGGED_IN });
    //     return;
    // }

}


export const routePermissions: { [key: string]: string } = {

}

export function getJWTSecret() {
    //read from the jwt file in the settings location
    const jwtSecret = fs.readFileSync(path.join(constants.settings_location, 'jwt.key'), { encoding: 'utf8' });
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwtSecret;
}

