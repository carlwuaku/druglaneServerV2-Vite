import React from 'react';

export interface GlobalState {
    serverUrl: string;
    serverState: string;
    settings: ISettings | null;
    dbState: string;
    appName: string;
}

export interface ISettings {
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