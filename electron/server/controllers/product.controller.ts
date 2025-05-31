import express, { Router, Response, Request } from 'express';
import * as service from '../services/product.service';
import { logger } from '../config/logger';

// Define interfaces for request parameters
interface StockAdjustmentParams {
    date: string;
    created_on: string;
    user_id: any;
}

interface StockQueryParams {
    code: string;
    product: string;
}

interface ProductQueryParams {
    product: number;
}

interface UploadRequest extends Request {
    files?: {
        uploadfile: {
            data: Buffer;
        };
    };
}

const router: Router = express.Router();

router.get('/getList', async (req: Request, res: Response) => {
    try {
        const data = await service._getList(req.query);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getProductsWithStock', async (req: Request, res: Response) => {
    try {
        const data = await service._getList({ ...req.query, mode: 'with_stock' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getUpdatedProducts', async (req: Request, res: Response) => {
    try {
        const data = await service._getList({ ...req.query, mode: 'updated' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/search', async (req: Request, res: Response) => {
    try {
        const data = await service._getList({ ...req.query, param: req.query.param });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getRelatedProducts', async (req: Request, res: Response) => {
    try {
        const data = await service._getList({ ...req.query, mode: 'related' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getProductBatches', async (req: Request, res: Response) => {
    try {
        const data = await service._getList({ ...req.query, mode: 'batches' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/saveBranchDetails', async (req: Request, res: Response) => {
    try {
        const data = await service.save(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/massEdit', async (req: Request, res: Response) => {
    try {
        const data = await service.mass_edit(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/delete', async (req: Request, res: Response) => {
    try {
        const data = await service.delete_product(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/erase', async (req: Request, res: Response) => {
    try {
        const data = await service.delete_product({ ...req.body, permanent: true });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/softDelete', async (req: Request, res: Response) => {
    try {
        const data = await service.delete_product(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/restore', async (req: Request, res: Response) => {
    try {
        const data = await service.restore_deleted_product(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/findById', async (req: Request, res: Response) => {
    try {
        const data = await service.find(req.query);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getStock', async (req: Request, res: Response) => {
    try {
        const query = {
            product: Number(req.query.product) || 0
        };
        const data = await service.get_stock(query);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getActiveIngredients', async (req: Request, res: Response) => {
    try {
        const data = await service.get_distinct_field_values({ field: 'active_ingredients' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: [] });
    }
});

router.get('/getCategoryCounts', async (req: Request, res: Response) => {
    try {
        const data = await service.get_distinct_field_values({ field: 'category' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/createStockAdjustmentSession', async (req: Request<{}, {}, {}, StockAdjustmentParams>, res: Response) => {
    try {
        const data = await service.create_stock_adjustment_session(req.query);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/closeStockAdjustmentSession', async (req: Request, res: Response) => {
    try {
        const data = await service.close_stock_adjustment_session(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getLatestSession', async (req: Request<{}, {}, {}, StockAdjustmentParams>, res: Response) => {
    try {
        const data = await service.get_latest_session(req.query);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/saveStockAdjustment', async (req: Request, res: Response) => {
    try {
        const data = await service.save_stock_adjustment(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/saveStockAdjustmentToPending', async (req: Request, res: Response) => {
    try {
        const data = await service.save_stock_adjustment_to_pending(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/saveSingleStockAdjustment', async (req: Request, res: Response) => {
    try {
        const data = await service.save_single_stock_adjustment(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/savePendingSingleStockAdjustment', async (req: Request, res: Response) => {
    try {
        const data = await service.save_pending_single_stock_adjustment(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getPendingStockQuantity', async (req: Request<{}, {}, {}, StockQueryParams>, res: Response) => {
    try {
        const data = await service.get_pending_stock_quantity(req.query);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getStockAdjustmentSessions', async (req: Request, res: Response) => {
    try {
        const data = await service.get_stock_adjustment_sessions(req.query);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getPendingStockAdjustmentSessions', async (req: Request, res: Response) => {
    try {
        const data = await service.get_stock_adjustment_sessions({ ...req.query, status: 'pending' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getStockAdjustmentsBetweenDates', async (req: Request, res: Response) => {
    try {
        const data = await service.get_stock_adjustments(req.query);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getStockAdjustmentsByCode', async (req: Request, res: Response) => {
    try {
        const data = await service.get_stock_adjustments({ ...req.query, code: req.query.code });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getPendingStockAdjustmentsByCode', async (req: Request, res: Response) => {
    try {
        const data = await service.get_pending_stock_adjustments_by_code(req.query);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getStockOutCount', async (req: Request, res: Response) => {
    try {
        const data = await service._getCount({ ...req.query, mode: 'stock_out' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/hasStockOut', async (req: Request, res: Response) => {
    try {
        const data = await service._getCount({ ...req.query, mode: 'stock_out' });
        res.status(200).json({ status: '1', data: Number(data) > 0 });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getStockOutList', async (req: Request, res: Response) => {
    try {
        const data = await service._getList({ ...req.query, mode: 'stock_out' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getStockNearMinCount', async (req: Request, res: Response) => {
    try {
        const data = await service._getCount({ ...req.query, mode: 'stock_near_min' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/hasStockNearMin', async (req: Request, res: Response) => {
    try {
        const data = await service._getCount({ ...req.query, mode: 'stock_near_min' });
        res.status(200).json({ status: '1', data: Number(data) > 0 });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getStockNearMinList', async (req: Request, res: Response) => {
    try {
        const data = await service._getList({ ...req.query, mode: 'stock_near_min' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getStockNearMaxCount', async (req: Request, res: Response) => {
    try {
        const data = await service._getCount({ ...req.query, mode: 'stock_near_max' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/hasStockNearMax', async (req: Request, res: Response) => {
    try {
        const data = await service._getCount({ ...req.query, mode: 'stock_near_max' });
        res.status(200).json({ status: '1', data: Number(data) > 0 });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getStockNearMaxList', async (req: Request, res: Response) => {
    try {
        const data = await service._getList({ ...req.query, mode: 'stock_near_max' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getStockChanges', async (req: Request, res: Response) => {
    try {
        if (!req.query['product']) {
            res.status(500).json({ status: '-1', data: null });
            return;
        }
        const data = await service.get_stock_changes({ product: parseInt(req.query['product'] as string) });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getExpiryCount', async (req: Request, res: Response) => {
    try {
        const data = await service._getCount({ ...req.query, mode: 'expiry' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/hasExpiry', async (req: Request, res: Response) => {
    try {
        const data = await service._getCount({ ...req.query, mode: 'expiry' });
        res.status(200).json({ status: '1', data: Number(data) > 0 });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getExpiryList', async (req: Request, res: Response) => {
    try {
        const data = await service._getList({ ...req.query, mode: 'expiry' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getStockValueList', async (req: Request, res: Response) => {
    try {
        const data = await service._getList({ ...req.query, mode: 'stock_value' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getExpiredCount', async (req: Request, res: Response) => {
    try {
        const data = await service._getCount({ ...req.query, mode: 'expired' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/hasExpired', async (req: Request, res: Response) => {
    try {
        const data = await service._getCount({ ...req.query, mode: 'expired' });
        res.status(200).json({ status: '1', data: Number(data) > 0 });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getExpiredList', async (req: Request, res: Response) => {
    try {
        const data = await service._getList({ ...req.query, mode: 'expired' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getCategories', async (req: Request, res: Response) => {
    try {
        const data = await service.get_distinct_field_values({ field: 'category' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getFunctionalGroups', async (req: Request, res: Response) => {
    try {
        const data = await service.get_distinct_field_values({ field: 'functional_group' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getStockValues', async (req: Request, res: Response) => {
    try {
        const data = await service._getList({ ...req.query, mode: 'stock_values' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/refreshAllProducts', async (req: Request, res: Response) => {
    try {
        const data = await service.refresh_current_stock({ id: 'all' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/merge', async (req: Request, res: Response) => {
    try {
        const data = await service.save(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/upload', async (req: UploadRequest, res: Response) => {
    try {
        const file = req.files?.uploadfile;
        if (!file) {
            return res.status(400).json({ status: '-1', message: 'No file uploaded' });
        }

        const xlsx = require('xlsx');
        const workbook = xlsx.read(file.data);
        const sheet_name_list = workbook.SheetNames;
        const arr = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        const mother_array = [];
        for (let i = 0; i < Math.min(arr.length, 1000); i++) {
            const obj_array = arr[i];
            if (obj_array.name && typeof obj_array.name === "string" && obj_array.name.trim()) {
                const expiry = obj_array.expiry ?
                    new Date(Date.parse(obj_array.expiry)).toISOString().split('T')[0] :
                    "1970-01-01";

                mother_array.push({
                    id: obj_array.id,
                    name: obj_array.name,
                    price: obj_array.price || 0,
                    cost_price: obj_array.cost_price || 0,
                    category: obj_array.category || "Miscellaneous",
                    expiry,
                    quantity: obj_array.quantity || 0,
                    shelf: obj_array.shelf || "",
                    unit: obj_array.unit || "",
                    markup: obj_array.markup || 1.33,
                    functional_group: obj_array.description || "",
                    barcode: obj_array.barcode || "",
                    min_stock: obj_array.min_stock || 0,
                    max_stock: obj_array.max_stock || 0
                });
            }
        }

        res.status(200).json({ status: '1', data: mother_array });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/searchActiveIngredients', async (req: Request, res: Response) => {
    try {
        const data = await service.get_distinct_field_values({ field: 'active_ingredients' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/addItemActiveIngredient', async (req: Request, res: Response) => {
    try {
        const data = await service.save(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getChangedStock', async (req: Request, res: Response) => {
    try {
        if (!req.query['code']) {
            return res.status(400).json({ status: '-1', message: 'Code parameter is required' });
        }
        const data = await service.get_changed_stock({ code: req.query['code'] as string });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/saveStockAdjustmentUpdatedQuantities', async (req: Request, res: Response) => {
    try {
        const data = await service.save_stock_adjustment(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getProductConsumption', async (req: Request, res: Response) => {
    try {
        const query = {
            product: Number(req.query.product) || 0
        };
        const data = await service.get_stock_changes(query);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getDuplicateCount', async (req: Request, res: Response) => {
    try {
        const data = await service._getCount({ ...req.query, mode: 'duplicates' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/getDuplicateList', async (req: Request, res: Response) => {
    try {
        const data = await service._getList({ ...req.query, mode: 'duplicates' });
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/mergeDuplicates', async (req: Request, res: Response) => {
    try {
        const data = await service.save(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/refreshCurrentStock', async (req: Request, res: Response) => {
    try {
        const data = await service.refresh_current_stock(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.get('/mismatch', async (req: Request, res: Response) => {
    try {
        const query = {
            code: req.query.code as string || 'mismatch'
        };
        const data = await service.get_changed_stock(query);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/setUncountedToZero', async (req: Request, res: Response) => {
    try {
        const data = await service.save_stock_adjustment_to_pending(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

router.post('/saveBulkProducts', async (req: Request, res: Response) => {
    try {
        const data = await service.save(req.body);
        res.status(200).json({ status: '1', data });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ status: '-1', data: null });
    }
});

export default router;