import { BaseService } from "@/lib/api";
import { Order } from "@/stores";
import { B2BEmailNotificationPayload, B2BEmailOrderData, B2BOrder, EmailNotificationPayload } from "@/types/b2b-order";
import { API_CONSTANTS } from "@/lib/constans/constanst";


class EmailNotificationService extends BaseService {
    constructor() {
        const baseURL = API_CONSTANTS.EMAIL_NOTIFICATION_URL || process.env.NEXT_PUBLIC_API_URL;
        super(baseURL + "/api");
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
            // Si es un error 404, podría ser que el servicio no esté disponible
            if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 404) {
                return { success: false, message: 'Servicio de notificaciones no disponible' };
            }
            
            throw error;
        }
    }
}

const emailNotificationService = new EmailNotificationService();
export default emailNotificationService;