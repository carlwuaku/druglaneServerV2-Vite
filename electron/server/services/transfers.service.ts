import { Transfers } from "../models/Transfers";
import { Activities } from '../models/Activities';
import { logger } from '../config/logger'
import { Includeable, Op, Transaction, WhereOptions } from 'sequelize';
import { parseSearchQuery } from '../helpers/searchHelper';
import { sequelize } from '../config/sequelize-config';
import { setDates } from '../helpers/dateHelper';
import { TransferDetails } from '../models/TransferDetails';
import { Users } from "../models/Users";
import { refreshCurrentStock, updateStockValue } from "../helpers/productsHelper";
import { Products } from "../models/Products";
import * as crypto from 'crypto'
import { Branches } from "@server/models/Branches";
import { ReceivedTransferDetails } from "@server/models/ReceivedTransferDetails";
import { ReceivedTransfers } from "@server/models/ReceivedTransfers";
const module_name = "transfers";


export async function _getList  (_data:Record<string, any>) {
    // let offset = _data.offset == undefined ? 0 : _data.offset;
    // let limit = _data.limit == undefined ? null : _data.limit;
    // try {
    //     let objects = await helper.getAll(helper.table_name, limit, offset);
    //     for (var i = 0; i < objects.length; i++) {
    //         var obj = objects[i];
    //         obj.total_amount = await detailsHelper.getReceiptTotal(obj.code)
    //         obj.num_of_items = await detailsHelper.getNumItems(obj.code)

    //         obj.display_name = adminHelper.getUserName(obj.created_by);

    //     }

    //     return { status: '1', data: objects }
    // } catch (error) {
    //     if (constants.isSqliteError(error)) await helper.closeConnection();
    //     log.error(error)
    //     throw error;
    // }

    try {

        let limit = _data.limit ? parseInt(_data.limit) : 100;
        let offset = _data.offset ? parseInt(_data.offset) : 0;
        //
        //if user specifies a search query
        let where: WhereOptions = {};
        let transferDetailsWhere: WhereOptions = {};
        if (_data.param) {
            let searchQuery = JSON.parse(_data.param)
            where = parseSearchQuery(searchQuery)
        }
        //if the user specifies a product, search the products table
        if (_data.product) {
            let poductSearchQuery = [{ field: 'name', operator: 'includes', param: _data.product }];// JSON.parse(_data.product)
            let Products_where = parseSearchQuery(poductSearchQuery)
            let products = await Products.findAll({
                where: Products_where
            });
            let product_ids: number[] = products.reduce(function (accumulator: number[], curr: Products) {
                return accumulator.concat(curr.id);
            }, []);
            transferDetailsWhere['product'] = { [Op.in]: product_ids }
        }
        let objects = await Transfers.findAll({
            attributes: {
                include: [
                    [sequelize.literal(`(select count(id) from transfer_details where code = transfers.code)`), 'num_items'],
                    [sequelize.literal(`(select sum(price * quantity) from transfer_details where code = transfers.code)`), 'total_amount'],
                ]
            },
            limit,
            offset,
            where,
            include: [{
                model: Branches,
                attributes: ['name', 'id']
            },
            {
                model: Users,
                attributes: ['display_name']
            },
            {
                model: TransferDetails,
                attributes: [],
                where: transferDetailsWhere
            }
            ],
            logging(sql, timing?) {
                console.log(sql, timing)
            },
        });



        return objects;
    } catch (error: any) {

        logger.error({ message: error })
        throw new Error(error);
    }

};



export async function _saveBulk(_data: Record<string, any>) {
   

    try {
        //the data should come with the transfer data and
        //the details data
        let items: any[] = _data.items;//json
        const receiver_id = _data.receiver;
        const receiver = await Branches.findOne({
            where: {
                id: receiver_id
            }
        });
        if(!receiver) throw "Receiver not found"
        //if no code was given, generate one and create. else
        //delete that code and re-insert
        let code = _data.code;
        let activity = "";
        let old_details: TransferDetails[] = [];

        const result = await sequelize.transaction(async (t: Transaction) => {
            if (code) {
                //get the previously saved items
                old_details = await TransferDetails.findAll({
                    where: { code: code }
                });
                TransferDetails.destroy({
                    force: true,
                    transaction: t,
                    where: {
                        code: code
                    }
                });

                Transfers.destroy({
                    force: true,
                    transaction: t,
                    where: {
                        code: code
                    }
                });


                activity = `updated transfer item with code ${code}`
            }
            else {
                //generate code
                // let last_id: number = await Purchases.max('id');
                code = crypto.randomUUID();// `${(last_id + 1).toString().padStart(5, '0')}`;
                activity = ` added new transfer: ${code} : to ${receiver.name}`

            }
            _data.code = code;
            _data.created_by = _data.user_id
            await Transfers.create(_data, {
                transaction: t
            });
            items.map(item => {
                item.code = code;
                item.date = _data.date;
                item.created_by = _data.user_id;
            })

            await TransferDetails.bulkCreate(items,
                {
                    transaction: t
                });



            t.afterCommit(async () => {
                //to avoid repeating ops for duplicate products
                let done: any[] = [];
                let combined: any[] = items.concat(old_details)
                await Promise.all(combined.map(async (item) => {
                    if (!done.includes(item.product)) {
                        
                        await refreshCurrentStock(item.product);
                        //add to the done list
                        done.push(item.product);
                    }
                }))

                updateStockValue();
                Activities.create({
                    activity: activity,
                    user_id: `${_data.user_id}`,
                    module: module_name
                })
            });
            return code;
        })

        return result

    } catch (error: any) {
        logger.error({ message: error })
        throw new Error(error);
    }
};

export async function _getDetails(_data: Record<string, any>) {
    try {
        
        let where: WhereOptions = {};
        let transferWhere: WhereOptions = {};
        if (_data.param) {
            let searchQuery = _data.param //json expected
            where = parseSearchQuery(searchQuery)
        }
        if (_data.receiver) {
            transferWhere['receiver'] = _data.receiver
        }
        let objects = await TransferDetails.findAll({
            attributes: {
                include: [
                    [sequelize.literal(`'price' * 'quantity'`), 'total']
                ]
            },
            where: where,
            include: [{
                model: Products,
                attributes: [['name', 'product_name'], ['id', 'product_id']]
            },
            {
                model: Transfers,
                attributes: [],
                where: transferWhere
            }
            ],
        });
        return objects
    } catch (error: any) {
        logger.error({ message: error })
        throw error;
    }

};


export async function _getReceivedDetails(_data: Record<string, any>) {
    try {

        let where: WhereOptions = {};
        let transferWhere: WhereOptions = {};
        if (_data.param) {
            let searchQuery = _data.param //json expected
            where = parseSearchQuery(searchQuery)
        }
        if (_data.sender) {
            transferWhere['sender'] = _data.sender
        }
        let objects = await ReceivedTransferDetails.findAll({
            attributes: {
                include: [
                    [sequelize.literal(`'price' * 'quantity'`), 'total']
                ]
            },
            where: where,
            include: [{
                model: Products,
                attributes: [['name', 'product_name'], ['id', 'product_id']]
            },
            {
                model: ReceivedTransferDetails,
                attributes: [],
                where: transferWhere
            }
            ],
        });
        return objects
    } catch (error: any) {
        logger.error({ message: error })
        throw error;
    }


    // try {
    //     let code = _data.code


    //     let objects = await receivedDetailsHelper.getMany(` code = '${code}'  `, receivedDetailsHelper.table_name);
    //     for (var i = 0; i < objects.length; i++) {
    //         var obj = objects[i];

    //         let product = await productHelper.getItem(` id = ${obj.product} `, productHelper.table_name);
    //         // obj.product = product;
    //         obj.product_id = product.id;
    //         obj.product_name = product.name;
    //         obj.product = product;
    //     }

    //     let item = await receivedHelper.getItem(` code = '${code}'`, receivedHelper.table_name)
    //     let sender = await adminHelper.getItem(` id = ${item.sender}`, adminHelper.branches_table_name)
    //     let display_name = await adminHelper.getUserName(item.created_by)
    //     let total = await receivedDetailsHelper.getTotal(code)

    //     return {
    //         status: '1',
    //         sender_id: sender.id,
    //         sender_name: sender.name,
    //         sender_phone: sender.phone,
    //         invoice: item.invoice,
    //         cashier: display_name,
    //         created_on: item.created_on,
    //         total: total.toLocaleString(),
    //         data: objects
    //     }
    // } catch (error) {
    //     if (constants.isSqliteError(error)) await helper.closeConnection();
    //     log.error(error)
    //     throw error;
    // }

};

/**
 * use _getDetails instead
 *  
 */
// export async function _getDetailsByVendor  (_data) {
//     try {
//         let id = _data.id


//         let objects = await detailsHelper.getMany(`code in (select code from ${helper.table_name} where vendor = ${id})   `, detailsHelper.table_name);
//         for (var i = 0; i < objects.length; i++) {
//             var obj = objects[i];

//             let product = await productHelper.getItem(` id = ${obj.product} `, productHelper.table_name);
//             // obj.product = product;
//             obj.product_id = product.id;
//             obj.product_name = product.name;

//         }
//         return {
//             status: '1',

//             data: objects
//         }
//     } catch (error) {
//         if (constants.isSqliteError(error)) await helper.closeConnection();
//         log.error(error)
//         throw error;
//     }

// };



export async function _deleteItem(_data: Record<string, any>) {
    try {
        let codes: any[] = JSON.parse(_data.codes);
        //get all the items in the codes
        let items = await TransferDetails.findAll({
            where: {
                code: { [Op.in]: codes }
            }
        })
        const result = await sequelize.transaction(async (t: Transaction) => {

            await Transfers.destroy({
                where: {
                    code: { [Op.in]: codes }
                },
                transaction: t
            });

            await TransferDetails.destroy({
                where: {
                    code: { [Op.in]: codes }
                },
                transaction: t
            });
            t.afterCommit(async () => {
                //update stock value
                await Promise.all(items.map(async (item) => {
                    await refreshCurrentStock(item.product);
                }));

                updateStockValue();
                Activities.create({
                    activity: `temporarily deleted transfer invoices with codes ${_data.codes}`,
                    user_id: `${_data.user_id}`,
                    module: module_name
                })
            });
            return true;
        });
        return result;
    } catch (error: any) {
        logger.error({ message: error })
        throw error;
    }

    // try {
    //     await helper.getConnection();
    //     await helper.connection.exec("BEGIN TRANSACTION");
    //     let id = _data.id;//comma-separated
    //     let codes = _data.codes.split(",");//wrap in single quotes
    //     //CHECK THE
    //     const quotedItems = codes.map(item => `'${item}'`); // Surround each item with single quotes

    //     const resultString = quotedItems.join(', ');
    //     let invoices = _data.invoices;

    //     let products = []
    //     let product_query = await detailsHelper.getDistinct('product', detailsHelper.table_name, ` code in (${resultString})`);
    //     let details = "";
    //     product_query.map(async p => {
    //         try {
    //             let product_details = await productHelper.getItem(`id = ${p.product}`, productHelper.table_name)
    //             details += `${product_details.name} qtt: ${p.quantity}, price: ${p.price} |||`
    //         } catch (error) {
    //             console.log(error);
    //             throw error;
    //         }
    //         products.push(p.product);
    //     })
    //     await helper.delete(` id in (${id})`, helper.table_name);
    //     await helper.connection.exec("COMMIT");
    //     await activities.log(_data.userid, `"deleted transfers with invoices: ${codes}. details:${details} "`, "'Vendors'")

    //     for (var x = 0; x < products.length; x++) {

    //         let pid = products[x];
    //         await productHelper.refreshCurrentStock(pid)
    //     }
    //     await stockValueHelper.updateStockValue();


    //     return { status: '1', data: null }
    // } catch (error) {

    //     if (constants.isSqliteError(error)) {
    //         await helper.connection.exec("ROLLBACK");
    //         await helper.closeConnection();
    //     }
    //     //console.l.log(error)
    //     log.error(error)
    //     throw error;
    // }

};



export async function _deleteReceivedItem(_data: Record<string, any>) {
    try {
        let codes: any[] = JSON.parse(_data.codes);
        //get all the items in the codes
        let items = await ReceivedTransferDetails.findAll({
            where: {
                code: { [Op.in]: codes }
            }
        })
        const result = await sequelize.transaction(async (t: Transaction) => {

            await ReceivedTransfers.destroy({
                where: {
                    code: { [Op.in]: codes }
                },
                transaction: t
            });

            await ReceivedTransferDetails.destroy({
                where: {
                    code: { [Op.in]: codes }
                },
                transaction: t
            });
            t.afterCommit(async () => {
                //update stock value
                await Promise.all(items.map(async (item) => {
                    await refreshCurrentStock(item.product);
                }));

                updateStockValue();
                Activities.create({
                    activity: ` deleted received transfer invoices with codes ${_data.codes}`,
                    user_id: `${_data.user_id}`,
                    module: module_name
                })
            });
            return true;
        });
        return result;
    } catch (error: any) {
        logger.error({ message: error })
        throw error;
    }
    // try {
    //     await helper.getConnection();
    //     await helper.connection.exec("BEGIN TRANSACTION");
    //     let id = _data.id;//comma-separated
    //     let codes = _data.codes;
    //     let invoices = _data.invoices;

    //     let products = []
    //     let product_query = await receivedDetailsHelper.getMany(` code in (${codes})`,
    //         receivedDetailsHelper.table_name, null, 0, "", "", `products on products.id = ${receivedDetailsHelper.table_name}.product`);



    //     await receivedHelper.delete(` id in (${id})`, receivedHelper.table_name);
    //     await helper.connection.exec("COMMIT");
    //     await activities.log(_data.userid, `"deleted received transfers with invoices: ${invoices}."`, "'Transfers'")

    //     product_query.map(async p => {
    //         try {
    //             await productHelper.refreshCurrentStock(p.product);
    //             await activities.log(_data.userid, `"deleted product ${p.name} qtt: ${p.quantity}, price: ${p.price} from received transfers with invoices: ${invoices}. "`, "'Transfers'")
    //         } catch (error) {
    //             log.error(error);
    //         }

    //     })


    //     await stockValueHelper.updateStockValue();


    //     return { status: '1', data: null }
    // } catch (error) {
    //     await helper.connection.exec("ROLLBACK");
    //     if (constants.isSqliteError(error)) await helper.closeConnection();
    //     //console.l.log(error)
    //     log.error(error)
    //     throw error;
    // }

};

export async function _findById(_data:Record<string, any>) {
    try {
        let object = await Transfers.findOne({
            attributes: {
                include: [
                    [sequelize.literal(`(select count(id) from transfer_details where code = '${_data.id}')`), 'num_items'],
                    [sequelize.literal(`(select sum(price * quantity) from transfer_details where code = '${_data.id}')`), 'total_amount'],
                ]
            },
            where: {
                [Op.or]: [
                    { id: _data.id },
                    { code: _data.id }
                ]
            },
            include: [{
                model: Branches,
                attributes: ['name', 'id']
            },
            {
                model: Users,
                attributes: ['display_name']
            }]
        });
        if (!object) {
            throw `Transfer not found: ${_data.id}`;

        }
        return object;
    } catch (error: any) {
        logger.error({ message: error })
        throw error;
    }
    // try {
    //     let id = _data.id;

    //     let object = await helper.getItem(`id = ${id} `, helper.table_name);



    //     return {
    //         status: '1',
    //         data: object
    //     }
    // } catch (error) {
    //     if (constants.isSqliteError(error)) await helper.closeConnection();
    //     log.error(error)
    //     throw error;
    // }

};


export async function _findBetweenDates(_data: Record<string, any>) {
    try {
        let start = _data.start_date ? _data.start_date : new Date();
        let end = _data.end_date ? _data.end_date : new Date();

        let where: WhereOptions = {
            date: {
                [Op.between]: [start, end]
            }
        };

        let objects = await TransferDetails.findAll({
            attributes: {
                include: [
                    [sequelize.literal(`'price' * 'quantity'`), 'total']
                ]
            },
            where: where,
            include: [{
                model: Products,
                attributes: [['name', 'product_name'], ['id', 'product_id']]
            }]
        });

        return objects;
    } catch (error: any) {
        logger.error({ message: error });
        throw error;
    }
};

export async function _findReceiptsBetweenDates(_data: Record<string, any>) {
    try {
        let start = _data.start_date ? _data.start_date : new Date();
        let end = _data.end_date ? _data.end_date : new Date();
        let code = _data.code;

        let where: WhereOptions = {};
        if (code) {
            where = {
                code: code
            };
        } else {
            where = {
                date: {
                    [Op.between]: [start, end]
                }
            };
        }

        let objects = await ReceivedTransfers.findAll({
            attributes: {
                include: [
                    [sequelize.literal(`(select count(id) from received_transfer_details where code = received_transfers.code)`), 'num_of_items'],
                    [sequelize.literal(`(select sum(price * quantity) from received_transfer_details where code = received_transfers.code)`), 'total_amount'],
                ]
            },
            where: where,
            include: [{
                model: Branches,
                as: 'sender',
                attributes: ['name', 'id']
            },
            {
                model: Users,
                attributes: ['display_name']
            }]
        });

        // Transform the results to match the expected format
        objects = objects.map(obj => {
            const plainObj = obj.get({ plain: true });
            return {
                ...plainObj,
                sender_name: plainObj.sender?.name || 'n/a',
                sender_id: plainObj.sender?.id || 0
            };
        });

        return objects;
    } catch (error: any) {
        logger.error({ message: error });
        throw error;
    }
};


export async function _findSentReceiptsBetweenDates(_data: Record<string, any>) {
    try {
        let start = _data.start_date ? _data.start_date : new Date();
        let end = _data.end_date ? _data.end_date : new Date();
        let code = _data.code;

        let where: WhereOptions = {};
        if (code) {
            where = {
                code: code
            };
        } else {
            where = {
                date: {
                    [Op.between]: [start, end]
                }
            };
        }

        let objects = await Transfers.findAll({
            attributes: {
                include: [
                    [sequelize.literal(`(select count(id) from transfer_details where code = transfers.code)`), 'num_of_items'],
                    [sequelize.literal(`(select sum(price * quantity) from transfer_details where code = transfers.code)`), 'total_amount'],
                ]
            },
            where: where,
            include: [{
                model: Branches,
                as: 'receiver',
                attributes: ['name', 'id']
            },
            {
                model: Users,
                attributes: ['display_name']
            }]
        });

        // Transform the results to match the expected format
        objects = objects.map(obj => {
            const plainObj = obj.get({ plain: true });
            return {
                ...plainObj,
                recipient_name: plainObj.receiver?.name || 'n/a',
                recipient_id: plainObj.receiver?.id || 0
            };
        });

        return objects;
    } catch (error: any) {
        logger.error({ message: error });
        throw error;
    }
};


export async function _findReceiptsByBranch(_data: Record<string, any>) {
    try {
        let branch = _data.branch;

        let objects = await Transfers.findAll({
            attributes: {
                include: [
                    [sequelize.literal(`(select count(id) from transfer_details where code = transfers.code)`), 'num_of_items'],
                    [sequelize.literal(`(select sum(price * quantity) from transfer_details where code = transfers.code)`), 'total_amount'],
                ]
            },
            where: {
                sender: branch
            },
            include: [{
                model: Branches,
                as: 'sender',
                attributes: ['name', 'id']
            },
            {
                model: Users,
                attributes: ['display_name']
            }]
        });

        // Transform the results to match the expected format
        objects = objects.map(obj => {
            const plainObj = obj.get({ plain: true });
            return {
                ...plainObj,
                sender_name: plainObj.sender?.name || 'n/a',
                sender_id: plainObj.sender?.id || 0
            };
        });

        return objects;
    } catch (error: any) {
        logger.error({ message: error });
        throw error;
    }
};


export async function _findReceiptsByReceivingBranch(_data: Record<string, any>) {
    try {
        let branch = _data.branch;

        let objects = await Transfers.findAll({
            attributes: {
                include: [
                    [sequelize.literal(`(select count(id) from transfer_details where code = transfers.code)`), 'num_of_items'],
                    [sequelize.literal(`(select sum(price * quantity) from transfer_details where code = transfers.code)`), 'total_amount'],
                ]
            },
            where: {
                receiver: branch
            },
            include: [{
                model: Branches,
                as: 'receiver',
                attributes: ['name', 'id']
            },
            {
                model: Users,
                attributes: ['display_name']
            }]
        });

        // Transform the results to match the expected format
        objects = objects.map(obj => {
            const plainObj = obj.get({ plain: true });
            return {
                ...plainObj,
                recipient_name: plainObj.receiver?.name || 'n/a',
                recipient_id: plainObj.receiver?.id || 0
            };
        });

        return objects;
    } catch (error: any) {
        logger.error({ message: error });
        throw error;
    }
};


export async function _saveBulkReceive(_data: Record<string, any>) {
    try {
        let date = _data.date ? _data.date : new Date();
        let created_on = _data.created_on ? _data.created_on : new Date();
        let sender = _data.sender;

        let products = _data.products.split("||");
        let prices = _data.prices.split("||");
        let quantities = _data.quantities.split("||");
        let cost_prices = _data.cost_prices.split("||");
        let expiries = _data.expiries.split("||");

        const result = await sequelize.transaction(async (t: Transaction) => {
            // Generate a unique code
            const code = crypto.randomUUID();

            // Create the received transfer record
            const receivedTransfer = await ReceivedTransfers.create({
                date,
                created_on,
                created_by: _data.userid,
                code,
                sender
            }, { transaction: t });

            // Create transfer details records
            const transferDetails = [];
            for (let i = 0; i < products.length; i++) {
                transferDetails.push({
                    created_on,
                    date,
                    product: products[i],
                    price: prices[i],
                    quantity: quantities[i],
                    cost_price: cost_prices[i],
                    expiry: expiries[i],
                    code,
                    created_by: _data.userid
                });
            }

            await ReceivedTransferDetails.bulkCreate(transferDetails, { transaction: t });

            // Update product records
            for (let i = 0; i < products.length; i++) {
                await Products.update({
                    price: prices[i],
                    cost_price: cost_prices[i],
                    expiry: expiries[i]
                }, {
                    where: { id: products[i] },
                    transaction: t
                });
            }

            t.afterCommit(async () => {
                // Refresh stock for all products
                await Promise.all(products.map(async (pid:number) => {
                    await refreshCurrentStock(pid);
                }));

                updateStockValue();
                await Activities.create({
                    activity: `received transfers: ${code}`,
                    user_id: `${_data.userid}`,
                    module: module_name
                });
            });

            return code;
        });

        return result;
    } catch (error: any) {
        logger.error({ message: error });
        throw error;
    }
};
