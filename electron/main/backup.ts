import fs from "fs";
import { zip } from 'zip-a-folder';
import { constants } from '../utils/constants';
import { getToday } from '../utils/dateHelper';
import { logger } from "../../src/config/logger";
import path from "path";
import { appGlobals } from "./globals";
import { getData, uploadBackupFile } from "../utils/network";


/**
 * This function creates a local backup of the database and optionally uploads it to the cloud server.
 * @returns {Promise<{ localBackup: string, remoteBackup: string | null }>} A promise that resolves with an object containing the local and remote paths of the backup.
 * The localBackup property is always set. The remoteBackup property is set only if the upload to the cloud server is successful. If the upload fails, it is set to null.
 * If the function fails for any reason, it throws an error.
 */
export async function backupDatabase(): Promise<{ localBackup: string, remoteBackup: string | null }> {
    try {

        //create a temp folder
        //copy the db to the temp folder
        //zip the temp folder
        //delete the temp folder
        const ts = getToday('timestamp_string');
        //create a temp folder
        const internal_backup_folder = constants.internal_backups_path;
        const zipFilePath = path.join(internal_backup_folder, `${constants.appname}_backup_${ts}.zip`)

        const temp_backup_folder = constants.backup_temp_create_location;
        if (!fs.existsSync(internal_backup_folder)) {
            fs.mkdirSync(internal_backup_folder);
        }
        //check if the temp folder exists. if it does, delete it.
        if (fs.existsSync(temp_backup_folder)) {

            fs.rmdirSync(temp_backup_folder, { recursive: true });
        }
        //create the temp folder
        fs.mkdirSync(temp_backup_folder);
        //copy the db to the temp folder
        fs.copyFileSync(constants.db_path, path.join(temp_backup_folder, constants.db_filename));
        console.log('db copied to temp folder');
        //validate the file

        //copy to the documents folder as well
        fs.copyFileSync(path.join(temp_backup_folder, `${constants.db_filename}`), path.join(constants.backup_folder, `${constants.db_filename}`));
        console.log('db copied to home folder');
        //zip the temp folder
        await zip(temp_backup_folder, zipFilePath);
        console.log('localbackup successful');
        const result: { localBackup: string, remoteBackup: string | null } = {
            localBackup: zipFilePath,
            remoteBackup: null,
        }
        try {
            await uploadfiles(zipFilePath);
            result.remoteBackup = zipFilePath
        } catch (error) {
            result.remoteBackup = null
        }

        //clear the temp folder
        fs.rmdirSync(temp_backup_folder, { recursive: true });
        //delete all other backups for that day
        deleteOldBackupsForToday(internal_backup_folder);
        deleteOldBackupsForToday(constants.backup_folder);

        return result;

    } catch (error) {
        console.log(error)
        logger.error(error);
        throw new Error(`Error backing up database. Error: ${error}`);
    }
}

export async function uploadfiles(filepath: string) {
    try {
        if (!fs.existsSync(filepath)) {
            console.log('file not found for upload')
            throw new Error('File not found');
        }
        let settings = await getData<ISettings>({ url: `${appGlobals.serverUrl}/api_admin/settings` })


        const name = settings.data.company_name;
        if (!name) {
            throw new Error('Company name not found');
        }
        const email = settings.data.email;
        if (!email) {
            throw new Error('Email not found');
        }
        const phone = settings.data.phone;
        if (!phone) {
            throw new Error('Phone not found');
        }
        const company_id = settings.data.company_id;
        if (!company_id) {
            throw new Error('Company id not found');
        }



        //upload the file to the cloud server
        const response = await uploadBackupFile(filepath, name, email, phone, company_id);
        logger.info({ message: `uploading backup file to server. response received: ${JSON.stringify(response.data)}` })


    } catch (error) {
        logger.error({ message: `error in uploading backup file to server receiving : ${error}` })
        console.log(error)

        // res.redirect('restoreBackup?m=Server error. Please try again or contact your admin');

    }

}

interface BackupFile {
    filename: string;
    timestamp: Date;
    fullPath: string;
}

function deleteOldBackupsForToday(backupDirectory: string): void {
    try {
        // Get current date in YYYYMMDD format
        const today = new Date();
        const todayString = today.toISOString().slice(0, 10).replace(/-/g, '');

        // Read all files in the backup directory
        const files = fs.readdirSync(backupDirectory);

        // Filter files that match the backup pattern for today
        const todayBackups: BackupFile[] = files
            .filter(filename => {
                const match = filename.match(/^Druglane_backup_(\d{8})(\d{6})$/);
                return match && match[1] === todayString;
            })
            .map(filename => {
                const match = filename.match(/^Druglane_backup_(\d{8})(\d{6})$/)!;
                const dateStr = match[1]; // YYYYMMDD
                const timeStr = match[2]; // HHMMSS

                // Parse the timestamp
                const year = parseInt(dateStr.slice(0, 4));
                const month = parseInt(dateStr.slice(4, 6)) - 1; // Month is 0-indexed
                const day = parseInt(dateStr.slice(6, 8));
                const hour = parseInt(timeStr.slice(0, 2));
                const minute = parseInt(timeStr.slice(2, 4));
                const second = parseInt(timeStr.slice(4, 6));

                const timestamp = new Date(year, month, day, hour, minute, second);

                return {
                    filename,
                    timestamp,
                    fullPath: path.join(backupDirectory, filename)
                };
            });

        // Sort by timestamp (newest first)
        todayBackups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        // Delete all except the first one (latest)
        const filesToDelete = todayBackups.slice(1);

        console.log(`Found ${todayBackups.length} backup files for today`);
        console.log(`Keeping latest: ${todayBackups[0]?.filename || 'none'}`);
        console.log(`Deleting ${filesToDelete.length} older files`);

        filesToDelete.forEach(backup => {
            try {
                fs.unlinkSync(backup.fullPath);
                console.log(`Deleted: ${backup.filename}`);
            } catch (error) {
                console.error(`Failed to delete ${backup.filename}:`, error);
            }
        });

    } catch (error) {
        console.error('Error cleaning up backup files:', error);
        throw error;
    }
}
export async function validateBackupFile() {

}

export type ISettings = {
    activate_batch_mode: string;
    address: string;

    admin_password: string;

    company_id: string;

    company_name: string;

    default_markup: string;

    digital_address: string;

    duplicate_record_timeout: string;

    email: string;

    logo: string;

    number_of_shifts: string;

    phone: string;

    receipt_extra_info: string;

    receipt_font_size: string;

    receipt_footer: string;

    receipt_logo: string;

    receipt_product_data: string;

    receipt_show_borders: string;

    receipt_show_credits: string;

    receipt_show_customer: string;

    restrict_zero_stock_sales: string;

    show_tax_on_receipt: string;

    tax: string;

    tax_title: string;

}