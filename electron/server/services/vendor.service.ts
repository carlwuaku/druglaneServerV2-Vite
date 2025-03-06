import { Vendors } from "../models/Vendors";
import { Activities } from '../models/Activities';
import { logger } from '../config/logger'
import { Includeable, Op, Transaction, WhereOptions } from 'sequelize';
import { parseSearchQuery } from '../helpers/searchHelper';
import { sequelize } from '../config/sequelize-config';
import { setDates } from '../helpers/dateHelper';
import * as crypto from 'crypto'
import { OutgoingPayments } from "../models/OutgoingPayments";
import { PurchaseDetails } from "../models/PurchaseDetails";

const module_name = "vendors";

export async function _getList(_data: Record<string, any>) {
    try {
        let limit = _data.limit ? parseInt(_data.limit) : 100;
        let offset = _data.offset ? parseInt(_data.offset) : 0;

        let objects = await Vendors.findAll({
            limit,
            offset,
            order: [['name', 'ASC']]
        });

        // Calculate totals for each vendor
        for (let vendor of objects) {
            const total_paid = await OutgoingPayments.sum('amount', {
                where: {
                    vendor: vendor.id,
                    date: {
                        [Op.lte]: new Date()
                    }
                }
            }) || 0;

            const total_bought = await PurchaseDetails.sum('price * quantity', {
                where: {
                    vendor: vendor.id
                }
            }) || 0;

            const balance = total_bought - total_paid;
            vendor.setDataValue('total_paid', total_paid.toLocaleString());
            vendor.setDataValue('total_bought', total_bought.toLocaleString());
            vendor.setDataValue('balance', balance.toLocaleString());
        }

        return objects;
    } catch (error: any) {
        logger.error({ message: error });
        throw error;
    }
};

export async function _search(_data: Record<string, any>) {
    try {
        let param = _data.param;
        let where: WhereOptions = {
            [Op.or]: [
                { name: { [Op.like]: `%${param}%` } },
                { phone: { [Op.like]: `%${param}%` } },
                { email: { [Op.like]: `%${param}%` } }
            ]
        };

        let objects = await Vendors.findAll({
            where
        });

        // Calculate totals for each vendor
        for (let vendor of objects) {
            const total_paid = await OutgoingPayments.sum('amount', {
                where: {
                    vendor: vendor.id,
                    date: {
                        [Op.lte]: new Date()
                    }
                }
            }) || 0;

            const total_bought = await PurchaseDetails.sum('price * quantity', {
                where: {
                    vendor: vendor.id
                }
            }) || 0;

            const balance = total_bought - total_paid;
            vendor.setDataValue('total_paid', total_paid.toLocaleString());
            vendor.setDataValue('total_bought', total_bought.toLocaleString());
            vendor.setDataValue('balance', balance.toLocaleString());
        }

        return objects;
    } catch (error: any) {
        logger.error({ message: error });
        throw error;
    }
};

export async function _save(_data: Record<string, any>) {
    try {
        let activity = "";
        const result = await sequelize.transaction(async (t: Transaction) => {
            let id = _data.id;
            

            if (!id) {
                // Create new vendor
                const vendor = await Vendors.create(_data, { transaction: t });
                activity = `added a new vendor: ${_data.name}`;
                return vendor.id;
            } else {
                // Update existing vendor
                await Vendors.update(_data, {
                    where: { id },
                    transaction: t
                });
                activity = `updated vendor: ${_data.name}`;
                return id;
            }
        });

        // Log activity after transaction
        await Activities.create({
            activity,
            user_id: `${_data.userid}`,
            module: module_name
        });

        return result;
    } catch (error: any) {
        logger.error({ message: error });
        throw error;
    }
};

export async function _delete(_data: Record<string, any>) {
    try {
        const result = await sequelize.transaction(async (t: Transaction) => {
            await Vendors.destroy({
                where: { id: _data.id },
                transaction: t
            });
        });

        await Activities.create({
            activity: `deleted vendor: ${_data.name}`,
            user_id: `${_data.userid}`,
            module: module_name
        });

        return result;
    } catch (error: any) {
        logger.error({ message: error });
        throw error;
    }
};

export async function _findById(_data: Record<string, any>) {
    try {
        let object = await Vendors.findOne({
            where: { id: _data.id }
        });

        if (!object) {
            throw `Vendor not found: ${_data.id}`;
        }

        const total_paid = await OutgoingPayments.sum('amount', {
            where: {
                vendor: object.id,
                date: {
                    [Op.lte]: new Date()
                }
            }
        }) || 0;

        const total_bought = await PurchaseDetails.sum('price * quantity', {
            where: {
                vendor: object.id
            }
        }) || 0;

        const balance = total_bought - total_paid;
        object.setDataValue('total_paid', total_paid.toLocaleString());
        object.setDataValue('total_bought', total_bought.toLocaleString());
        object.setDataValue('balance', balance.toLocaleString());

        return object;
    } catch (error: any) {
        logger.error({ message: error });
        throw error;
    }
};

