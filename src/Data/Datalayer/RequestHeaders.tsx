export class RequestHeaders {
    static headers = () => {
        const headrs: any = {
            "Pragma": "no-cache",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "Content-Type": "application/json",
        };
        return headrs;
    }
}