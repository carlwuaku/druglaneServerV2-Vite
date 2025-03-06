import { Vendors } from "../../models/Vendors";
import { Activities } from '../../models/Activities';
import { OutgoingPayments } from "../../models/OutgoingPayments";
import { PurchaseDetails } from "../../models/PurchaseDetails";
import { sequelize } from '../../config/sequelize-config';
import { _getList, _search, _save, _delete, _findById } from '../vendor.service';
import { Op } from 'sequelize';

// Mock all the models
jest.mock('../../models/Vendors');
jest.mock('../../models/Activities');
jest.mock('../../models/OutgoingPayments');
jest.mock('../../models/PurchaseDetails');
jest.mock('../../config/sequelize-config');

describe('Vendor Service', () => {
    let mockTransaction: any;
    let mockVendor: any;
    let mockVendors: any[];

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Setup mock transaction
        mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn()
        };

        // Setup mock vendor
        mockVendor = {
            id: 1,
            name: 'Test Vendor',
            phone: '1234567890',
            email: 'test@vendor.com',
            setDataValue: jest.fn()
        };

        // Setup mock vendors array
        mockVendors = [mockVendor];

        // Mock sequelize transaction
        (sequelize.transaction as jest.Mock).mockImplementation((callback) => {
            return callback(mockTransaction);
        });

        // Mock Vendors model methods
        (Vendors.findAll as jest.Mock).mockResolvedValue(mockVendors);
        (Vendors.findOne as jest.Mock).mockResolvedValue(mockVendor);
        (Vendors.create as jest.Mock).mockResolvedValue(mockVendor);
        (Vendors.update as jest.Mock).mockResolvedValue([1]);
        (Vendors.destroy as jest.Mock).mockResolvedValue(1);

        // Mock Activities model
        (Activities.create as jest.Mock).mockResolvedValue({});

        // Mock OutgoingPayments model
        (OutgoingPayments.sum as jest.Mock).mockResolvedValue(100);

        // Mock PurchaseDetails model
        (PurchaseDetails.sum as jest.Mock).mockResolvedValue(200);
    });

    describe('_getList', () => {
        it('should return list of vendors with calculated totals', async () => {
            const result = await _getList({ limit: 10, offset: 0 });

            expect(Vendors.findAll).toHaveBeenCalledWith({
                limit: 10,
                offset: 0,
                order: [['name', 'ASC']]
            });

            expect(OutgoingPayments.sum).toHaveBeenCalledWith('amount', {
                where: {
                    vendor: mockVendor.id,
                    date: {
                        [Op.lte]: expect.any(Date)
                    }
                }
            });

            expect(PurchaseDetails.sum).toHaveBeenCalledWith('price * quantity', {
                where: {
                    vendor: mockVendor.id
                }
            });

            expect(result).toEqual(mockVendors);
        });
    });

    describe('_search', () => {
        it('should search vendors by name, phone, or email', async () => {
            const searchParam = 'test';
            const result = await _search({ param: searchParam });

            expect(Vendors.findAll).toHaveBeenCalledWith({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${searchParam}%` } },
                        { phone: { [Op.like]: `%${searchParam}%` } },
                        { email: { [Op.like]: `%${searchParam}%` } }
                    ]
                }
            });

            expect(result).toEqual(mockVendors);
        });
    });

    describe('_save', () => {
        it('should create a new vendor', async () => {
            const vendorData = {
                name: 'New Vendor',
                phone: '1234567890',
                email: 'new@vendor.com',
                userid: 1
            };

            const result = await _save(vendorData);

            expect(sequelize.transaction).toHaveBeenCalled();
            expect(Vendors.create).toHaveBeenCalledWith(vendorData, { transaction: mockTransaction });
            expect(Activities.create).toHaveBeenCalledWith({
                activity: `added a new vendor: ${vendorData.name}`,
                user_id: '1',
                module: 'vendors'
            });

            expect(result).toBe(mockVendor.id);
        });

        it('should update an existing vendor', async () => {
            const vendorData = {
                id: 1,
                name: 'Updated Vendor',
                phone: '1234567890',
                email: 'updated@vendor.com',
                userid: 1
            };

            const result = await _save(vendorData);

            expect(sequelize.transaction).toHaveBeenCalled();
            expect(Vendors.update).toHaveBeenCalledWith(vendorData, {
                where: { id: vendorData.id },
                transaction: mockTransaction
            });
            expect(Activities.create).toHaveBeenCalledWith({
                activity: `updated vendor: ${vendorData.name}`,
                user_id: '1',
                module: 'vendors'
            });

            expect(result).toBe(vendorData.id);
        });
    });

    describe('_delete', () => {
        it('should delete a vendor and log the activity', async () => {
            const deleteData = {
                id: 1,
                name: 'Test Vendor',
                userid: 1
            };

            const result = await _delete(deleteData);

            expect(sequelize.transaction).toHaveBeenCalled();
            expect(Vendors.destroy).toHaveBeenCalledWith({
                where: { id: deleteData.id },
                transaction: mockTransaction
            });
            expect(Activities.create).toHaveBeenCalledWith({
                activity: `deleted vendor: ${deleteData.name}`,
                user_id: '1',
                module: 'vendors'
            });

            expect(result).toBe(1);
        });
    });

    describe('_findById', () => {
        it('should find a vendor by id and calculate totals', async () => {
            const result = await _findById({ id: 1 });

            expect(Vendors.findOne).toHaveBeenCalledWith({
                where: { id: 1 }
            });

            expect(OutgoingPayments.sum).toHaveBeenCalledWith('amount', {
                where: {
                    vendor: mockVendor.id,
                    date: {
                        [Op.lte]: expect.any(Date)
                    }
                }
            });

            expect(PurchaseDetails.sum).toHaveBeenCalledWith('price * quantity', {
                where: {
                    vendor: mockVendor.id
                }
            });

            expect(result).toEqual(mockVendor);
        });

        it('should throw error if vendor not found', async () => {
            (Vendors.findOne as jest.Mock).mockResolvedValue(null);

            await expect(_findById({ id: 999 })).rejects.toThrow('Vendor not found: 999');
        });
    });
}); 