import { BaseService } from "@/lib/api";
import { Order } from "@/stores";
import { B2BOrder } from "@/types/b2b-order";

interface EmailNotificationPayload {
    orderData: Order;
    ownerEmail: string;
}

interface B2BEmailOrderData {
    order_number: string;
    created_at: string;
    order_status: string;
    payment_status: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_document: string;
    subtotal: number;
    tax_amount: number;
    shipping_cost: number;
    discount_amount: number;
    total_amount: number;
    payment_method: string;
    currency: string;
    notes: string;
    delivery_address: string;
    delivery_city: string;
    delivery_state: string;
    delivery_postal_code: string;
    delivery_contact_name: string;
    delivery_contact_phone: string;
    delivery_notes: string;
    payment_terms: string;
    purchase_order_number: string;
    priority_level: string;
    internal_notes: string;
    store_notes: string;
    items: Array<{
        product_sku: string;
        product_name: string;
        product_description: string;
        product_image: string;
        product_brand: string;
        unit_price: number;
        retail_price: number;
        quantity: number;
        total_price: number;
        discount_percentage: number;
        discount_amount: number;
        tax_rate: number;
        tax_amount: number;
        item_notes: string;
    }>;
}

interface B2BEmailNotificationPayload {
    orderData: B2BEmailOrderData;
    ownerEmail: string;
}

class EmailNotificationService extends BaseService {
    constructor() {
        super( process.env.NEXT_PUBLIC_API_URL + "/api");
    }

    public async sendEmailNotification(orderData: Order, ownerEmail: string) {
        try {
            const payload: EmailNotificationPayload = {
                orderData,
                ownerEmail
            };
            
            const response = await this.post(`/email/order`, payload);
            return response;
        } catch (error) {
            console.error('Error al enviar notificación por email:', error);
            throw error;
        }
    }

    public async sendB2BEmailNotification(orderData: B2BEmailOrderData, ownerEmail: string) {
        try {
            const payload: B2BEmailNotificationPayload = {
                orderData,
                ownerEmail
            };
            
            const response = await this.post(`/email/b2b`, payload);
            return response;
        } catch (error) {
            console.error('Error al enviar notificación B2B por email:', error);
            throw error;
        }
    }
}

const emailNotificationService = new EmailNotificationService();
export default emailNotificationService;