export interface IQrCodeItem {
    id: number;
    name: string;
    targetUrl: string;
    code: string;
    isActive: boolean;
    createAt: string;
    scanCount: number;
}